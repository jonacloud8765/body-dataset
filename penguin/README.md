# The Penguin: music video

An animated music video for "I'm the Penguin", built in Remotion, in a flat 2D look. Pre-production
and the animatic are done; the `Film` composition draws every shot of the animatic's blocking with
HIM rigged from the model sheet.

- **Read first:** [`docs/penguin/preproduction.md`](../docs/penguin/preproduction.md): the analysis,
  the creative plan, the timeline and the production blueprint.
- **Shot list:** [`docs/penguin/shotlist.md`](../docs/penguin/shotlist.md): 61 cards, generated.

| Folder | Contents |
|---|---|
| `source/` | The song, the vocal stem and the model sheet (local only; see its README) |
| `analysis/` | Tools that measure the song, and `song-map.json`, the measured song |
| `storyboard/` | `shots.yaml` (the shot list, placed by bar.beat), `build.py` (resolves it to seconds and frames, writes `timeline.json` and the shot list document), `figure.py` (the timeline figure) |
| `app/` | The Remotion project: the timing layer (song map, timeline, vocal envelope), the `Animatic` and `Film` compositions, render and check scripts |

Rebuild the storyboard after editing `shots.yaml` or `song-map.json`:

```
pip install pyyaml matplotlib
python3 storyboard/build.py && python3 storyboard/figure.py
```

`build.py` fails on overlapping, backward or too-short shots, and on in-shot events that fall
outside their shot.

## The Remotion app

Needs Node 18+, the song in `source/`, and ffmpeg for the checks.

```
cd app && npm install
npm run studio                 # preview in the browser
npm run typecheck
npm run animatic               # out/animatic-540p.mp4: every shot as blocking over the song
npm run verify -- out/animatic-540p.mp4
node scripts/cut-stills.mjs --shots S20,S21   # stills at each shot's cuts and cues
```

- `Animatic` has a HUD (shot, bar.beat, beat pips, the sung line, in-shot cues, a red flash on
  each cut). `AnimaticClean` is the same without it.
- Renders go through `scripts/render.mjs`: the picture is rendered muted, then ffmpeg muxes in the
  untouched song. Remotion's own audio pass leaves the song 2048 samples (1.3 frames) late,
  because its AAC has no priming compensation.
- `verify-render.py` checks the frame count, finds every cut in the picture and checks it lands on
  its planned frame, and measures the audio offset against the song.
- Rendered files contain the song, so `out/` is never committed.

## The film

```
python3 scripts/trace-sheet.py     # once: traces the model sheet into public/art/sheet.json (local only)
npm run film                       # out/film-1080p.mp4, 1920x1080, 30 fps, on the song
npm run verify -- out/film-1080p.mp4
npm run film:stills                # stills at every cut and cue
npm run film:share                 # out/im-the-penguin-film.mp4: a ~25 MB copy for sharing
```

- `src/film/FilmShot.tsx` draws each shot from the animatic's blocking (`src/animatic/blocking.ts`),
  with the changes the finished drawing needs in `src/film/blocking.ts`.
- HIM (`src/film/Him.tsx`) is the rig from the traced model sheet (`src/rig`). A foot lands on every
  beat and leaves a print in the snow. When a move is too fast for his natural stride, he steps on
  the half beats instead. The back view is the sheet's own back drawing, with legs drawn under it
  to the front view's proportions.
- The crew and the colony (`src/film/People.tsx`), the world (`src/world/Flat.tsx`) and the props
  (`src/film/Props.tsx`) are flat fills with one ink line, colored by the hour's palette
  (`src/world/palette.ts`).
- There is no lip sync: his beak stays closed.
- `node scripts/walk-paces.ts` (via esbuild, see its header) lists every walk in the blocking and
  the stride it needs.
- The traced art stays local: `public/art/` is never committed.
