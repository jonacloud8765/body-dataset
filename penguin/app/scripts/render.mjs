// Renders a composition, then muxes in the untouched song.
//
//   node scripts/render.mjs <CompositionId> <out.mp4> [--audio-from <seconds>] [extra `remotion render` flags]
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
const argv = process.argv.slice(2);
const fromIdx = argv.indexOf('--audio-from');
const audioFrom = fromIdx >= 0 ? argv.splice(fromIdx, 2)[1] : '0';
const [id, out, ...extra] = argv;
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
// the song is padded with silence and cut exactly where the picture ends: the film runs past the
// song (the silent epilogue), a clip from the middle of it ends before the song does.
// (-shortest won't do: alone it overshoots by the muxer's interleave slack, and with apad it can
// wait forever.)
const probe = spawnSync('npx', ['remotion', 'ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', picture], {
  cwd: resolve(here, '..'),
  encoding: 'utf8',
});
const duration = parseFloat(probe.stdout);
if (!(duration > 0)) {
  console.error(`could not read the picture's duration: ${probe.stderr}`);
  process.exit(1);
}
run(['remotion', 'ffmpeg', '-v', 'error', '-y', '-i', picture, '-ss', audioFrom, '-i', song, '-map', '0:v', '-map', '1:a', '-af', 'apad', '-t', duration.toFixed(3),
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-movflags', '+faststart', out]);
rmSync(resolve(here, '..', picture));
console.log(`wrote ${out}`);
