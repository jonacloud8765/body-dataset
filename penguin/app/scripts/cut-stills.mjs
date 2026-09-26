// Renders animatic stills at every cut and every in-shot cue, for checking the blocking
// against the music without playing the whole film.
//
//   node scripts/cut-stills.mjs [--shots S20,S21] [--scale 0.5] [--clean]
//
// For each shot: its first frame after the cut, each cue in timeline.json (2 frames in),
// the middle, and its last frame. Writes out/stills/<shot>-<frame>.jpg.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync, readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};
const only = opt('shots', '')
  .split(',')
  .filter(Boolean);
const scale = Number(opt('scale', '0.5'));
const clean = args.includes('--clean');

const timeline = JSON.parse(readFileSync(resolve(here, '../../storyboard/timeline.json'), 'utf8'));
const shots = timeline.shots.filter((s) => !only.length || only.includes(s.id));

const framesFor = (s) => {
  const f = new Set([s.from + 1, s.from + Math.floor(s.frames / 2), s.to - 1]);
  for (const b of s.beats ?? []) f.add(Math.min(s.to - 1, s.from + b.frame + 2));
  return [...f].sort((a, b) => a - b);
};

const out = resolve(here, '../out/stills');
mkdirSync(out, {recursive: true});
const browserExecutable =
  process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

const serveUrl = await bundle({entryPoint: resolve(here, '../src/index.ts'), publicDir: resolve(here, '../public')});
const inputProps = {hud: !clean};
const composition = await selectComposition({serveUrl, id: 'Animatic', inputProps, browserExecutable, chromiumOptions: {gl: 'angle'}});

let n = 0;
for (const s of shots) {
  for (const frame of framesFor(s)) {
    const output = resolve(out, `${s.id}-${String(frame).padStart(4, '0')}.jpg`);
    await renderStill({composition, serveUrl, output, frame, scale, imageFormat: 'jpeg', jpegQuality: 88, inputProps, browserExecutable, chromiumOptions: {gl: 'angle'}});
    n++;
  }
  process.stdout.write(`${s.id} `);
}
console.log(`\nwrote ${n} stills to ${out}`);
