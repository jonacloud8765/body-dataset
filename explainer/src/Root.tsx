import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {FPS, TOTAL_FRAMES} from './timeline';
import {H, W} from './theme';
import {DEFAULT_OPTIONS} from './scenes/common';

/**
 * Input props (override with --props='{"showCaptions":false}'):
 * - showCaptions: burn in the narration captions (turn off when adding VO)
 * - grain: film grain overlay (off = much smaller files)
 * - soundtrack: generated heartbeat + ambience track
 */
export const Root: React.FC = () => (
  <>
    <Composition id="CalmButReady" component={Film} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} defaultProps={DEFAULT_OPTIONS} />
  </>
);
