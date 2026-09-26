import {continueRender, delayRender, staticFile} from 'remotion';

/** Fonts are self-hosted (public/fonts) so rendering never depends on the network. */
export const FONT_DISPLAY = 'Archivo Local';
export const FONT_MONO = 'Plex Mono Local';

const faces: {family: string; file: string; descriptors: FontFaceDescriptors}[] = [
  {family: FONT_DISPLAY, file: 'fonts/Archivo-Variable-latin.woff2', descriptors: {weight: '100 900', stretch: '62% 125%', style: 'normal'}},
  {family: FONT_MONO, file: 'fonts/IBMPlexMono-400-latin.woff2', descriptors: {weight: '400', style: 'normal'}},
  {family: FONT_MONO, file: 'fonts/IBMPlexMono-500-latin.woff2', descriptors: {weight: '500', style: 'normal'}},
];

if (typeof document !== 'undefined') {
  const handle = delayRender('Loading fonts');
  Promise.all(
    faces.map((f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format('woff2')`, f.descriptors);
      (document.fonts as unknown as {add: (f: FontFace) => void}).add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error('Font loading failed', err);
      continueRender(handle);
    });
}
