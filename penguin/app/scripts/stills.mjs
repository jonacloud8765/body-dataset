// Renders stills of any compositions, timing each one.
//
//   node scripts/stills.mjs --comps Style-ink,Style-flat [--frame 45] [--scale 1] [--out out/styles]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};
const comps = opt('comps', '').split(',').filter(Boolean);
const frames = opt('frame', '0').split(',').map(Number);
const scale = Number(opt('scale', '1'));
const out = resolve(here, '..', opt('out', 'out/stills'));
mkdirSync(out, {recursive: true});
const browserExecutable =
  process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const chromiumOptions = {gl: 'angle'};

const serveUrl = await bundle({entryPoint: resolve(here, '../src/index.ts'), publicDir: resolve(here, '../public')});
for (const id of comps) {
  const composition = await selectComposition({serveUrl, id, browserExecutable, chromiumOptions});
  for (const frame of frames) {
    const t0 = performance.now();
    const output = resolve(out, `${id}-${String(frame).padStart(4, '0')}.png`);
    await renderStill({composition, serveUrl, output, frame, scale, imageFormat: 'png', browserExecutable, chromiumOptions});
    console.log(`${id} f${frame}: ${((performance.now() - t0) / 1000).toFixed(2)} s -> ${output}`);
  }
}
