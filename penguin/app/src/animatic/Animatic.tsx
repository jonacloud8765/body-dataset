import React from 'react';
import {AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import type {Shot} from '../timing/timeline';
import {SHOTS} from '../timing/timeline';
import {SPECS} from './blocking';
import {DocFrame, Letterbox} from './DocFrame';
import {Hud} from './Hud';
import {makeResolver, ShotView} from './ShotView';

/** The documentary's grade (§9.3): flatter, cooler, a little lifted. */
const DOC_GRADE = 'saturate(0.72) contrast(0.95) brightness(1.03) hue-rotate(-6deg)';

const ShotLayer: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const spec = SPECS[shot.id] ?? {};
  const res = makeResolver(shot);
  const opens = spec.letterboxOutAt !== undefined;
  const open = opens
    ? interpolate(frame, [res(spec.letterboxOutAt!), res(spec.letterboxOutAt!) + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;
  const doc = shot.mode === 'DOC';
  return (
    <AbsoluteFill>
      <AbsoluteFill style={doc ? {filter: DOC_GRADE} : undefined}>
        <ShotView shot={shot} spec={spec} />
      </AbsoluteFill>
      {(shot.mode === 'CINEMA' || opens) && open < 1 ? <Letterbox open={open} /> : null}
      {doc ? <DocFrame shot={shot} spec={spec} /> : null}
    </AbsoluteFill>
  );
};

/**
 * The animatic: every shot blocked over the actual song, cut on the measured grid.
 * With `hud`, an overlay shows the shot, the bar and beat, the sung line and each cue.
 */
export const Animatic: React.FC<{hud: boolean}> = ({hud}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Html5Audio src={staticFile('audio/song.mp3')} />
      {SHOTS.map((shot) => (
        <Sequence key={shot.id} from={shot.from} durationInFrames={shot.frames} name={`${shot.id} ${shot.title}`}>
          <ShotLayer shot={shot} />
        </Sequence>
      ))}
      {hud ? <Hud frame={frame} /> : null}
    </AbsoluteFill>
  );
};
