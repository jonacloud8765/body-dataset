import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, H, W, mixHex} from '../theme';
import {rand} from '../lib/anim';

export type Cam = {x: number; y: number; zoom: number};

/** World layout constants (world units ~= px at zoom 1). */
export const WORLD = {
  wallTop: 300,
  wallBase: 790,
  lane: {back: 812, mid: 836, main: 862, front: 888},
  exitX: 250,
  exitW: 150,
  benchX: 600,
  lamps: [-40, 980, 1760],
  planters: [1180, 1520],
  shelterX: 2000,
  cafeX: -330,
};

export const laneScale = (y: number) => 0.62 + (y - 700) * 0.0022;

export const camTransform = (cam: Cam, parallax = 1) =>
  `translate(${W / 2} ${H / 2}) scale(${cam.zoom}) translate(${-cam.x * parallax} ${-cam.y})`;

export const toScreen = (cam: Cam, wx: number, wy: number) => ({x: W / 2 + (wx - cam.x) * cam.zoom, y: H / 2 + (wy - cam.y) * cam.zoom});

type PlazaProps = {
  cam: Cam;
  /** 0 = Act I side light (soft shadows), 1 = Act II frontal low sun (wall glows). */
  sun?: number;
  /** Extra darkness for dusk/night grading 0..1. */
  night?: number;
  wallLayer?: React.ReactNode;
  groundLayer?: React.ReactNode;
  actorLayer?: React.ReactNode;
  overlayLayer?: React.ReactNode;
  fgOpacity?: number;
  showProps?: boolean;
};

const Skyline: React.FC = () => {
  const blocks = [];
  let x = -1400;
  let i = 0;
  while (x < 3400) {
    const w = 60 + rand(i * 3.1) * 140;
    const h = 60 + rand(i * 7.7) * 220;
    blocks.push(<rect key={i} x={x} y={WORLD.wallTop - h + 40} width={w} height={h} fill={i % 2 ? C.STEEL : mixHex(C.STEEL, C.NIGHT, 0.4)} />);
    x += w + rand(i * 1.9) * 20;
    i++;
  }
  return <g>{blocks}</g>;
};

const Wall: React.FC<{sun: number}> = ({sun}) => {
  const top = WORLD.wallTop;
  const base = WORLD.wallBase;
  const lines = [];
  for (let y = top + 60; y < base; y += 60) lines.push(<line key={`h${y}`} x1={-1600} x2={3600} y1={y} y2={y} stroke={C.IRON} strokeWidth={1.2} opacity={0.35} />);
  for (let k = 0; k < 44; k++) {
    const xx = -1600 + k * 120;
    lines.push(<line key={`v${k}`} x1={xx} x2={xx} y1={top} y2={base} stroke={C.IRON} strokeWidth={1} opacity={0.14} />);
  }
  const ex = WORLD.exitX;
  const ew = WORLD.exitW;
  const archTop = base - 330;
  return (
    <g>
      <defs>
        <linearGradient id="wallGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={mixHex('#3B3A36', '#6B6254', sun)} />
          <stop offset="1" stopColor={mixHex('#2B2C2C', '#4F483D', sun)} />
        </linearGradient>
        <radialGradient id="sunPool" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor={C.SUN} stopOpacity={0.1 + 0.22 * sun} />
          <stop offset="1" stopColor={C.SUN} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="exitGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0E1216" />
          <stop offset="1" stopColor="#2A3038" />
        </linearGradient>
      </defs>
      <rect x={-1600} y={top} width={5200} height={base - top} fill="url(#wallGrad)" />
      <rect x={-600} y={top} width={3200} height={base - top} fill="url(#sunPool)" />
      {lines}
      <rect x={-1600} y={top} width={5200} height={10} fill={C.IRON} opacity={0.6} />
      <path d={`M ${ex - ew / 2} ${base} L ${ex - ew / 2} ${archTop + ew / 2} A ${ew / 2} ${ew / 2} 0 0 1 ${ex + ew / 2} ${archTop + ew / 2} L ${ex + ew / 2} ${base} Z`} fill="url(#exitGrad)" />
      <path d={`M ${ex - ew / 2 - 10} ${base} L ${ex - ew / 2 - 10} ${archTop + ew / 2} A ${ew / 2 + 10} ${ew / 2 + 10} 0 0 1 ${ex + ew / 2 + 10} ${archTop + ew / 2} L ${ex + ew / 2 + 10} ${base}`} fill="none" stroke={C.IRON} strokeWidth={4} opacity={0.7} />
    </g>
  );
};

