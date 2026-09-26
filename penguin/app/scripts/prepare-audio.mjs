// Copies the song from penguin/source into public/audio for rendering.
// public/audio is gitignored: the song is never committed (the repository is public).
import {copyFileSync, existsSync, mkdirSync, statSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '../../source/im-the-penguin.mp3');
const dst = resolve(here, '../public/audio/song.mp3');

if (!existsSync(src)) {
  console.error(`Missing ${src}. Put the song in penguin/source/ (see its README).`);
  process.exit(1);
}
if (!existsSync(dst) || statSync(dst).size !== statSync(src).size) {
  mkdirSync(dirname(dst), {recursive: true});
  copyFileSync(src, dst);
  console.log('copied the song to public/audio/song.mp3');
}
