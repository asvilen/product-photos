#!/usr/bin/env node
// Renders a collection video: resolves the collection config, extracts design palettes,
// generates music, captures the HTML animation frame-by-frame in headless Chromium and
// encodes it with ffmpeg.
//
//   node render.mjs rosa                 full render -> out/rosa.mp4
//   node render.mjs rosa --preview       serve a live, playable preview with music
//   node render.mjs rosa --stills 2,10   render single frames (seconds) -> out/stills/
//   node render.mjs rosa --music my.mp3  use your own track instead of the generated one
import { chromium } from 'playwright';
import { spawn, spawnSync, execFileSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { extractPalette } from './palette.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT = path.join(HERE, 'out');
const CACHE = path.join(HERE, '.cache');

// How each scene type enters, and which part of the song it sits in.
const ENTER = { title: 'flash', design: 'whip', care: 'push', build: 'cut', sizes: 'flash', origin: 'stripes', outro: 'whip' };
const SECTION = { hook: 'intro', title: 'theme', design: 'theme', care: 'break', build: 'build', sizes: 'theme', origin: 'theme', outro: 'outro' };
const SWOOSH = new Set(['whip', 'push', 'zoom', 'stripes']);
const DESIGN_LAYOUTS = ['full', 'strips', 'split'];

const args = parseArgs(process.argv.slice(2));
const id = args._[0] || 'rosa';
const FPS = Number(args.fps || 30);
const WORKERS = Number(args.workers || Math.min(6, Math.max(1, os.cpus().length - 2)));

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });

const config = buildConfig(id);
const musicPath = args.music ? path.resolve(args.music) : generateMusic(config);

const server = await serve(config, musicPath);
const base = `http://127.0.0.1:${server.address().port}/video/template/index.html?c=${id}`;

if (args.preview) {
  console.log(`Preview: ${base}&play`);
  console.log('Ctrl+C to stop.');
} else {
  try {
    if (args.stills) await renderStills(args.stills.split(',').map(Number));
    else await renderVideo();
  } finally {
    server.close();
  }
}

// ---------------------------------------------------------------------------------------

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) out._.push(a);
    else if (argv[i + 1] && !argv[i + 1].startsWith('--')) out[a.slice(2)] = argv[++i];
    else out[a.slice(2)] = true;
  }
  return out;
}

// Image refs look like "florentina/main" or "magnolia/shape__round": a design folder
// inside the collection plus the suffix after "__" in the filename.
function resolveImage(collectionDir, ref) {
  const [dir, key] = ref.split('/');
  const abs = path.join(REPO, collectionDir, dir);
  const re = new RegExp(`__${key.replace(/[-_]/g, '[-_]')}\\.(png|jpe?g)$`, 'i');
  const file = fs.readdirSync(abs).find((f) => re.test(f));
  if (!file) throw new Error(`No image for "${ref}" in ${collectionDir}/${dir}`);
  return '/' + path.posix.join(collectionDir, dir, file);
}

function buildConfig(id) {
  const src = JSON.parse(fs.readFileSync(path.join(HERE, 'collections', `${id}.json`), 'utf8'));
  const img = (ref) => resolveImage(src.root, ref);
  const beat = 60 / src.bpm;

  const designs = src.designs.map((d, i) => {
    const detail = img(`${d.dir}/${d.detail || 'closeup-2'}`);
    const colors = palette(path.join(REPO, detail));
    return {
      ...d,
      index: i + 1,
      main: img(`${d.dir}/${d.image || 'main'}`),
      detail,
      closeup1: img(`${d.dir}/closeup-1`),
      setting: img(`${d.dir}/natural-setting`),
      lens: img(`${d.dir}/${d.lens || d.detail || 'closeup-2'}`),
      palette: d.palette || colors.swatches,
      accent: d.accent || colors.accent,
    };
  });

  // Any "image"/"images" value anywhere in a scene is an image ref to resolve.
  const resolveRefs = (v, key) => {
    if (Array.isArray(v)) return v.map((x) => resolveRefs(x, key));
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolveRefs(x, k)]));
    return typeof v === 'string' && (key === 'image' || key === 'images') ? img(v) : v;
  };

  // Expand scenes into a flat timeline; the "designs" scene becomes one scene per design.
  const timeline = [];
  let at = 0;
  const push = (scene) => {
    timeline.push({ enter: ENTER[scene.type] || 'cut', ...scene, at, start: at * beat, duration: scene.beats * beat });
    at += scene.beats;
  };
  for (const scene of src.scenes) {
    const s = resolveRefs(scene);
    if (s.type === 'designs') {
      designs.forEach((d, i) => push({
        type: 'design', beats: s.beatsEach, design: d, total: designs.length,
        layout: DESIGN_LAYOUTS[i % DESIGN_LAYOUTS.length], dir: i % 2 ? -1 : 1, side: i % 2 ? 'right' : 'left',
      }));
    } else push(s);
  }

  const patterns = (src.patterns || designs.map((d) => `${d.dir}/closeup-2`)).map(img);
  return { ...src, designs, patterns, timeline, duration: at * beat, beat };
}

