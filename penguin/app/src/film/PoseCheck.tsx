import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useSheet} from '../art/sheet';
import {FONT_MONO} from '../fonts';
import {WORLD} from '../world/palette';
import {Him, type HimPose, type HimView} from './Him';

/** Every storyboard pose on one sheet, on a ground line, for checking. */
const cells: {label: string; view: HimView; pose: HimPose; head?: 'profile' | 'own' | 'laugh' | 'angry' | 'surprised' | 'annoyed' | 'smirk'; turn?: number}[] = [
  {label: 'stand', view: 'front34', pose: 'stand'},
  {label: 'walk', view: 'side', pose: 'walk', head: 'profile'},
  {label: 'fallen', view: 'side', pose: 'fallen', head: 'annoyed'},
  {label: 'toboggan', view: 'side', pose: 'toboggan', head: 'laugh'},
  {label: 'airborne', view: 'side', pose: 'airborne', head: 'laugh'},
  {label: 'lifted', view: 'front34', pose: 'lifted', head: 'annoyed'},
  {label: 'bow', view: 'side', pose: 'bow', head: 'laugh'},
  {label: 'shake', view: 'side', pose: 'shake', head: 'annoyed'},
  {label: 'lookup', view: 'front34', pose: 'lookup', head: 'surprised'},
  {label: 'front walk', view: 'front', pose: 'walk', head: 'own'},
  {label: 'back', view: 'back', pose: 'stand'},
  {label: 'back walk', view: 'back', pose: 'walk'},
  {label: 'back look', view: 'back', pose: 'stand', turn: 1},
  {label: 'back climb', view: 'back', pose: 'climb'},
  {label: 'side climb', view: 'side', pose: 'climb', head: 'profile'},
  {label: 'look back', view: 'side', pose: 'stand', head: 'profile', turn: 1},
  {label: 'top', view: 'top', pose: 'stand'},
];

export const PoseCheck: React.FC = () => {
  const f = useCurrentFrame();
  const sheet = useSheet();
  const P = WORLD.noon;
  if (!sheet) return <AbsoluteFill style={{background: '#fff'}} />;
  return (
    <AbsoluteFill style={{background: P.snow}}>
      <svg width={1920} height={1080}>
        {cells.map((c, i) => {
          const col = i % 9;
          const row = Math.floor(i / 9);
          const x = 110 + col * 212;
          const y = 460 + row * 500;
          return (
            <g key={i}>
              <line x1={x - 130} y1={y} x2={x + 130} y2={y} stroke="#C9D3E6" strokeWidth={2} />
              <Him sheet={sheet} P={P} view={c.view} head={c.head ?? 'own'} pose={c.pose} x={x} y={y} h={330} beats={0.3 + f / 18} t={f / 30} headTurn={c.turn ?? 0} walk={c.pose === 'climb' && c.view === 'side' ? {slope: 25, stride: 40} : {}} />
              <text x={x} y={y + 34} textAnchor="middle" fontFamily={FONT_MONO} fontSize={20} fill="#333">
                {c.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
