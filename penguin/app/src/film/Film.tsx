import React from 'react';
import {AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {DocFrame, Letterbox} from '../animatic/DocFrame';
import {makeResolver} from '../animatic/ShotView';
import {useSheet, type Sheet} from '../art/sheet';
import type {Shot} from '../timing/timeline';
import {SHOTS} from '../timing/timeline';
import {FILM_SPECS} from './blocking';
import {FilmShot} from './FilmShot';

/** The documentary's grade (§9.3): flatter, cooler, a little lifted. */
const DOC_GRADE = 'saturate(0.78) contrast(0.96) brightness(1.03) hue-rotate(-6deg)';

const FilmLayer: React.FC<{shot: Shot; sheet: Sheet}> = ({shot, sheet}) => {
  const frame = useCurrentFrame();
  const spec = FILM_SPECS[shot.id] ?? {};
  const res = makeResolver(shot);
  const opens = spec.letterboxOutAt !== undefined;
  const open = opens
    ? interpolate(frame, [res(spec.letterboxOutAt!), res(spec.letterboxOutAt!) + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;
  const doc = shot.mode === 'DOC';
  return (
    <AbsoluteFill>
      <AbsoluteFill style={doc ? {filter: DOC_GRADE} : undefined}>
        <FilmShot shot={shot} spec={spec} sheet={sheet} />
      </AbsoluteFill>
      {(shot.mode === 'CINEMA' || opens) && open < 1 ? <Letterbox open={open} /> : null}
      {doc ? <DocFrame shot={shot} spec={spec} /> : null}
    </AbsoluteFill>
  );
};

/** The music video: every shot of the animatic, drawn in the flat 2D look, on the song. */
export const Film: React.FC = () => {
  const sheet = useSheet();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Html5Audio src={staticFile('audio/song.mp3')} />
      {sheet
        ? SHOTS.map((shot) => (
            <Sequence key={shot.id} from={shot.from} durationInFrames={shot.frames} name={`${shot.id} ${shot.title}`}>
              <FilmLayer shot={shot} sheet={sheet} />
            </Sequence>
          ))
        : null}
    </AbsoluteFill>
  );
};
