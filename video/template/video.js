/* global gsap */
// Builds one GSAP timeline for a collection video from the resolved config served by
// render.mjs. Everything is timed in beats so cuts and accents land on the music (several
// land on the melody's own notes). The timeline is paused and driven by window.__seek(t),
// so every frame is deterministic; with ?play it runs in real time with the music.
(async function main() {
  const params = new URLSearchParams(location.search);
  const id = params.get('c');
  const cfg = await (await fetch(`/__config/${id}.json`)).json();
  // Text is measured while building, so the fonts have to be ready first.
  await Promise.all(['400 100px Anton', '500 40px "Cormorant Garamond"', 'italic 500 40px "Cormorant Garamond"',
    '400 20px Jost', '500 20px Jost'].map((f) => document.fonts.load(f)));

  const stage = document.getElementById('stage');
  const tl = gsap.timeline({ paused: true });
  const beat = cfg.beat;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const rand = mulberry32(cfg.music?.seed ?? 7); // seeded so every render worker shakes identically
  const backgrounds = new Set();

  // ---- DOM helpers --------------------------------------------------------------------
  const PX = new Set(['left', 'top', 'right', 'bottom', 'width', 'height', 'fontSize', 'marginTop']);
  function h(tag, cls, parent, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    if (parent) parent.appendChild(el);
    return el;
  }
  function box(parent, css = {}, cls = 'abs', text) {
    const el = h('div', cls, parent, text);
    for (const [k, v] of Object.entries(css)) {
      if (k.startsWith('--')) el.style.setProperty(k, v);
      else el.style[k] = typeof v === 'number' && PX.has(k) ? `${v}px` : v;
    }
    return el;
  }
  function img(src, parent, cls = 'cover') {
    const el = h('img', cls, parent);
    el.src = src;
    el.decoding = 'sync';
    return el;
  }
  function svgEl(parent, w, h_, css = {}, viewBox = `0 0 ${w} ${h_}`) {
    const el = document.createElementNS(SVGNS, 'svg');
    el.setAttribute('width', w);
    el.setAttribute('height', h_);
    el.setAttribute('viewBox', viewBox);
    Object.assign(el.style, css);
    parent.appendChild(el);
    return el;
  }
  function shape(parent, tag, attrs) {
    const el = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    parent.appendChild(el);
    return el;
  }
  const bg = (url) => {
    backgrounds.add(url);
    return `url("${url}")`;
  };
  // Shrinks an element's font until it is at most maxW wide.
  function fit(el, maxW, maxSize) {
    el.style.fontSize = `${maxSize}px`;
    const w = el.offsetWidth;
    if (w > maxW) el.style.fontSize = `${(maxSize * maxW) / w}px`;
  }
  // Splits text into masked words of animatable characters.
  function split(el, text) {
    el.textContent = '';
    const chars = [];
    text.split(' ').forEach((w, i, all) => {
      const word = h('span', 'word', el);
      for (const c of w) chars.push(h('span', 'char', word, c));
      if (i < all.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return chars;
  }
  function paletteRow(parent, d) {
    const row = h('div', 'palette', parent);
    return d.palette.map((c) => {
      const sp = h('span', '', row);
      sp.style.background = c;
      return sp;
    });
  }
  const pad2 = (n) => String(n).padStart(2, '0');
  const counter = (s) => `${pad2(s.design.index)} / ${pad2(s.total)}`;
  const designFor = (src) => cfg.designs.find((d) => src && src.includes(`/${d.dir}/`));
  const B = (s, n) => s.start + n * beat; // beat n of scene s, in seconds

  const cam = box(stage, {}, 'fill'); // camera shake moves every scene
  const fx = box(stage, { zIndex: 50, pointerEvents: 'none' }, 'fill'); // flashes and wipes, unshaken
  const defs = shape(svgEl(stage, 0, 0, { position: 'absolute' }), 'defs', {});

  // ---- motion vocabulary --------------------------------------------------------------
  // Big type or objects landing: scale down + unblur, optionally from an offset.
  function slam(el, at, o = {}) {
    const from = { scale: o.scale ?? 1.6, opacity: o.opacity ?? 0, rotate: o.rotate ?? 0, x: o.x ?? 0, y: o.y ?? 0 };
    const to = { scale: 1, opacity: 1, rotate: 0, x: 0, y: 0, duration: o.duration ?? 0.45, ease: o.ease ?? 'expo.out' };
    if (o.blur !== 0) {
      from.filter = `blur(${o.blur ?? 12}px)`;
      to.filter = 'blur(0px)';
    }
    tl.fromTo(el, from, to, at);
  }
  const rise = (el, at, o = {}) =>
    tl.fromTo(el, { opacity: 0, y: o.y ?? 30, x: o.x ?? 0 }, { opacity: 1, y: 0, x: 0, duration: o.duration ?? 0.6, stagger: o.stagger || 0, ease: 'power3.out' }, at);
  const pop = (el, at, o = {}) =>
    tl.fromTo(el, { opacity: 0, scale: o.from ?? 0.3 }, { opacity: 1, scale: 1, duration: o.duration ?? 0.5, stagger: o.stagger || 0, ease: 'back.out(1.7)' }, at);
  const chars = (els, at, o = {}) =>
    tl.fromTo(els, { yPercent: 118 }, { yPercent: 0, duration: o.duration ?? 0.6, stagger: o.stagger ?? 0.03, ease: 'expo.out' }, at);
  function draw(el, at, duration = 0.6) {
    const len = el.getTotalLength();
    el.style.strokeDasharray = `${len} ${len}`;
    el.style.opacity = 0;
    tl.set(el, { opacity: 1 }, at);
    tl.fromTo(el, { strokeDashoffset: len }, { strokeDashoffset: 0, duration, ease: 'power2.inOut' }, at);
  }
  // A gentle zoom punch on each beat.
  function pulse(el, s, from, to, amount = 0.012) {
    for (let b = from; b < to; b++) {
      tl.fromTo(el, { scale: 1 + amount }, { scale: 1, duration: beat * 0.85, ease: 'power2.out', immediateRender: false }, B(s, b));
    }
  }
  // Camera shake with a decaying, seeded jitter.
  function shake(at, amp = 8, dur = 0.26) {
    const steps = 7;
    const keyframes = [];
    for (let i = 0; i < steps; i++) {
      const k = 1 - i / steps;
      keyframes.push({ x: (rand() * 2 - 1) * amp * k, y: (rand() * 2 - 1) * amp * k, duration: dur / (steps + 1) });
    }
    keyframes.push({ x: 0, y: 0, duration: dur / (steps + 1) });
    tl.to(cam, { keyframes, ease: 'none' }, at);
  }
  function flash(at, o = {}) {
    const f = box(fx, { background: o.color || '#fffaf0', opacity: 0 }, 'fill');
    tl.fromTo(f, { opacity: o.peak ?? 0.85 }, { opacity: 0, duration: o.duration ?? 0.55, ease: 'power2.out', immediateRender: false }, at);
  }
  function ripple(parent, x, y, at, color = 'var(--cream)', r = 560) {
    const g = svgEl(parent, 1920, 1080, { position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' });
    const c = shape(g, 'circle', { cx: x, cy: y, r: 20, fill: 'none', stroke: color, 'stroke-width': 3, opacity: 0 });
    tl.fromTo(c, { attr: { r: 20 }, opacity: 0.8 }, { attr: { r }, opacity: 0, duration: 1.1, ease: 'power2.out', immediateRender: false }, at);
  }
  // Directional motion blur (SVG filter) while something moves fast across the frame.
  let blurId = 0;
  function mblur(el, at, dur, amount = 40, axis = 'x', mode = 'in') {
    const id = `mb${blurId++}`;
    const filter = shape(defs, 'filter', { id, x: '-25%', y: '-25%', width: '150%', height: '150%', 'color-interpolation-filters': 'sRGB' });
    const blur = shape(filter, 'feGaussianBlur', { stdDeviation: '0 0' });
    const peak = axis === 'x' ? `${amount} 0` : `0 ${amount}`;
    const [from, to] = mode === 'in' ? [peak, '0 0'] : ['0 0', peak];
    tl.set(el, { filter: `url(#${id})` }, at);
    tl.fromTo(blur, { attr: { stdDeviation: from } }, { attr: { stdDeviation: to }, duration: dur, ease: mode === 'in' ? 'power2.out' : 'power2.in', immediateRender: false }, at);
    tl.set(el, { filter: 'none' }, at + dur + 0.001);
  }

  // ---- scenes -------------------------------------------------------------------------
  const BUILD = {
    // One word per beat, alternating photo-with-type and pattern-filled type.
    hook(s, el) {
      el.classList.add('linen');
      let last;
      s.words.forEach((w, k) => {
        const at = B(s, k);
        const layer = box(el, {}, 'fill');
        if (k) {
          layer.style.visibility = 'hidden';
          tl.set(layer, { visibility: 'visible' }, at);
        }
        if (k < s.words.length - 1) tl.set(layer, { visibility: 'hidden' }, B(s, k + 1));
        const style = w.style || (k % 2 ? 'mask' : 'solid');
        if (style === 'solid') {
          const im = img(w.image, layer);
          tl.fromTo(im, { scale: 1.3 }, { scale: 1.05, duration: beat * 1.6, ease: 'expo.out' }, at);
          box(layer, { background: 'rgba(18,10,6,.3)' }, 'fill');
        } else layer.classList.add('linen');
        last = box(layer, {}, 'fill flex-center');
        const word = h('div', `display ${style === 'mask' ? 'masktext' : 'cream shadow'}`, last, w.text);
        if (style === 'mask') word.style.backgroundImage = bg(w.image);
        fit(word, 1700, 800);
        if (k === 0) slam(word, at, { scale: 1.15, opacity: 1, blur: 0, duration: 0.6 });
        else {
          slam(word, at, { scale: 1.6, rotate: k % 2 ? 4 : -4, duration: 0.45 });
          shake(at, 7);
        }
        if (style === 'mask') tl.fromTo(word, { backgroundPosition: '50% 20%' }, { backgroundPosition: '50% 80%', duration: beat * 1.3, ease: 'none' }, at);
      });
      // The music stops for a lone pickup note: the last word leans in.
      tl.to(last, { scale: 1.1, duration: beat * 0.5, ease: 'power2.in' }, B(s, s.beats - 0.5));
    },

    // The theme starts: the name lands on its first notes, each letter a different pattern.
    title(s, el) {
      el.classList.add('linen');
      const pulser = box(el, {}, 'fill');
      const col = box(pulser, {}, 'fill flex-center col');
      const word = h('div', 'display', col);
      word.style.letterSpacing = '.04em';
      const letters = [...cfg.title].map((c) => h('span', 'masktext letter', word, c));
      fit(word, 1500, 700);
      const hits = [0, 1.5, 2, 3.5]; // G . . D G . . D
      letters.forEach((l, i) => {
        l.style.backgroundImage = bg(cfg.patterns[i % cfg.patterns.length]);
        slam(l, B(s, hits[i] ?? i * 0.5), { scale: 2.2, y: i % 2 ? 140 : -140, rotate: i % 2 ? 8 : -8, blur: 16, duration: 0.55 });
        tl.fromTo(l, { backgroundPosition: '50% 25%' }, { backgroundPosition: '50% 75%', duration: s.duration, ease: 'none' }, s.start);
      });
      const rule = h('div', 'rule', col);
      const sub = h('div', 'wide-caps', col, cfg.subtitle);
      const tag = h('div', 'italic ink', col, s.tagline);
      Object.assign(tag.style, { fontSize: '56px', marginTop: '24px' });
      tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, B(s, 4));
      tl.fromTo(sub, { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.out' }, B(s, 4));
      rise(tag, B(s, 6));
      ripple(el, 960, 450, B(s, 2), 'var(--gold)');
      pulse(pulser, s, 1, s.beats - 1);
      letters.forEach((l, i) => tl.to(l, { x: (i - 1.5) * 240, opacity: 0, duration: beat, ease: 'power2.in' }, B(s, s.beats - 1)));
      tl.to([rule, sub, tag], { opacity: 0, duration: beat * 0.6 }, B(s, s.beats - 0.8));
    },

    // Two bars per design: a hero shot, then in close on the fabric with a lens.
    design(s, el) {
      const d = s.design;
      el.style.setProperty('--accent', d.accent);
      el.style.background = 'var(--ink)';
      const hero = box(el, {}, 'fill');
      LAYOUTS[s.layout](s, d, hero);
      pulse(hero, s, 1, 3);
      const detail = box(el, { visibility: 'hidden' }, 'fill');
      detailBar(s, d, detail);
      const t = B(s, 4), d0 = 0.6;
      tl.set(detail, { visibility: 'visible' }, t - d0 / 2);
      tl.fromTo(detail, { opacity: 0, scale: 1.18 }, { opacity: 1, scale: 1, duration: d0, ease: 'power2.inOut', immediateRender: false }, t - d0 / 2);
      tl.to(hero, { scale: 1.3, opacity: 0, duration: d0, ease: 'power2.in' }, t - d0 / 2);
      tl.set(hero, { visibility: 'hidden' }, t + d0 / 2 + 0.01);
    },

    // Easy-care claims, one per two beats, on panels that glide up from below.
    care(s, el) {
      const d = cfg.designs.find((x) => x.dir === s.accentFrom) || cfg.designs[0];
      el.style.setProperty('--accent', d.accent);
      const per = s.beats / s.items.length;
      const eyebrow = box(el, { left: 110, top: 96, zIndex: 20 }, 'abs eyebrow', s.eyebrow);
      s.items.forEach((it, k) => {
        const at = B(s, k * per);
        const dark = k % 2 === 1;
        const ink = dark ? 'var(--cream)' : 'var(--ink)';
        const panel = box(el, { background: dark ? 'var(--accent)' : 'var(--cream)', zIndex: k + 1 }, `fill${dark ? '' : ' linen'}`);
        if (k) {
          tl.fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' }, at - 0.28);
          mblur(panel, at - 0.28, 0.5, 30, 'y');
        }
        tl.set(eyebrow, { color: dark ? 'var(--cream)' : 'var(--accent)' }, k ? at : 0);
        const iconBox = box(panel, { left: 200, top: 360, width: 360, height: 360 }, 'abs');
        const ringEl = shape(svgEl(iconBox, 360, 360), 'circle', { cx: 180, cy: 180, r: 172, fill: 'none', stroke: dark ? 'var(--cream)' : 'var(--accent)', 'stroke-width': 4, transform: 'rotate(-90 180 180)' });
        const glyph = svgEl(iconBox, 220, 220, { position: 'absolute', left: '70px', top: '70px', overflow: 'visible' }, '0 0 48 48');
        const g = shape(glyph, 'g', { fill: 'none', stroke: ink, 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
        const paths = (ICONS[it.icon] || []).map((p) => shape(g, 'path', { d: p }));
        if (it.icon === 'wash') {
          const t = shape(g, 'text', { x: 24, y: 33, 'text-anchor': 'middle', fill: ink, stroke: 'none', 'font-family': 'Jost', 'font-size': 11, 'font-weight': 500 });
          t.textContent = '30°';
        }
        const text = box(panel, { left: 640, top: 0, width: 1180, height: 1080 }, 'abs care-text');
        let big;
        if (it.big) {
          big = h('div', `display ${dark ? 'cream' : 'accent'}`, text, it.big);
          fit(big, 1150, 400);
        }
        const main = h('div', `display ${dark ? 'cream' : 'ink'}`, text, it.text);
        fit(main, 1150, it.big ? 150 : 200);
        let sub;
        if (it.sub) {
          sub = h('div', 'tag', text, it.sub);
          Object.assign(sub.style, { color: ink, fontSize: '70px', marginTop: '12px' });
        }
        pop(iconBox, at, { from: 0.5 });
        draw(ringEl, at, 0.7);
        paths.forEach((p) => draw(p, at + 0.1, 0.7));
        if (big) {
          slam(big, at, { scale: 1.4, blur: 10, duration: 0.55 });
          rise(main, at + beat * 0.5, { x: 60, y: 0 });
        } else rise(main, at, { x: 60, y: 0, duration: 0.7 });
        if (sub) rise(sub, at + beat * 0.75, { y: 24 });
      });
    },

    // Tension before the theme returns: words stack up, everything leans in, then black.
    build(s, el) {
      el.style.background = 'var(--ink)';
      const col = box(el, {}, 'fill flex-center col');
      const sizes = [200, 260, 340];
      s.words.forEach((w, k) => {
        const e = h('div', 'display cream', col, w);
        fit(e, 1700, sizes[k] || 260);
        slam(e, B(s, k), { scale: 2, blur: 14, duration: 0.4 });
        shake(B(s, k), 6 + k * 3);
      });
      tl.fromTo(col, { scale: 1 }, { scale: 1.25, duration: beat * 0.5, ease: 'power2.in', immediateRender: false }, B(s, s.beats - 1));
      tl.set(col, { opacity: 0 }, B(s, s.beats - 0.5)); // silence, one note, then the drop
    },

    // Four shapes landing on the theme's opening notes, sizes counting up after.
    sizes(s, el) {
      el.classList.add('linen');
      const pulser = box(el, {}, 'fill');
      const head = box(pulser, { left: 0, top: 120, width: 1920 }, 'abs flex-center');
      const hd = h('div', 'display ink', head, s.heading);
      fit(hd, 1700, 130);
      slam(hd, B(s, 0), { scale: 1.4, duration: 0.5 });
      const w = 400, gap = 36, n = s.shapes.length;
      const x0 = (1920 - (n * w + (n - 1) * gap)) / 2;
      const hits = [0, 1.5, 2, 3.5];
      s.shapes.forEach((sh, i) => {
        const card = box(pulser, { left: x0 + i * (w + gap) }, 'card');
        const d = designFor(sh.image);
        if (d) card.style.setProperty('--accent', d.accent);
        const im = img(sh.image, h('div', 'img', card), '');
        h('div', 'display ink shape', card, sh.name);
        const pills = h('div', 'pills', card);
        const at = B(s, hits[i] ?? i * 0.5);
        tl.fromTo(card, { y: -1150, rotate: [-7, 5, -4, 6][i % 4] }, { y: 0, rotate: 0, duration: 0.55, ease: 'back.out(1.2)' }, at - 0.25);
        tl.fromTo(im, { scale: 1.2 }, { scale: 1, duration: 1.4, ease: 'power3.out' }, at);
        sh.sizes.forEach((size, j) => {
          const pill = h('div', 'pill', pills);
          const nums = [];
          if (size.length === 1) pill.append('Ø ');
          size.forEach((v, k) => {
            if (k) pill.append(' × ');
            nums.push([h('span', '', pill, String(v)), v]);
          });
          pill.append(' cm');
          const pat = B(s, 4 + i * 0.5 + j * 0.25);
          pop(pill, pat, { from: 0.5 });
          for (const [span, v] of nums) tl.fromTo(span, { textContent: 0 }, { textContent: v, snap: { textContent: 10 }, duration: 0.5, ease: 'power2.out' }, pat);
        });
      });
      pulse(pulser, s, 3, s.beats);
    },

    origin(s, el) {
      const d = designFor(s.image);
      if (d) el.style.setProperty('--accent', d.accent);
      const frame = box(el, {}, 'frame fill');
      const im = img(s.image, frame);
      tl.fromTo(im, { scale: 1.25 }, { scale: 1.05, duration: s.duration + 0.5, ease: 'power2.out' }, s.start);
      box(el, {}, 'fill scrim-left');
      const col = box(el, { left: 110, top: 0, width: 1600, height: 1080, display: 'flex', flexDirection: 'column', justifyContent: 'center' }, 'abs');
      const [l1, l2] = s.heading.split('\n');
      const a = h('div', 'display cream shadow', col, l1);
      fit(a, 900, 180);
      const b = h('div', 'display cream shadow', col, l2);
      fit(b, 1150, 330);
      const pts = h('div', 'points', col);
      const rows = s.points.map((p) => {
        const r = h('div', 'point', pts);
        h('b', '', r);
        r.append(p);
        return r;
      });
      rise(a, B(s, 0.75), { x: -60, y: 0 });
      slam(b, B(s, 1), { scale: 1.5, duration: 0.5 });
      rise(rows, B(s, 1.5), { stagger: beat / 5, y: 24 });
    },

    // Every design pops in on the melody, then the final chord lands the name.
    outro(s, el) {
      el.classList.add('linen');
      const grid = box(el, {}, 'fill');
      const cols = 3, gap = 24, tw = (1920 - 240 - gap * (cols - 1)) / cols, th = Math.round((tw * 9) / 16);
      const rows = Math.ceil(cfg.designs.length / cols);
      const top0 = (1080 - (rows * th + (rows - 1) * gap)) / 2;
      const hits = [0, 1.5, 2, 2.5, 3, 3.5]; // the coda's G . D B G B D
      cfg.designs.forEach((d, i) => {
        const t = box(grid, { left: 120 + (i % cols) * (tw + gap), top: top0 + Math.floor(i / cols) * (th + gap), width: tw, height: th }, 'tile');
        img(d.main, t);
        tl.fromTo(t, { scale: 0.3, opacity: 0, rotate: i % 2 ? 6 : -6 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.55, ease: 'back.out(1.5)' }, B(s, hits[i] ?? i * 0.5));
      });
      pulse(grid, s, 1, 4);
      tl.to(grid, { scale: 1.08, opacity: 0.25, filter: 'blur(6px)', duration: 0.9, ease: 'power2.inOut' }, B(s, 4));
      const hit = B(s, 6); // the final chord
      flash(hit, { peak: 0.7 });
      shake(hit, 8);
      const col = box(el, {}, 'fill flex-center col');
      const word = h('div', 'display', col);
      word.style.letterSpacing = '.04em';
      const letters = [...cfg.title].map((c) => h('span', 'masktext letter', word, c));
      fit(word, 1400, 600);
      letters.forEach((l, i) => {
        l.style.backgroundImage = bg(cfg.patterns[i % cfg.patterns.length]);
        slam(l, hit + i * 0.06, { scale: 2, blur: 14, duration: 0.6 });
      });
      const rule = h('div', 'rule', col);
      const sub = h('div', 'wide-caps', col, cfg.subtitle);
      const tag = h('div', 'italic ink', col, s.tagline);
      Object.assign(tag.style, { fontSize: '56px', marginTop: '22px' });
      const foot = h('div', 'eyebrow', col, s.footer);
      Object.assign(foot.style, { marginTop: '34px', color: 'var(--accent)' });
      tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, hit + beat * 0.5);
      tl.fromTo(sub, { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.out' }, hit + beat * 0.5);
      rise(tag, hit + beat);
      rise(foot, hit + beat * 1.5);
      ripple(el, 960, 420, hit, 'var(--gold)');
      tl.fromTo(col, { scale: 1 }, { scale: 1.04, duration: s.start + s.duration - hit, ease: 'none', immediateRender: false }, hit);
      // The piece closes with G, G-G, G: the name gets a last nudge on the final G.
      tl.fromTo(word, { scale: 1.05 }, { scale: 1, duration: beat, ease: 'power2.out', immediateRender: false }, B(s, 8));
      ripple(el, 960, 420, B(s, 8), 'var(--gold)', 700);
    },
  };

  // Hero shots (first bar of each design); three layouts rotate.
  const LAYOUTS = {
    full(s, d, root) {
      const frame = box(root, {}, 'frame fill');
      const im = img(d.main, frame);
      tl.fromTo(im, { scale: 1.2 }, { scale: 1.04, duration: beat * 4.5, ease: 'power2.out' }, s.start - 0.2);
      box(root, {}, 'fill scrim-bottom');
      const badge = box(root, { left: 110, top: 96 }, 'abs badge', counter(s));
      const name = box(root, { left: 104, bottom: 180 }, 'abs display cream shadow');
      const nameChars = split(name, d.name);
      fit(name, 1400, 240);
      const tag = box(root, { left: 112, bottom: 100 }, 'abs tag cream', d.tagline);
      rise(badge, B(s, 0.5), { y: -20 });
      chars(nameChars, B(s, 0), { stagger: 0.03, duration: 0.7 });
      rise(tag, B(s, 1.5), { y: 24 });
    },

    strips(s, d, root) {
      const srcs = [d.closeup1, d.main, d.setting];
      const gap = 10, w = (1920 - gap * 2) / 3;
      srcs.forEach((src, i) => {
        const fr = box(root, { left: i * (w + gap), top: 0, width: w, height: 1080 }, 'frame');
        const im = img(src, fr);
        tl.fromTo(fr, { yPercent: i % 2 ? -105 : 105 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, B(s, 0) - 0.35 + i * 0.12);
        tl.fromTo(im, { scale: 1.25 }, { scale: 1.05, duration: beat * 4.5, ease: 'power2.out' }, B(s, 0));
      });
      const band = box(root, { left: 0, top: 650, width: 1920, height: 250, background: 'var(--accent)', transformOrigin: s.dir > 0 ? 'left' : 'right' });
      tl.fromTo(band, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, B(s, 1.5) - 0.05);
      const nameBox = box(band, { left: 104, top: 0, height: 250 }, 'abs flex-center');
      const name = h('div', 'display cream', nameBox, d.name);
      fit(name, 1080, 190);
      rise(name, B(s, 1.75), { x: s.dir > 0 ? -80 : 80, y: 0, duration: 0.7 });
      const tag = box(band, { right: 110, top: 0, height: 250, display: 'flex', alignItems: 'center' }, 'abs tag cream', d.tagline);
      tag.style.fontSize = '52px';
      const badge = box(root, { left: 110, top: 96 }, 'abs badge', counter(s));
      rise(badge, B(s, 0.5), { y: -20 });
      rise(tag, B(s, 2.25), { x: 40, y: 0 });
    },

    split(s, d, root) {
      const block = box(root, { left: 0, top: 0, width: 880, height: 1080, background: 'var(--accent)' });
      const fr = box(root, { left: 880, top: 0, width: 1040, height: 1080 }, 'frame');
      const im = img(d.main, fr);
      tl.fromTo(block, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'expo.out' }, B(s, 0) - 0.1);
      tl.fromTo(fr, { xPercent: 35 }, { xPercent: 0, duration: 0.7, ease: 'expo.out' }, B(s, 0) - 0.1);
      mblur(fr, B(s, 0) - 0.1, 0.5, 40);
      tl.fromTo(im, { scale: 1.2 }, { scale: 1.04, duration: beat * 4.5, ease: 'power2.out' }, B(s, 0) - 0.1);
      const col = box(root, { left: 110, top: 0, width: 680, height: 1080, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }, 'abs');
      const badge = h('div', 'badge', col, counter(s));
      badge.style.marginBottom = '40px';
      d.name.split(' ').forEach((wd, i) => {
        const e = h('div', 'display cream', col, wd);
        fit(e, 680, 230);
        rise(e, B(s, i * 0.5), { x: i % 2 ? 90 : -90, y: 0, duration: 0.7 });
      });
      const tag = h('div', 'tag cream', col, d.tagline);
      tag.style.marginTop = '28px';
      rise(badge, B(s, 0.5), { y: -20 });
      rise(tag, B(s, 1.5));
    },
  };

  // Second bar of each design: in close on the fabric, a lens gliding over the print.
  function detailBar(s, d, root) {
    const left = s.side === 'left'; // text on the left, lens travels on the right
    const t = B(s, 4);
    const view = box(root, { transformOrigin: left ? '68% 50%' : '32% 50%' }, 'fill');
    img(d.lens, box(view, {}, 'frame fill'));
    tl.fromTo(view, { scale: 1 }, { scale: 1.06, duration: beat * 4.4, ease: 'none', immediateRender: false }, t - 0.2);
    box(root, {}, `fill ${left ? 'scrim-left' : 'scrim-right'}`);

    // The photo is square and covers the frame: 1920px wide, 420px cropped top and bottom.
    const R = 210, Z = 2.4;
    const path = d.loupe || (left ? [[1280, 380], [1500, 700]] : [[640, 380], [420, 700]]);
    const lens = box(view, { width: 2 * R, height: 2 * R }, 'lens');
    const inner = img(d.lens, h('div', 'lens-clip', lens), '');
    Object.assign(inner.style, { width: `${1920 * Z}px`, height: `${1920 * Z}px` });
    h('div', 'lens-ring', lens);
    const place = (p) => ({ x: p[0] - R, y: p[1] - R });
    const look = (p) => ({ x: R - Z * p[0], y: R - Z * (p[1] + 420) });
    tl.fromTo(lens, place(path[0]), { ...place(path[1]), duration: beat * 3.2, ease: 'power1.inOut' }, t + beat * 0.5);
    tl.fromTo(inner, look(path[0]), { ...look(path[1]), duration: beat * 3.2, ease: 'power1.inOut' }, t + beat * 0.5);
    pop(lens, t + beat * 0.25, { from: 0.3, duration: 0.7 });

    const panel = box(root, { [left ? 'left' : 'right']: 110, top: 0, height: 1080, width: 820, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: left ? 'flex-start' : 'flex-end' }, 'abs');
    const label = h('div', 'label', panel, 'In detail');
    const name = h('div', 'display cream shadow', panel);
    const nameChars = split(name, d.name);
    fit(name, 800, 150);
    name.style.marginTop = '18px';
    const palLabel = h('div', 'label', panel, 'Color palette');
    palLabel.style.marginTop = '44px';
    const palWrap = h('div', '', panel);
    palWrap.style.marginTop = '18px';
    const pal = paletteRow(palWrap, d);
    rise(label, t + beat * 0.25, { y: 16 });
    chars(nameChars, t + beat * 0.4, { stagger: 0.025, duration: 0.6 });
    rise(palLabel, t + beat * 0.9, { y: 12 });
    pop(pal, t + beat, { stagger: beat / 2, from: 0 }); // one swatch per eighth note
  }

  const ICONS = {
    wash: ['M7 15 L11 38 Q11.5 41 14.5 41 H33.5 Q36.5 41 37 38 L41 15', 'M5 15 C9 11 13 11 17 15 C21 19 25 19 29 15 C33 11 37 11 43 15'],
    stain: ['M24 5 C24 5 10 20 10 29 A14 14 0 0 0 38 29 C38 20 24 5 24 5 Z', 'M17 29 A7 7 0 0 0 24 36'],
    dry: ['M5 17 H29 A5.5 5.5 0 1 0 23.5 11.5', 'M5 25 H37 A5.5 5.5 0 1 1 31.5 30.5', 'M5 33 H21'],
    iron: ['M5 37 C5 29 11 22 21 22 H42 V37 Z', 'M15 22 C15 15 19 12 27 12 H42 V22', 'M28.5 30 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0'],
  };

  // ---- transitions (keyed by the entering scene; they straddle its first beat) --------
  function transition(s, prev) {
    const t = s.start;
    const show = (at) => tl.set(s.el, { visibility: 'visible' }, at);
    const hidePrev = (at) => tl.set(prev.el, { visibility: 'hidden' }, at);
    const d = 0.46, t0 = t - d * 0.55;
    switch (s.enter) {
      case 'whip':
      case 'push': {
        const axis = s.enter === 'whip' ? 'xPercent' : 'yPercent';
        const dir = s.dir || 1;
        show(t0);
        tl.fromTo(s.el, { [axis]: 100 * dir }, { [axis]: 0, duration: d, ease: 'power3.inOut', immediateRender: false }, t0);
        tl.to(prev.el, { [axis]: -40 * dir, duration: d, ease: 'power3.inOut' }, t0);
        mblur(s.el, t0, d, 50, axis === 'xPercent' ? 'x' : 'y', 'in');
        mblur(prev.el, t0, d, 50, axis === 'xPercent' ? 'x' : 'y', 'out');
        hidePrev(t0 + d + 0.01);
        break;
      }
      case 'stripes': {
        // Bulgarian flag bands sweep across, the scene swaps underneath, then they clear.
        ['#ffffff', '#00966e', '#d62612'].forEach((c, k) => {
          const band = box(fx, { left: 0, top: k * 360, width: 1920, height: 360, background: c });
          gsap.set(band, { xPercent: -101 });
          tl.to(band, { xPercent: 0, duration: 0.34, ease: 'power3.in' }, t - 0.42 + k * 0.04);
          tl.to(band, { xPercent: 101, duration: 0.4, ease: 'power3.inOut' }, t + beat * 0.75 + k * 0.05);
        });
        show(t);
        hidePrev(t);
        break;
      }
      case 'flash':
        show(t);
        hidePrev(t);
        flash(t);
        break;
      default:
        show(t);
        hidePrev(t);
    }
  }

  // ---- assemble -----------------------------------------------------------------------
  const scenes = cfg.timeline;
  scenes.forEach((s, i) => {
    s.el = h('div', 'scene', cam);
    s.el.style.zIndex = i + 1;
    BUILD[s.type](s, s.el);
  });
  scenes[0].el.style.visibility = 'visible';
  scenes.forEach((s, i) => i && transition(s, scenes[i - 1]));
  tl.set({}, {}, cfg.duration); // pad the timeline to the full video length

  // ---- wait for every image (including CSS backgrounds) to decode ---------------------
  await Promise.all([
    ...[...stage.querySelectorAll('img')].map((i) => i.decode().catch(() => console.warn('image failed', i.src))),
    ...[...backgrounds].map((u) => {
      const i = new Image();
      i.src = u;
      return i.decode().catch(() => console.warn('image failed', u));
    }),
  ]);

  window.__duration = cfg.duration;
  window.__seek = (time) => {
    tl.time(time, false);
  };
  tl.time(0);

  if (params.has('play')) setupPlayer();
  else document.body.classList.add('render');
  window.__ready = true;

  function setupPlayer() {
    const controls = document.getElementById('controls');
    const button = document.getElementById('play');
    const scrub = document.getElementById('scrub');
    const clock = document.getElementById('clock');
    controls.hidden = false;
    const audio = new Audio(`/__music/${id}`);
    const fitStage = () => {
      const k = Math.min(innerWidth / 1920, (innerHeight - 70) / 1080);
      stage.style.transform = `scale(${k})`;
      stage.style.margin = `${(1080 * k - 1080) / 2}px ${(1920 * k - 1920) / 2}px`;
    };
    fitStage();
    addEventListener('resize', fitStage);
    // The timeline position is the source of truth; the audio follows it on play/seek.
    let pos = 0;
    const show = (t) => {
      pos = Math.max(0, Math.min(t, cfg.duration));
      tl.time(pos, false);
      scrub.value = (pos / cfg.duration) * 1000;
      clock.textContent = `${pos.toFixed(1)}s / ${cfg.duration.toFixed(1)}s`;
    };
    button.onclick = () => {
      if (!audio.paused) return audio.pause();
      if (pos >= cfg.duration) show(0);
      audio.currentTime = pos;
      audio.play();
    };
    audio.onplay = () => (button.textContent = 'Pause');
    audio.onpause = () => (button.textContent = 'Play');
    scrub.oninput = () => {
      show((scrub.value / 1000) * cfg.duration);
      if (!audio.paused) audio.currentTime = pos;
    };
    gsap.ticker.add(() => {
      if (audio.paused) return;
      show(audio.currentTime);
      if (pos >= cfg.duration) audio.pause();
    });
  }

  function mulberry32(a) {
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
})();
