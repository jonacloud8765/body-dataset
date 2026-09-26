import {Config} from '@remotion/cli/config';
import {cpus} from 'node:os';

// Use the pre-installed headless shell instead of downloading one.
Config.setBrowserExecutable(
  process.env.REMOTION_BROWSER ??
    '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(cpus().length);
// 'angle' is much faster than software GL for SVG-heavy frames on CPU-only machines.
Config.setChromiumOpenGlRenderer('angle');