const Props: React.FC = () => {
  const L = WORLD.lane;
  const lamp = (x: number, k: number) => (
    <g key={`lamp${k}`}>
      <rect x={x - 3} y={L.back - 250} width={6} height={250} fill={C.IRON} />
      <rect x={x - 14} y={L.back - 262} width={28} height={12} rx={3} fill={C.IRON} />
      <circle cx={x} cy={L.back - 248} r={5} fill={C.SUN} opacity={0.35} />
    </g>
  );
  const bx = WORLD.benchX;
  return (
    <g>
      {/* cafe awning */}
      <g>
        <rect x={WORLD.cafeX - 180} y={WORLD.wallBase - 250} width={360} height={250} fill="#23282E" />
        <path d={`M ${WORLD.cafeX - 200} ${WORLD.wallBase - 250} L ${WORLD.cafeX + 200} ${WORLD.wallBase - 250} L ${WORLD.cafeX + 220} ${WORLD.wallBase - 200} L ${WORLD.cafeX - 220} ${WORLD.wallBase - 200} Z`} fill="#4A3F33" />
        <rect x={WORLD.cafeX - 150} y={WORLD.wallBase - 180} width={300} height={120} fill={C.SUN} opacity={0.12} />
      </g>
      {WORLD.lamps.map((x, k) => lamp(x, k))}
      {/* bench */}
      <g>
        <rect x={bx - 70} y={L.back - 44} width={140} height={8} rx={2} fill={C.IRON} />
        <rect x={bx - 70} y={L.back - 70} width={140} height={6} rx={2} fill={C.IRON} />
        <rect x={bx - 60} y={L.back - 38} width={6} height={38} fill={C.IRON} />
        <rect x={bx + 54} y={L.back - 38} width={6} height={38} fill={C.IRON} />
      </g>
      {WORLD.planters.map((x, k) => (
        <g key={`pl${k}`}>
          <rect x={x - 40} y={L.back - 40} width={80} height={40} fill="#2E353D" />
          <ellipse cx={x} cy={L.back - 62} rx={48} ry={34} fill="#27302B" />
        </g>
      ))}
      {/* bus shelter */}
      <g>
        <rect x={WORLD.shelterX - 110} y={L.back - 210} width={220} height={8} fill={C.IRON} />
        <rect x={WORLD.shelterX - 106} y={L.back - 206} width={5} height={206} fill={C.IRON} />
        <rect x={WORLD.shelterX + 101} y={L.back - 206} width={5} height={206} fill={C.IRON} />
        <rect x={WORLD.shelterX - 100} y={L.back - 200} width={200} height={150} fill={C.COLD} opacity={0.06} />
      </g>
    </g>
  );
};

const Ground: React.FC = () => {
  const lines = [];
  for (let k = -30; k < 60; k++) {
    const x0 = k * 90;
    lines.push(<line key={k} x1={x0} y1={WORLD.wallBase} x2={x0 + (x0 - 900) * 0.9} y2={1400} stroke={C.IRON} strokeWidth={1} opacity={0.16} />);
  }
  return (
    <g>
      <defs>
        <linearGradient id="groundGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#262B30" />
          <stop offset="1" stopColor={C.SLATE} />
        </linearGradient>
      </defs>
      <rect x={-2000} y={WORLD.wallBase} width={6000} height={900} fill="url(#groundGrad)" />
      {lines}
      <line x1={-2000} x2={4000} y1={WORLD.wallBase} y2={WORLD.wallBase} stroke={C.IRON} strokeWidth={2} opacity={0.5} />
    </g>
  );
};

export const Plaza: React.FC<PlazaProps> = ({cam, sun = 0, night = 0, wallLayer, groundLayer, actorLayer, overlayLayer, fgOpacity = 1, showProps = true}) => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="skyGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={C.NIGHT} />
            <stop offset="1" stopColor={mixHex('#2A2B2E', '#4A4034', sun * 0.6)} />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#skyGrad)" />
        <g transform={camTransform(cam, 0.3)}>
          <Skyline />
        </g>
        <g transform={camTransform(cam)}>
          <Wall sun={sun} />
          {wallLayer}
          <Ground />
          {showProps ? <Props /> : null}
          {groundLayer}
          {actorLayer}
          {overlayLayer}
        </g>
        <g transform={camTransform(cam, 1.35)} opacity={fgOpacity}>
          <rect x={2620} y={520} width={18} height={700} fill="#0D1013" />
          <rect x={-220} y={930} width={34} height={90} rx={8} fill="#0D1013" />
        </g>
        {night > 0 ? <rect width={W} height={H} fill={C.INK} opacity={night} /> : null}
      </svg>
    </AbsoluteFill>
  );
};