// The song follows the scenes: consecutive scenes in the same section merge, and every
// swiping transition gets a swoosh on its beat.
function musicPlan(config) {
  const sections = [];
  const swooshes = [];
  for (const s of config.timeline) {
    const name = s.music || SECTION[s.type] || 'drop';
    const last = sections[sections.length - 1];
    if (last && last[0] === name) last[1] += s.beats;
    else sections.push([name, s.beats]);
    if (s.at > 0 && SWOOSH.has(s.enter)) swooshes.push(s.at);
    if (s.type === 'care') for (let k = 1; k < s.items.length; k++) swooshes.push(s.at + (k * s.beats) / s.items.length);
  }
  return { bpm: config.bpm, seed: config.music?.seed ?? 7, piece: config.music?.piece || 'nachtmusik', sections, swooshes };
}

// Palette extraction is slowish, so results are cached per image until it changes.
function palette(file) {
  const cacheFile = path.join(CACHE, 'palette-' + file.replace(/[^a-z0-9]+/gi, '_') + '.json');
  const mtime = fs.statSync(file).mtimeMs;
  if (fs.existsSync(cacheFile)) {
    const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    if (cached.mtime === mtime && cached.v === 2) return cached.result;
  }
  const result = extractPalette(file);
  fs.writeFileSync(cacheFile, JSON.stringify({ v: 2, mtime, result }));
  return result;
}

function generateMusic(config) {
  const out = path.join(CACHE, `${config.id}-music.wav`);
  const plan = path.join(CACHE, `${config.id}-music-plan.json`);
  fs.writeFileSync(plan, JSON.stringify(musicPlan(config)));
  console.log('Generating music…');
  execFileSync('python3', [path.join(HERE, 'music', 'generate.py'), '--plan', plan, '--out', out], { stdio: 'inherit' });
  return out;
}

function serve(config, musicPath) {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png',
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.wav': 'audio/wav', '.mp3': 'audio/mpeg',
    '.json': 'application/json' };
  const srv = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file;
    if (url === `/__config/${config.id}.json`) {
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify(config));
    }
    if (url === `/__music/${config.id}`) file = musicPath;
    else file = path.join(REPO, url);
    if (!file.startsWith(REPO) && file !== musicPath) return res.writeHead(403).end();
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) return res.writeHead(404).end();
      const type = types[path.extname(file).toLowerCase()] || 'application/octet-stream';
      // Range support is what lets the preview's <audio> seek when scrubbing.
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (range && (range[1] || range[2])) {
        const start = range[1] ? Number(range[1]) : Math.max(0, st.size - Number(range[2]));
        const end = range[1] && range[2] ? Math.min(Number(range[2]), st.size - 1) : st.size - 1;
        if (start > end) return res.writeHead(416, { 'content-range': `bytes */${st.size}` }).end();
        res.writeHead(206, { 'content-type': type, 'accept-ranges': 'bytes', 'content-range': `bytes ${start}-${end}/${st.size}`, 'content-length': end - start + 1 });
        return fs.createReadStream(file, { start, end }).pipe(res);
      }
      res.writeHead(200, { 'content-type': type, 'accept-ranges': 'bytes', 'content-length': st.size });
      fs.createReadStream(file).pipe(res);
    });
  });
  return new Promise((ok) => srv.listen(Number(args.port || 0), '127.0.0.1', () => ok(srv)));
}

