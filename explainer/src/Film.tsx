import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {C, FONT_DISPLAY} from './theme';
import {FPS, SCENES, sceneFrames, sceneStart} from './timeline';
import {Grain} from './components/Signals';
import {SceneProps} from './scenes/common';
import {makePlaceholder} from './scenes/Placeholder';
import {S01Pulse, S02OrdinaryDay, S03Shift, S04Branch} from './scenes/Act1Open';
import {S11Flock, S12Wolf, S13Sheepdog, S14CapabilityIntent, S15Prepared} from './scenes/Act2';
import {S05Fight, S06Flight, S07Freeze, S08Submit, S09Posture, S10PerceivedStrength} from './scenes/Act1Responses';

const REGISTRY: Record<string, React.FC<SceneProps>> = {
  S01: S01Pulse,
  S02: S02OrdinaryDay,
  S03: S03Shift,
  S04: S04Branch,
  S05: S05Fight,
  S06: S06Flight,
  S07: S07Freeze,
  S08: S08Submit,
  S09: S09Posture,
  S10: S10PerceivedStrength,
  S11: S11Flock,
  S12: S12Wolf,
  S13: S13Sheepdog,
  S14: S14CapabilityIntent,
  S15: S15Prepared,
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
