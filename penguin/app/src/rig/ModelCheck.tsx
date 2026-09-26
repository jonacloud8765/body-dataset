import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useSheet} from '../art/sheet';
import {FONT_MONO} from '../fonts';
import {Part, PenguinRig, ANIME_LOOK} from './Penguin';
import type {BodyId, HeadId, RigPose} from './types';

/**
 * QA sheet for the rig: the traced body next to the reassembled rig, every head on each body,
 * and a few poses. Compare against the model sheet.
 */
const cells: {label: string; body: BodyId; head: HeadId | 'traced'; pose?: RigPose}[] = [
  {label: '3/4 traced', body: '34', head: 'traced'},
  {label: 'rig · own', body: '34', head: 'own'},
  {label: 'profile', body: '34', head: 'profile'},
  {label: 'smirk', body: '34', head: 'smirk'},
  {label: 'sideeye', body: '34', head: 'sideeye'},
  {label: 'annoyed', body: '34', head: 'annoyed'},
  {label: 'laugh', body: '34', head: 'laugh'},
  {label: 'sad', body: '34', head: 'sad'},
  {label: 'surprised', body: '34', head: 'surprised'},
  {label: 'angry', body: '34', head: 'angry'},
  {label: 'frown', body: '34', head: 'frown'},
  {label: 'stride', body: '34', head: 'profile', pose: {ankleA: [-40, -30], ankleB: [60, -34], pelvis: [8, 6], lean: 4, footA: -18, footB: 6}},
  {label: 'front traced', body: 'front', head: 'traced'},
  {label: 'rig · own', body: 'front', head: 'own'},
  {label: 'frown', body: 'front', head: 'frown'},
  {label: 'surprised', body: 'front', head: 'surprised'},
  {label: 'laugh', body: 'front', head: 'laugh'},
  {label: 'angry', body: 'front', head: 'angry'},
  {label: 'sad', body: 'front', head: 'sad'},
  {label: 'step', body: 'front', head: 'frown', pose: {ankleA: [-19, -56], pelvis: [2, -6], footA: 8}},
];

export const ModelCheck: React.FC = () => {
  const sheet = useSheet();
  if (!sheet) return <AbsoluteFill style={{background: '#fff'}} />;
  const cols = 10;
  const cw = 192;
  const ch = 540;
  return (
    <AbsoluteFill style={{background: '#6F9BD8'}}>
      <svg width={1920} height={1080}>
        {cells.map((c, i) => {
          const cx = (i % cols) * cw + cw / 2;
          const base = Math.floor(i / cols) * ch + ch - 40;
          const body = sheet.bodies[c.body];
          const h = 420;
          return (
            <g key={i}>
              <text x={cx} y={base + 30} textAnchor="middle" fontFamily={FONT_MONO} fontSize={18} fill="#333">
                {c.label}
              </text>
              {c.head === 'traced' ? (
                <g transform={`translate(${cx} ${base}) scale(${h / body.height})`}>
                  <Part part={sheet.parts[`body.${c.body}`]} look={ANIME_LOOK} />
                </g>
              ) : (
                <PenguinRig body={body} bodyId={c.body} heads={sheet.heads} head={c.head} pose={c.pose} x={cx} y={base} h={h} />
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
