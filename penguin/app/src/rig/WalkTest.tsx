import React, {useId} from 'react';
import {AbsoluteFill, Html5Audio, staticFile, useCurrentFrame} from 'remotion';
import {useSheet} from '../art/sheet';
import {beatsAt, FPS, GRID, posToFrame} from '../timing/song';
import {FlatGround, FlatMountain, FlatRanges, FlatSky, FlatSnow, FootPrint, H, SnowKick, W} from '../world/Flat';
import {WORLD} from '../world/palette';
import {LetterboxBars} from '../world/World';
import {FLAT_LOOK, PenguinRig, type RigLook} from './Penguin';
import {footfalls, walkPose, WALK_STRIDE} from './walk';

/**
 * The walk, on the song, in the flat 2D look: a side-on tracking shot like S19, from bar 17.
 * Every footfall lands on a beat and leaves a print that stays in the snow; the snow moves exactly
 * as fast as his planted foot, so nothing slides.
 */
export const WALK_TEST_START = posToFrame('17.1');

const LOOK: RigLook = {...FLAT_LOOK, shade_: {torso: 0, head: 0, leg: 0, foot: 0}};

export const WalkTest: React.FC = () => {
  const f = useCurrentFrame();
  const sheet = useSheet();
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const t = (WALK_TEST_START + f) / FPS;
  const beats = beatsAt(t);
  const P = WORLD.noon;
  const horizon = 610;
  const feetY = 905;
  const h = 540;
  const x = 760;
  const sun = {x: 1660, y: 250};
  if (!sheet) return <AbsoluteFill style={{background: P.sky[2]}} />;
  const body = sheet.bodies['34'];
  const s = h / body.height;
  const travel = beats * WALK_STRIDE * s;
  const pose = walkPose(body, '34', beats);
  const shade = P.snowShade;
  const shadowLook: RigLook = {...LOOK, white: shade, ink: shade, navy: shade, line: shade};

  // prints: each footfall stays where it landed while the ground slides by
  const falls = footfalls(body, '34', beats);
  const printAt = (k: number, fx: number) => x + (fx + 12 - (beats - k) * WALK_STRIDE) * s;
  const depth = (side: 'A' | 'B') => (side === 'A' ? -6 * s * 0.6 : 0);
  const last = falls[falls.length - 1];
  const kickU = last ? ((beats - last.k) * GRID.beat_s * FPS) / 11 : -1;

  // contact shadows follow each foot and shrink as it lifts
  const feet = [
    {a: pose.ankleA!, rest: body.joints.ankleFar[1] - 6, dy: -6 * s * 0.6},
    {a: pose.ankleB!, rest: body.joints.ankleNear[1], dy: 0},
  ];

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Html5Audio src={staticFile('audio/song.mp3')} trimBefore={WALK_TEST_START} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <FlatSky id={id} P={P} horizon={horizon} sun={sun} t={t} pan={travel} />
        <FlatRanges P={P} horizon={horizon} pan={-travel} />
        <FlatMountain id={id} P={P} x={1480 - travel * 0.01} y={horizon + 2} h={120} sun={sun} haze={0.3} />
        <FlatGround id={id} P={P} horizon={horizon} feetY={feetY} travel={travel} t={t} />
        {falls.map((fl) => (
          <FootPrint key={fl.k} x={printAt(fl.k, fl.x)} y={feetY + depth(fl.side) + 2} len={46 * s} P={P} />
        ))}
        {/* his shadow on the snow, cast away from the sun */}
        <g transform={`translate(${x} ${feetY}) matrix(1 0 0.8 -0.1 0 0) translate(${-x} ${-feetY})`}>
          <PenguinRig body={body} bodyId="34" heads={sheet.heads} head="profile" pose={pose} x={x} y={feetY} h={h} look={shadowLook} flat />
        </g>
        {feet.map((ft, i) => {
          const lift = Math.max(0, ft.rest - ft.a[1]);
          const k = Math.max(0.35, 1 - lift / 30);
          return <ellipse key={i} cx={x + (ft.a[0] + 12) * s} cy={feetY + ft.dy + 2} rx={30 * s * k} ry={5 * s * k} fill={P.snowShade} />;
        })}
        <PenguinRig body={body} bodyId="34" heads={sheet.heads} head="profile" pose={pose} x={x} y={feetY} h={h} look={LOOK} />
        {last ? <SnowKick x={printAt(last.k, last.x) + 10 * s} y={feetY + depth(last.side)} u={kickU} size={60 * s} P={P} seed={`k${last.k}`} /> : null}
        <FlatSnow t={t} n={50} top={138} bottom={942} />
        <LetterboxBars />
      </svg>
    </AbsoluteFill>
  );
};
