import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT_DISPLAY} from '../theme';
import {SCENES} from '../timeline';
import {SceneProps, useTimes} from './common';

export const makePlaceholder = (id: string): React.FC<SceneProps> => {
  const Comp: React.FC<SceneProps> = ({T0}) => {
    const {t} = useTimes(T0);
    const s = SCENES.find((x) => x.id === id);
    return (
      <AbsoluteFill style={{background: C.NIGHT, alignItems: 'center', justifyContent: 'center', color: C.MIST, fontFamily: FONT_DISPLAY, fontSize: 48, letterSpacing: '0.2em'}}>
        {id} · {s?.title.toUpperCase()} · {t.toFixed(1)}s
      </AbsoluteFill>
    );
  };
  return Comp;
};
