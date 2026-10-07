# Collection videos

Turns a collection's product photos into a ~50s promo video (1920×1080, 30fps): bold kinetic
typography, a hero shot plus an "in detail" close-up (a magnifying lens gliding over the print)
for every design, and a generated soundtrack. Every collection gets its own Mozart piece
(public domain) in a modern pop arrangement; several animations land on the melody's own notes.
ROSA uses Eine kleine Nachtmusik.

```bash
npm install
node render.mjs rosa                    # -> out/rosa.mp4 (~1 min on a 10-core Mac)
node render.mjs rosa --preview          # live preview with music + scrubber in the browser
node render.mjs rosa --stills 3,12,40   # single frames (seconds) -> out/stills/
node render.mjs rosa --music track.mp3  # use a licensed track instead of the generated one
```

## How it works

- `collections/<id>.json`: the only per-collection file. It lists the designs, the `patterns`
  used inside the big lettering, the scenes and `music.piece`. Image refs are
  `"<design-folder>/<suffix>"`, e.g. `"magnolia/closeup-1"` matches `rosa/magnolia/ROS-M__closeup-1.png`.
  Scene lengths are in beats (one beat = 0.55s at 110 BPM).
- Designs: `name`, `tagline`, optional `accent`/`palette` overrides, `lens` (the close-up used
  for the detail shot, default `closeup-2`) and `loupe` (`[[x, y], [x, y]]` lens path on screen).
- Scene types: `hook` (one word per beat), `title`, `designs` (two bars each: hero shot in one of
  three rotating layouts, then the detail shot), `care`, `build` (tension, then a silent beat),
  `sizes`, `origin`, `outro`.
- `render.mjs` expands the scenes into a timeline, picks each scene's transition and derives the
  song from it: intro → theme (title + designs) → breakdown (care) → build → theme (sizes + origin)
  → outro, with a soft swoosh on every swiping transition.
- `template/`: HTML/CSS + GSAP. The timeline is paused and seeked frame by frame, so renders are deterministic.
- `palette.mjs`: each design's colour palette and accent come from its `closeup-2` photo.
- `music/generate.py`: numpy synthesis of the arrangement (strings, piano, glockenspiel, pads,
  bass, pop drums). Audio is normalised to -14 LUFS.
- `music/pieces/<name>.py`: one Mozart piece per file, transcribed bar by bar from a
  public-domain edition: the opening bars for the theme, a quieter passage for the breakdown,
  a climbing line for the build, the pickup note, and the coda. `nachtmusik.py` (K. 525, from
  the Mutopia Project parts) is the example to copy.

To add a collection, copy `collections/rosa.json`, point `root` at the collection folder and
update the designs, patterns, shapes/sizes, copy and `music.piece`. The title, size cards and
outro tiles land on the opening notes of Eine kleine Nachtmusik (`hits` in `template/video.js`);
adjust them when a collection uses a different piece.
