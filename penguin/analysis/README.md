# Song analysis

Measures the song so the storyboard and the Remotion timeline sit on the real music.

```
pip install -r requirements.txt pocketsphinx   # and ffmpeg on PATH
python3 analyze.py ../source/im-the-penguin.mp3 --vocals ../source/im-the-penguin-vocals.mp3 \
    --song-map song-map.json --out out
python3 align_lyrics.py ../source/im-the-penguin-vocals.mp3 --out out/words.json
python3 plot_vocals.py ../source/im-the-penguin-vocals.mp3 --song-map song-map.json \
    --words out/words.json --out ../../docs/penguin/img/vocal-sheets
```

| File | What it does |
|---|---|
| `analyze.py` | Tempo, a beat grid refit to the drum-hit onsets, bar-one phase, per-bar features (loudness, brightness, percussiveness, intensity), novelty boundaries, vocal activity; overview and detail plots |
| `align_lyrics.py` | Phonetic recognition of the vocal stem (PocketSphinx's bundled English models) aligned to the known lyrics. It's noisy on singing, and it's evidence, not the answer. |
| `plot_vocals.py` | Bar-by-bar sheets of the vocal (level, sung melody, recognized phones, the placed lines) for checking every line by eye |
| `lyrics.txt` | The lyric sheet as supplied |
| **`song-map.json`** | **The curated, verified song map**: grid, sections, sung lines with confidence, musical events, and per-bar levels. The storyboard reads only this file. |

`song-map.json` was curated from all three tools: the refit grid, the melody's repetitions (the
intro's first line repeats at bar 5; Chorus 2 repeats Chorus 1 twenty bars later), the bar-by-bar
sheets, and the recognized phones. A fresh run of `analyze.py` reproduces its grid to within
12 ms. See §1 of `docs/penguin/preproduction.md`.
