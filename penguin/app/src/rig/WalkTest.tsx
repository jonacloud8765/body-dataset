import React, {useId} from 'react';
import {AbsoluteFill, Html5Audio, staticFile, useCurrentFrame} from 'remotion';
import {useSheet} from '../art/sheet';
import {beatsAt, FPS, posToFrame} from '../timing/song';
import {mixHex, WORLD} from '../world/palette';
import {Ground, H, LetterboxBars, Mountain, Ranges, Sky, Snowfall, W} from '../world/World';
import {ANIME_LOOK, PenguinRig} from './Penguin';
import {walkPose, WALK_STRIDE} from './walk';

/**
 * The walk, on the song: a side-on tracking shot like S19, starting on bar 17. Every footfall lands
 * on a beat; the snow moves exactly as fast as his planted foot, so nothing slides.
 */
export const WALK_TEST_START = posToFrame('17.1');

export const WalkTest: React.FC = () => {
  const f = useCurrentFrame();
  const sheet = useSheet();
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const t = (WALK_TEST_START + f) / FPS;
  const beats = beatsAt(t);
  const P = WORLD.noon;
  const horizon = 610;
  const feetY = 905;
  const h = 560;
  const x = 760;
  const sun = {x: 1660, y: 250};
  if (!sheet) return <AbsoluteFill style={{background: P.sky[2]}} />;
  const body = sheet.bodies['34'];
  const s = h / body.height;
  const travel = beats * WALK_STRIDE * s;
  const pose = walkPose(body, '34', beats);
  const cy = feetY - h * 0.55;
  const l = Math.hypot(sun.x - x, sun.y - cy);
  const light: [number, number] = [(sun.x - x) / l, (sun.y - cy) / l];
  const look = {...ANIME_LOOK, shade: P.bodyShade, rim: P.bodyRim};
  const shade = mixHex(P.snowShade, P.line, 0.22);
  const shadowLook = {...look, white: shade, ink: shade, navy: shade};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Html5Audio src={staticFile('audio/song.mp3')} trimBefore={WALK_TEST_START} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Sky id={id} P={P} horizon={horizon} sun={sun} t={t} pan={travel} />
        <Ranges P={P} horizon={horizon} pan={-travel} />
        <Mountain id={id} P={P} x={1480 - travel * 0.01} y={horizon + 2} h={120} sun={sun} haze={0.35} />
        <Ground id={id} P={P} horizon={horizon} feetY={feetY} travel={travel} sun={sun} t={t} />
        {/* his shadow on the snow, cast away from the sun */}
        <g opacity={0.6} transform={`translate(${x} ${feetY}) matrix(1 0 0.85 -0.12 0 0) translate(${-x} ${-feetY})`}>
          <PenguinRig body={body} bodyId="34" heads={sheet.heads} head="profile" pose={pose} x={x} y={feetY} h={h} light={light} look={shadowLook} flat />
        </g>
        <PenguinRig body={body} bodyId="34" heads={sheet.heads} head="profile" pose={pose} x={x} y={feetY} h={h} light={light} look={look} />
        <Snowfall t={t} n={60} top={138} bottom={942} />
        <LetterboxBars />
      </svg>
    </AbsoluteFill>
  );
};
