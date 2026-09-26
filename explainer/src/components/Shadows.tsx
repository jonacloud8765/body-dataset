import React from 'react';
import {C} from '../theme';
import {Figure, Pose} from './Figure';
import {WORLD} from './World';

export type Animal = 'sheep' | 'wolf' | 'dog' | 'cat' | 'dogRest';

/** Silhouettes face right, feet at y = 0. */
export const AnimalShape: React.FC<{kind: Animal; fill: string; eye?: string | null}> = ({kind, fill, eye}) => {
  if (kind === 'sheep') {
    const puffs: [number, number, number][] = [[-45, -72, 22], [-20, -88, 26], [10, -90, 26], [38, -80, 24], [50, -62, 20], [-50, -55, 20], [-15, -52, 26], [20, -54, 26]];
    return (
      <g fill={fill}>
        {puffs.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
        <ellipse cx={72} cy={-80} rx={17} ry={11} transform="rotate(28 72 -80)" />
        <ellipse cx={62} cy={-90} rx={9} ry={4} transform="rotate(-20 62 -90)" />
        {[-40, -24, 22, 38].map((x) => <rect key={x} x={x} y={-42} width={7} height={42} rx={2} />)}
      </g>
    );
  }
  if (kind === 'wolf') {
    return (
      <g>
        <path fill={fill} d="M -80 -76 Q -104 -66 -118 -40 Q -98 -56 -84 -60 L -62 -40 L -56 0 L -47 0 L -42 -42 Q 0 -38 48 -40 L 52 0 L 61 0 L 64 -42 Q 76 -48 86 -50 L 112 -50 L 138 -56 L 136 -62 L 108 -68 L 104 -86 L 96 -72 L 88 -84 L 82 -72 Q 66 -80 52 -84 L 28 -92 L 10 -98 L -8 -92 L -28 -96 L -44 -88 Z" />
        {eye ? <path d="M 100 -66 L 112 -62 L 100 -59 Z" fill={eye} /> : null}
      </g>
    );
  }
  if (kind === 'dog') {
    return (
      <g>
        <path fill={fill} d="M -70 -76 Q -94 -80 -104 -98 Q -84 -90 -72 -86 Q -20 -90 36 -88 Q 48 -94 56 -104 L 60 -114 L 58 -136 L 70 -120 L 76 -120 L 84 -136 L 86 -116 Q 90 -110 104 -104 L 108 -98 L 86 -94 Q 76 -84 72 -70 Q 68 -60 66 -50 L 64 0 L 55 0 L 52 -46 Q 0 -52 -40 -50 L -46 0 L -55 0 L -62 -48 Q -68 -60 -70 -76 Z" />
        {eye ? <path d="M 110 -110 L 122 -106 L 110 -102 Z" fill={eye} /> : null}
      </g>
    );
  }
  if (kind === 'dogRest') {
    return (
      <g>
        <path fill={fill} d="M -90 -8 Q -112 -12 -120 -4 L -88 0 L 44 0 L 60 -4 Q 70 -30 74 -56 L 72 -74 L 84 -60 Q 92 -58 96 -56 L 118 -46 L 118 -38 L 92 -36 Q 84 -26 82 -6 L 86 0 L 44 0 Q -20 -30 -80 -26 Q -92 -20 -90 -8 Z" />
        {eye ? <path d="M 120 -48 L 132 -44 L 120 -40 Z" fill={eye} /> : null}
      </g>
    );
  }
  return (
    <g fill={fill}>
      <path d="M -60 0 L -52 0 L -48 -40 Q -20 -118 30 -100 Q 52 -90 56 -64 L 62 -76 L 67 -62 L 76 -74 L 77 -54 Q 80 -40 68 -36 L 62 -30 L 60 0 L 52 0 L 50 -30 Q 0 -46 -42 -32 L -44 0 Z" />
      <path d="M -46 -46 Q -94 -70 -80 -122" stroke={fill} strokeWidth={9} fill="none" strokeLinecap="round" />
    </g>
  );
};

export type ShadowLight = {
  /** Size multiplier of the projected shadow. */
  k: number;
  /** Horizontal offset of the shadow relative to the figure. */
  dx: number;
  opacity: number;
  blur: number;
};

export const LIGHT_ACT1: ShadowLight = {k: 1.25, dx: 60, opacity: 0.22, blur: 3};
export const LIGHT_ACT2: ShadowLight = {k: 1.95, dx: 20, opacity: 0.8, blur: 1.2};

export const lerpLight = (a: ShadowLight, b: ShadowLight, t: number): ShadowLight => ({
  k: a.k + (b.k - a.k) * t,
  dx: a.dx + (b.dx - a.dx) * t,
  opacity: a.opacity + (b.opacity - a.opacity) * t,
  blur: a.blur + (b.blur - a.blur) * t,
});

type ShadowOfProps = {
  x: number;
  lane: number;
  pose: Pose;
  scale: number;
  facing?: 1 | -1;
  light: ShadowLight;
  /** Extra growth factor (posture = perceived presence). */
  grow?: number;
  animal?: {kind: Animal; t: number; scale?: number; eye?: string | null} | null;
  opacity?: number;
};

/** A figure's projection on the plaza wall, optionally morphing into an animal silhouette. */
export const ShadowOf: React.FC<ShadowOfProps> = ({x, lane, pose, scale, facing = 1, light, grow = 1, animal = null, opacity = 1}) => {
  const k = light.k * grow * scale;
  const baseY = WORLD.wallBase + (lane - WORLD.wallBase) * 0.15;
  const sx = x + light.dx;
  const at = animal ? animal.t : 0;
  const midBlur = light.blur + 7 * Math.sin(Math.PI * at);
  return (
    <g opacity={light.opacity * opacity} style={{filter: `blur(${midBlur.toFixed(2)}px)`}}>
      {at < 1 ? (
        <g opacity={1 - at}>
          <Figure x={sx} y={baseY} pose={pose} scale={k} facing={facing} fill={C.SHADOW} rim={null} flat />
        </g>
      ) : null}
      {animal && at > 0 ? (
        <g opacity={at} transform={`translate(${sx} ${baseY}) scale(${k * (animal.scale ?? 1) * facing} ${k * (animal.scale ?? 1)})`}>
          <AnimalShape kind={animal.kind} fill={C.SHADOW} eye={animal.eye ?? null} />
        </g>
      ) : null}
    </g>
  );
};
