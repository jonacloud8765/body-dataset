import {Config} from '@remotion/cli/config';

// Use the pre-installed headless shell instead of downloading one.
Config.setBrowserExecutable(
  process.env.REMOTION_BROWSER ??
    '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(null);
// 'angle' is ~4x faster than 'swangle' for this SVG-heavy film on CPU-only machines.
Config.setChromiumOpenGlRenderer('angle');
