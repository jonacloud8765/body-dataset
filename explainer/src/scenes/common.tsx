import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {H, W, conditionColor} from '../theme';
import {FPS} from '../timeline';
import {Cam, camTransform} from '../components/World';
import {levelAt, pulseAt} from '../score';

/** Local scene time (s) and absolute film time (s). */
export const useTimes = (T0: number) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return {frame, t, T: T0 + t};
};

export type SceneProps = {T0: number};

/** SVG layer that shares the world camera (for actors and signals drawn above the graded plaza). */
export const WorldLayer: React.FC<{cam: Cam; children: React.ReactNode; style?: React.CSSProperties}> = ({cam, children, style}) => (
  <AbsoluteFill style={style}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
      <g transform={camTransform(cam)}>{children}</g>
    </svg>
  </AbsoluteFill>
);

export const ScreenLayer: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={style}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
      {children}
    </svg>
  </AbsoluteFill>
);

/** Heart dot props for the protagonist at absolute time T. */
export const heartAt = (T: number, extra?: {size?: number; glow?: number}) => ({
  color: conditionColor(levelAt(T)),
  pulse: pulseAt(T),
  size: extra?.size,
  glow: extra?.glow,
});

/** Caption line in the lower matte bar (narration rendered as restrained text). */
export const Caption: React.FC<{text: string; t: number; a: number; b: number}> = ({text, t, a, b}) => {
  if (t < a || t > b) return null;
  const o = Math.min(1, (t - a) / 0.5, (b - t) / 0.5);
  return (
    <div style={{position: 'absolute', left: '50%', bottom: 69, transform: 'translate(-50%, 50%)', fontFamily: 'inherit', color: '#E9E4D8', opacity: o, fontSize: 34, whiteSpace: 'nowrap', letterSpacing: '0.01em'}}>
      {text}
    </div>
  );
};

export const PROTAGONIST_X = 800;
export const OTHER_X = 1250;
export const BRANCH_CAM: Cam = {x: 1025, y: 650, zoom: 1.12};
