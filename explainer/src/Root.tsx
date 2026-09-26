import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {FPS, TOTAL_FRAMES} from './timeline';
import {H, W} from './theme';

export const Root: React.FC = () => (
  <>
    <Composition id="CalmButReady" component={Film} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
  </>
);
