import React, {useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS} from '../timeline';
import {S} from '../score';
import {NARRATION} from '../narration';
import {Caption, OptionsContext} from '../scenes/common';

/** Caption height offset by act: Act III's lower bar holds the instruments. */
const liftAt = (T: number) => {
  if (T >= S('S16') && T < S('S20')) return 128;
  if (T >= S('S20') && T < S('S22')) return 196;
  if (T >= S('S22') && T < S('S23')) return -30;
  return 0;
};

/** Burned-in narration captions, driven by src/narration.ts (film-level, so cues may cross scenes). */
export const NarrationTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const {showCaptions} = useContext(OptionsContext);
  if (!showCaptions) return null;
  const T = frame / FPS;
  const cue = NARRATION.find((c) => !c.onScreen && T >= S(c.scene) + c.a && T <= S(c.scene) + c.b);
  if (!cue) return null;
  const a = S(cue.scene) + cue.a;
  return <Caption text={cue.text} t={T} a={a} b={S(cue.scene) + cue.b} lift={liftAt(a)} />;
};
