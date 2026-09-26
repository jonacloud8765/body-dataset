// Renders a composition, then muxes in the untouched song.
//
//   node scripts/render.mjs <CompositionId> <out.mp4> [extra `remotion render` flags]
//
// Remotion's own audio pass encodes AAC without the edit list that trims the encoder's
// priming samples, which leaves the song 2048 samples (42.7 ms, 1.3 frames) late against the
// picture. So the picture is rendered muted and ffmpeg (Remotion's bundled copy) adds the
// song, writing the priming compensation. scripts/verify-render.py measures the result.
import {spawnSync} from 'node:child_process';
import {existsSync, rmSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [id, out, ...extra] = process.argv.slice(2);
if (!id || !out) {
  console.error('usage: node scripts/render.mjs <CompositionId> <out.mp4> [remotion render flags]');
  process.exit(1);
}
const song = resolve(here, '../../source/im-the-penguin.mp3');
if (!existsSync(song)) {
  console.error(`Missing ${song}. Put the song in penguin/source/ (see its README).`);
  process.exit(1);
}
const run = (args) => {
  const r = spawnSync('npx', args, {stdio: 'inherit', cwd: resolve(here, '..')});
  if (r.status !== 0) process.exit(r.status ?? 1);
};
const picture = out.replace(/\.mp4$/, '.picture.mp4');
run(['remotion', 'render', 'src/index.ts', id, picture, '--muted', ...extra]);
run(['remotion', 'ffmpeg', '-v', 'error', '-y', '-i', picture, '-i', song, '-map', '0:v', '-map', '1:a',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-movflags', '+faststart', out]);
rmSync(resolve(here, '..', picture));
console.log(`wrote ${out}`);
