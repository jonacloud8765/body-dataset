# Song analysis

Measures the song so the storyboard and the Remotion timeline can be placed on the real music.

```
pip install -r requirements.txt        # plus ffmpeg on PATH
python3 analyze.py ../source/<song> --vocals ../source/<vocals> --out out
```

`out/raw.json` holds the tempo, beat grid, bars (with per-bar loudness, brightness, percussiveness
and a 0-1 intensity), novelty-based section boundary candidates, vocal phrases from the stem, and a
first-pass placement of every lyric line (dynamic programming over vocal pauses and syllable
counts). `out/overview.png` and `out/detail-*.png` show the same data with bar numbers, beat ticks,
the vocal level, the sung melody and the placed lyric lines.

The analysis is a measurement, not the final word. `song-map.json` is the curated, verified
version (section boundaries and line cues checked against the plots). The storyboard reads only
`song-map.json`.
