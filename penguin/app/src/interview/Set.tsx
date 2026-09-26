import React from 'react';
import {random} from 'remotion';
import {RockFace, trampledOf} from '../film/Props';
import {FlatMountain, FlatRanges, FlatSky, W} from '../world/Flat';
import {mixHex, type WorldPalette} from '../world/palette';
import {INK} from './People';

/**
 * Where the interview happens: a rocky outcrop above the colony, in the film's flat look.
 * Looking one way (behind the scientist): down the slope to the colony and the sea ice beyond.
 * Looking the other way (behind the interviewer): inland, to the mountain on the horizon.
 */

/** Small penguins of the colony, scattered on the slope, smaller with distance. */
export const Rookery: React.FC<{P: WorldPalette; x0: number; x1: number; y0: number; y1: number; n: number; s0: number; s1: number; seed: string; t: number}> = ({P, x0, x1, y0, y1, n, s0, s1, seed, t}) => {
  const white = mixHex('#FBF8F2', P.snowShade, 0.08);
  const birds = new Array(n).fill(0).map((_, i) => {
    const u = Math.pow(random(`${seed}y${i}`), 1.25);
    return {i, u, x: x0 + random(`${seed}x${i}`) * (x1 - x0), y: y0 + u * (y1 - y0)};
  });
  birds.sort((a, b) => a.y - b.y);
  return (
    <g>
      {birds.map(({i, u, x, y}) => {
        const s = s0 + (s1 - s0) * u;
        const lying = random(`${seed}l${i}`) < 0.55;
        const dir = random(`${seed}d${i}`) < 0.5 ? 1 : -1;
        const bob = Math.sin(t * (1 + random(`${seed}b${i}`) * 2) + i) > 0.92 ? -1.5 : 0;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
            <ellipse cx={0} cy={1} rx={11} ry={2.6} fill={P.snowShade} />
            {lying ? (
              <>
                <ellipse cx={0} cy={-5} rx={10} ry={5.5} fill={INK} />
                <path d="M -7 -2 C -2 1, 5 1, 9 -3 L 9 -1 C 4 3, -3 3, -8 0 Z" fill={white} />
                <circle cx={8} cy={-9 + bob} r={3.6} fill={INK} />
                <circle cx={9} cy={-9.6 + bob} r={1} fill={white} />
              </>
            ) : (
              <>
                <ellipse cx={0} cy={-10} rx={5.2} ry={10} fill={INK} />
                <path d="M 1 -18 C 5 -16, 6 -6, 3 0 L 0 0 C 2 -6, 2 -14, 1 -18 Z" fill={white} />
                <circle cx={1} cy={-21 + bob} r={3.6} fill={INK} />
                <circle cx={2.5} cy={-21.6 + bob} r={1} fill={white} />
                <path d={`M 4 ${-21 + bob} L 7 ${-20.4 + bob} L 4 ${-19.8 + bob} Z`} fill={INK} />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
};

/** The sea ice: a flat pale plain with pressure cracks, from the horizon down. */
const SeaIce: React.FC<{P: WorldPalette; y0: number; y1: number; seed: string}> = ({P, y0, y1, seed}) => {
  const ice = mixHex(P.snow, '#CFE0F4', 0.35);
  return (
    <g>
      <rect x={-200} y={y0} width={W + 400} height={y1 - y0 + 300} fill={ice} />
      {new Array(9).fill(0).map((_, i) => {
        const y = y0 + 6 + Math.pow(random(`${seed}c${i}`), 1.3) * (y1 - y0);
        const x = -100 + random(`${seed}x${i}`) * (W + 200);
        const len = 180 + random(`${seed}l${i}`) * 520;
        return <path key={i} d={`M ${x} ${y} l ${len * 0.3} ${-3} l ${len * 0.25} ${5} l ${len * 0.45} ${-4}`} fill="none" stroke={mixHex(ice, P.rockShade, 0.25)} strokeWidth={2 + (y - y0) / 60} strokeLinejoin="round" />;
      })}
    </g>
  );
};

type BgProps = {P: WorldPalette; t: number; id: string; pan?: number};

/** Behind the scientist: down the slope, the colony, the sea ice, the sun. */
export const BgColony: React.FC<BgProps> = ({P, t, id, pan = 0}) => {
  const hz = 300;
  return (
    <g>
      <FlatSky id={`${id}s`} P={P} horizon={hz} sun={{x: 1620, y: 120}} t={t} clouds={4} seed={`${id}c`} pan={pan} />
      <FlatRanges P={P} horizon={hz} seed={`${id}r`} amp={10} pan={-pan} />
      <SeaIce P={P} y0={hz} y1={470} seed={`${id}i`} />
      {/* dark boulders at the ice edge */}
      <RockFace id={`${id}b`} P={P} pts={[[1180, 520], [1220, 400], [1330, 360], [1500, 372], [1620, 420], [1700, 520]]} seed={`${id}b`} />
      {/* the colony's slope */}
      <path d="M -200 1300 L -200 430 C 200 380, 600 370, 900 410 C 1100 440, 1300 470, 1500 520 C 1700 570, 1900 600, 2200 620 L 2200 1300 Z" fill={trampledOf(P)} stroke={INK} strokeWidth={3} />
      <Rookery P={P} x0={-60} x1={1400} y0={440} y1={1000} n={150} s0={0.9} s1={2.6} seed={`${id}p`} t={t} />
      <RockFace id={`${id}f`} P={P} pts={[[-200, 1300], [-200, 760], [60, 800], [220, 900], [330, 1100], [380, 1300]]} seed={`${id}f`} />
    </g>
  );
};

/** Behind the interviewer: inland, snow and rock rising, the mountain small on the horizon. */
export const BgLand: React.FC<BgProps> = ({P, t, id, pan = 0}) => {
  const hz = 470;
  return (
    <g>
      <FlatSky id={`${id}s`} P={P} horizon={hz} t={t} clouds={4} seed={`${id}c`} pan={pan} />
      <FlatRanges P={P} horizon={hz} seed={`${id}r`} amp={14} pan={-pan} />
      <FlatMountain id={`${id}m`} P={P} x={1320} y={hz + 2} h={64} haze={0.35} />
      <rect x={-200} y={hz} width={W + 400} height={900} fill={P.snow} />
      <rect x={-200} y={hz} width={W + 400} height={14} fill={P.snowShade} opacity={0.5} />
      <path d="M -200 1300 L -200 620 C 200 600, 500 640, 800 700 C 1100 760, 1500 780, 2200 800 L 2200 1300 Z" fill={mixHex(P.snow, P.snowShade, 0.35)} />
      <RockFace id={`${id}a`} P={P} pts={[[1400, 1300], [1450, 900], [1620, 760], [1860, 720], [2200, 760], [2200, 1300]]} seed={`${id}a`} />
      <RockFace id={`${id}b`} P={P} pts={[[-200, 1300], [-200, 820], [80, 860], [240, 1000], [300, 1300]]} seed={`${id}b`} />
    </g>
  );
};

/** The two-shot: side-on along the ridge, the colony below, the sea ice and the mountain beyond. */
export const BgWide: React.FC<BgProps & {seats?: boolean}> = ({P, t, id, pan = 0}) => {
  const hz = 360;
  return (
    <g>
      <FlatSky id={`${id}s`} P={P} horizon={hz} sun={{x: 1500, y: 110}} t={t} clouds={5} seed={`${id}c`} pan={pan} />
      <FlatRanges P={P} horizon={hz} seed={`${id}r`} amp={10} pan={-pan} />
      <FlatMountain id={`${id}m`} P={P} x={1700} y={hz + 2} h={46} haze={0.45} />
      <SeaIce P={P} y0={hz} y1={520} seed={`${id}i`} />
      <path d="M -200 1300 L -200 470 C 300 450, 800 470, 1200 520 C 1500 560, 1800 580, 2200 590 L 2200 1300 Z" fill={trampledOf(P)} stroke={INK} strokeWidth={2.5} />
      <Rookery P={P} x0={-100} x1={2020} y0={480} y1={700} n={220} s0={0.6} s1={1.4} seed={`${id}p`} t={t} />
      {/* the outcrop they sit on */}
      <RockFace id={`${id}o`} P={P} pts={[[-200, 1300], [-200, 820], [200, 770], [520, 800], [760, 760], [1000, 790], [1300, 760], [1600, 800], [1900, 780], [2200, 830], [2200, 1300]]} seed={`${id}o`} />
      <RockFace id={`${id}l`} P={P} pts={[[468, 906], [482, 858], [530, 826], [610, 812], [700, 814], [768, 834], [806, 872], [818, 906]]} seed={`${id}l`} />
      <RockFace id={`${id}r`} P={P} pts={[[1090, 906], [1104, 858], [1150, 828], [1236, 814], [1330, 816], [1398, 836], [1434, 874], [1446, 906]]} seed={`${id}r2`} />
    </g>
  );
};
