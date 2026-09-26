import React from 'react';
import {Composition} from 'remotion';
import {Animatic} from './animatic/Animatic';
import {StyleScene} from './styles/StyleFrame';
import './fonts';
import {FPS, HEIGHT, WIDTH} from './timing/song';
import {TOTAL_FRAMES} from './timing/timeline';

export const Root: React.FC = () => (
  <>
    <Composition id="Animatic" component={Animatic} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{hud: true}} />
    <Composition id="AnimaticClean" component={Animatic} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{hud: false}} />
    {(['ink', 'flat', 'painterly', 'anime'] as const).map((style) => (
      <Composition key={style} id={`Style-${style}`} component={StyleScene} durationInFrames={90} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{style}} />
    ))}
  </>
);