async function launch() {
  const executablePath = process.env.CHROME || findCachedChromium();
  return chromium.launch({ executablePath, args: ['--force-color-profile=srgb', '--hide-scrollbars'] });
}

// Use an already-downloaded Playwright Chromium if the pinned version isn't installed.
function findCachedChromium() {
  const root = path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
  try {
    chromium.executablePath() && fs.accessSync(chromium.executablePath());
    return undefined;
  } catch {}
  if (!fs.existsSync(root)) return undefined;
  const dirs = fs.readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const exe = path.join(root, d, 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell');
    if (fs.existsSync(exe)) return exe;
  }
  return undefined;
}

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('page error:', e.message));
  await page.goto(base);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
  return page;
}

async function renderStills(times) {
  const dir = path.join(OUT, 'stills');
  fs.mkdirSync(dir, { recursive: true });
  const browser = await launch();
  const page = await openPage(browser);
  for (const t of times) {
    await page.evaluate((t) => window.__seek(t), t);
    const file = path.join(dir, `${id}-${t.toFixed(2)}s.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 90 });
    console.log(file);
  }
  await browser.close();
}

async function renderVideo() {
  const total = Math.round(config.duration * FPS);
  const tmp = fs.mkdtempSync(path.join(CACHE, 'frames-'));
  const browser = await launch();
  const chunk = Math.ceil(total / WORKERS);
  let done = 0;
  const started = Date.now();
  console.log(`Rendering ${total} frames (${config.duration.toFixed(1)}s @ ${FPS}fps) with ${WORKERS} workers…`);

  const segments = await Promise.all(
    Array.from({ length: WORKERS }, async (_, w) => {
      const from = w * chunk, to = Math.min(total, from + chunk);
      const seg = path.join(tmp, `seg-${w}.mp4`);
      if (from >= to) return null;
      const page = await openPage(browser);
      const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), seg], { stdio: ['pipe', 'inherit', 'inherit'] });
      const closed = new Promise((ok, fail) => ff.on('close', (c) => (c === 0 ? ok() : fail(new Error(`ffmpeg exited ${c}`)))));
      for (let f = from; f < to; f++) {
        await page.evaluate((t) => window.__seek(t), f / FPS);
        const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
        if (!ff.stdin.write(buf)) await new Promise((ok) => ff.stdin.once('drain', ok));
        if (++done % 60 === 0) process.stdout.write(`\r  ${done}/${total} frames (${((Date.now() - started) / 1000).toFixed(0)}s)`);
      }
      ff.stdin.end();
      await closed;
      await page.close();
      return seg;
    }),
  );
  await browser.close();
  process.stdout.write(`\r  ${total}/${total} frames (${((Date.now() - started) / 1000).toFixed(0)}s)\n`);

  const list = path.join(tmp, 'segments.txt');
  fs.writeFileSync(list, segments.filter(Boolean).map((s) => `file '${s}'`).join('\n'));

  // Two-pass loudness normalisation so every collection video plays at the same level.
  const fadeOut = 1.5;
  const dur = config.duration.toFixed(3);
  const pre = `atrim=0:${dur},afade=t=out:st=${(config.duration - fadeOut).toFixed(3)}:d=${fadeOut}`;
  const measured = measureLoudness(musicPath, pre);
  const norm = `loudnorm=I=-14:TP=-1.0:LRA=11:measured_I=${measured.input_i}:measured_TP=${measured.input_tp}:measured_LRA=${measured.input_lra}:measured_thresh=${measured.input_thresh}:offset=${measured.target_offset}:linear=true`;

  const out = path.join(OUT, `${id}.mp4`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-i', musicPath,
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', `${pre},${norm}`, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k',
    '-t', dur, '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`Done: ${out}`);
}

function measureLoudness(file, pre) {
  const { stderr } = spawnSync('ffmpeg', ['-hide_banner', '-i', file, '-af', `${pre},loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' });
  return JSON.parse(stderr.slice(stderr.lastIndexOf('{'), stderr.lastIndexOf('}') + 1));
}
