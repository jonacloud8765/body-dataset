import React from 'react';
import {Composition} from 'remotion';
import {Animatic} from './animatic/Animatic';
import {StyleScene} from './styles/StyleFrame';
import {ModelCheck} from './rig/ModelCheck';
import {WalkTest} from './rig/WalkTest';
import {CharacterRef} from './rig/CharacterRef';
import {PoseCheck} from './film/PoseCheck';
import {Film} from './film/Film';
import {InterviewCast} from './interview/Cast';
import {Interview, INTERVIEW_FPS, INTERVIEW_FRAMES} from './interview/Interview';
import './fonts';
import {FPS, HEIGHT, WIDTH} from './timing/song';
import {TOTAL_FRAMES} from './timing/timeline';

export const Root: React.FC = () => (
  <>
    <Composition id="Animatic" component={Animatic} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{hud: true}} />
    <Composition id="AnimaticClean" component={Animatic} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{hud: false}} />
    <Composition id="Film" component={Film} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Interview" component={Interview} durationInFrames={INTERVIEW_FRAMES} fps={INTERVIEW_FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="InterviewCast" component={InterviewCast} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="PoseCheck" component={PoseCheck} durationInFrames={60} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="CharacterRef" component={CharacterRef} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="WalkTest" component={WalkTest} durationInFrames={240} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="ModelCheck" component={ModelCheck} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} />
    {(['ink', 'flat', 'painterly', 'anime'] as const).map((style) => (
      <Composition key={style} id={`Style-${style}`} component={StyleScene} durationInFrames={90} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{style}} />
    ))}
  </>
);
