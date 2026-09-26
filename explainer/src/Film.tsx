import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {C, FONT_DISPLAY} from './theme';
import {FPS, SCENES, sceneFrames, sceneStart} from './timeline';
import {Grain} from './components/Signals';
import {SceneProps} from './scenes/common';
import {makePlaceholder} from './scenes/Placeholder';
import {S01Pulse, S02OrdinaryDay, S03Shift, S04Branch} from './scenes/Act1Open';

const REGISTRY: Record<string, React.FC<SceneProps>> = {
  S01: S01Pulse,
  S02: S02OrdinaryDay,
  S03: S03Shift,
  S04: S04Branch,
};

export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.INK, fontFamily: FONT_DISPLAY, fontVariationSettings: "'wght' 440"}}>
      {SCENES.map((s) => {
        const Comp = REGISTRY[s.id] ?? makePlaceholder(s.id);
        return (
          <Sequence key={s.id} name={`${s.id} ${s.title}`} from={sceneStart(s.id)} durationInFrames={sceneFrames(s.id)}>
            <Comp T0={sceneStart(s.id) / FPS} />
          </Sequence>
        );
      })}
      <Grain frame={frame} opacity={0.06} />
    </AbsoluteFill>
  );
};
