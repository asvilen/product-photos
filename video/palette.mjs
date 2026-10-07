// Extracts a small, characterful colour palette from a pattern photo.
// Clusters in CIELAB (so greys don't swamp small colourful areas), then picks swatches
// that are both common and distinct, favouring chroma.
import { execFileSync } from 'node:child_process';

const K = 16;

export function extractPalette(file, count = 5) {
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', 'crop=iw*0.72:ih*0.72,scale=80:80',
    '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']);
  const px = [];
  for (let i = 0; i < raw.length; i += 3) px.push(toLab([raw[i], raw[i + 1], raw[i + 2]]));

  const clusters = kmeans(px, K).filter((c) => c.share > 0.008);
  const chroma = (c) => Math.hypot(c.lab[1], c.lab[2]);

  const picked = [];
  while (picked.length < count && picked.length < clusters.length) {
    let best = null, bestScore = -1;
    for (const c of clusters) {
      if (picked.includes(c)) continue;
      const sep = picked.length ? Math.min(...picked.map((p) => deltaE(p.lab, c.lab))) : 40;
      if (sep < 14) continue;
      const score = Math.sqrt(c.share) * (1 + chroma(c) / 30) * Math.min(2.2, sep / 18);
      if (score > bestScore) { bestScore = score; best = c; }
    }
    if (!best) break;
    picked.push(best);
  }
  picked.sort((a, b) => b.lab[0] - a.lab[0]);

  // Accent: the most colourful mid-tone that isn't a speck; darkened until it reads as text.
  const mid = clusters.filter((c) => c.lab[0] > 25 && c.lab[0] < 80 && c.share > 0.01);
  const vivid = (c) => chroma(c) ** 1.6 * Math.sqrt(c.share);
  let accent = (mid.length ? mid : clusters).reduce((a, b) => (vivid(b) > vivid(a) ? b : a)).lab.slice();
  if (chroma({ lab: accent }) < 12) accent = clusters.reduce((a, b) => (b.lab[0] < a.lab[0] && b.share > 0.03 ? b : a)).lab.slice();
  accent[0] = Math.min(accent[0], 48);
  const boost = 1.15;
  accent[1] *= boost; accent[2] *= boost;

  return { swatches: picked.map((c) => hex(toRgb(c.lab))), accent: hex(toRgb(accent)) };
}

function kmeans(px, k) {
  // Deterministic farthest-point initialisation starting from the mean colour.
  const mean = [0, 1, 2].map((ch) => px.reduce((s, p) => s + p[ch], 0) / px.length);
  const centers = [px.reduce((a, b) => (deltaE(b, mean) < deltaE(a, mean) ? b : a)).slice()];
  const nearest = px.map((p) => deltaE(p, centers[0]));
  while (centers.length < k) {
    let far = 0;
    for (let i = 1; i < px.length; i++) if (nearest[i] > nearest[far]) far = i;
    centers.push(px[far].slice());
    px.forEach((p, i) => (nearest[i] = Math.min(nearest[i], deltaE(p, px[far]))));
  }
  let assign = [];
  for (let iter = 0; iter < 25; iter++) {
    assign = px.map((p) => {
      let best = 0, bd = Infinity;
      centers.forEach((c, j) => {
        const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
        if (d < bd) { bd = d; best = j; }
      });
      return best;
    });
    centers.forEach((c, j) => {
      const members = px.filter((_, i) => assign[i] === j);
      if (members.length) for (let ch = 0; ch < 3; ch++) c[ch] = members.reduce((s, m) => s + m[ch], 0) / members.length;
    });
  }
  return centers.map((lab, j) => ({ lab, share: assign.filter((a) => a === j).length / px.length }));
}

const deltaE = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const hex = (c) => '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

function toLab(rgb) {
  const [r, g, b] = rgb.map((v) => {
    v /= 255;
    return v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92;
  });
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047);
  const y = f(0.2126 * r + 0.7152 * g + 0.0722 * b);
  const z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

function toRgb([L, A, B]) {
  const fy = (L + 16) / 116, fx = fy + A / 500, fz = fy - B / 200;
  const inv = (t) => (t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787);
  const x = inv(fx) * 0.95047, y = inv(fy), z = inv(fz) * 1.08883;
  const lin = [3.2406 * x - 1.5372 * y - 0.4986 * z, -0.9689 * x + 1.8758 * y + 0.0415 * z, 0.0557 * x - 0.204 * y + 1.057 * z];
  return lin.map((v) => 255 * (v > 0.0031308 ? 1.055 * Math.max(v, 0) ** (1 / 2.4) - 0.055 : 12.92 * v));
}
