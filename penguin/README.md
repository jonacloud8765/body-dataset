# The Penguin: music video

An animated music video for "I'm the Penguin", built in Remotion. Pre-production is done;
the Remotion build is under way, starting with the animatic.

- **Read first:** [`docs/penguin/preproduction.md`](../docs/penguin/preproduction.md): the analysis,
  the creative plan, the timeline and the production blueprint.
- **Shot list:** [`docs/penguin/shotlist.md`](../docs/penguin/shotlist.md): 61 cards, generated.

| Folder | Contents |
|---|---|
| `source/` | The song, the vocal stem and the model sheet (local only; see its README) |
| `analysis/` | Tools that measure the song, and `song-map.json`, the measured song |
| `storyboard/` | `shots.yaml` (the shot list, placed by bar.beat), `build.py` (resolves it to seconds and frames, writes `timeline.json` and the shot list document), `figure.py` (the timeline figure) |
| `app/` | The Remotion project: the timing layer (song map, timeline, vocal envelope), the `Animatic` composition, render and check scripts |

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
