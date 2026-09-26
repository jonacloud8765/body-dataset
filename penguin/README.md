# The Penguin: music video

Pre-production for an animated music video for "I'm the Penguin", built in Remotion.

- **Read first:** [`docs/penguin/preproduction.md`](../docs/penguin/preproduction.md): the analysis,
  the creative plan, the timeline and the production blueprint.
- **Shot list:** [`docs/penguin/shotlist.md`](../docs/penguin/shotlist.md): 61 cards, generated.

| Folder | Contents |
|---|---|
| `source/` | The song, the vocal stem and the model sheet (local only; see its README) |
| `analysis/` | Tools that measure the song, and `song-map.json`, the measured song |
| `storyboard/` | `shots.yaml` (the shot list, placed by bar.beat), `build.py` (resolves it to seconds and frames, writes `timeline.json` and the shot list document), `figure.py` (the timeline figure) |

Rebuild the storyboard after editing `shots.yaml` or `song-map.json`:

```
pip install pyyaml matplotlib
python3 storyboard/build.py && python3 storyboard/figure.py
```

`build.py` fails on overlapping, backward or too-short shots, and on in-shot events that fall
outside their shot.
