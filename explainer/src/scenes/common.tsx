import React, {createContext, useContext} from 'react';
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

/** Render options passed as input props (see Root.tsx / Film.tsx). */
export type FilmOptions = {showCaptions: boolean; grain: boolean; soundtrack: boolean};
export const DEFAULT_OPTIONS: FilmOptions = {showCaptions: true, grain: true, soundtrack: true};
export const OptionsContext = createContext<FilmOptions>(DEFAULT_OPTIONS);

/**
 * Caption line in the lower matte bar (narration rendered as restrained text).
 * The same cues drive the VO script and the .srt (see scripts/export-vo.ts).
 */
export const Caption: React.FC<{text: string; t: number; a: number; b: number; lift?: number}> = ({text, t, a, b, lift = 0}) => {
  const {showCaptions} = useContext(OptionsContext);
  if (!showCaptions || t < a || t > b) return null;
  const o = Math.min(1, (t - a) / 0.5, (b - t) / 0.5);
  return (
    <div style={{position: 'absolute', left: '50%', bottom: 69 + lift, transform: 'translate(-50%, 50%)', fontFamily: 'inherit', color: '#E9E4D8', opacity: o, fontSize: lift ? 32 : 34, whiteSpace: 'nowrap', letterSpacing: '0.01em', textShadow: lift ? '0 2px 14px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)' : undefined}}>
      {text}
    </div>
  );
};

export const PROTAGONIST_X = 800;
export const OTHER_X = 1250;
export const BRANCH_CAM: Cam = {x: 1025, y: 650, zoom: 1.12};
