import React, {useId} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {useSheet} from '../art/sheet';
import {HEIGHT, WIDTH} from '../timing/song';
import {Character} from './Character';
import {CAVES, CORNICES, cumulus, gullies, MOUNTAIN, poly, range, RIDGE, roughen, sastrugi, smooth, SNOWFIELD, type Pt} from './geometry';
import {PALETTES, SHEET, type Palette, type StyleId} from './palettes';

/**
 * One scene rendered in each candidate style: HIM at the edge of the plain, the mountain on the
 * horizon, low morning sun. Everything is the production renderer, not a paint-over: the same
 * components and parameters would draw every shot of the film in the chosen style.
 */

const BAR = Math.round((HEIGHT - WIDTH / 2.39) / 2); // letterbox bar, 138 px
const HZ = 600; // horizon
const SUN = {x: 1610, y: 392};
const MTN = {x: 1290, y: HZ + 2, h: 178};
const HIM = {x: 610, y: 906, h: 600};

type Ctx = {st: StyleId; P: Palette; id: string; f: number};

// ─── shared SVG filters ────────────────────────────────────────────────────
const Filters: React.FC<Ctx> = ({id}) => (
  <defs>
    <filter id={`wash${id}`} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={3} seed={4} result="t" />
      <feDisplacementMap in="SourceGraphic" in2="t" scale={12} xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id={`mottle${id}`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.009" numOctaves={4} seed={31} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.5  0 0 0 0 0.6  0 0 0 2.4 -1.05" />
    </filter>
    <filter id={`wobble${id}`} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={2} result="t" />
      <feDisplacementMap in="SourceGraphic" in2="t" scale={3.5} xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id={`paper${id}`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.42" numOctaves={3} seed={7} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.44  0 0 0 0 0.40  0 0 0 -1.6 0.95" />
    </filter>
    <filter id={`tooth${id}`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={4} seed={21} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.55  0 0 0 0 0.52  0 0 0 -1.4 0.72" />
    </filter>
    <filter id={`grain${id}`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 -3 1.6" />
    </filter>
    {[1.2, 3, 6, 14, 30, 60].map((b) => (
      <filter key={b} id={`b${String(b).replace('.', '_')}${id}`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={b} />
      </filter>
    ))}
  </defs>
);
const blur = (id: string, b: number) => `url(#b${String(b).replace('.', '_')}${id})`;

// ─── sky ───────────────────────────────────────────────────────────────────
const Sky: React.FC<Ctx> = ({st, P, id}) => {
  const clouds =
    st === 'anime'
      ? [cumulus(420, 330, 520, 'c1', 11), cumulus(980, 250, 380, 'c2', 9), cumulus(150, 470, 300, 'c3', 7)]
      : [];
  return (
    <g>
      <defs>
        <linearGradient id={`sky${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={BAR} x2={0} y2={HZ}>
          {P.sky.map((c, i) => (
            <stop key={i} offset={[0, 0.45, 0.8, 1][i]} stopColor={c} />
          ))}
        </linearGradient>
        <radialGradient id={`glow${id}`} gradientUnits="userSpaceOnUse" cx={SUN.x} cy={SUN.y} r={st === 'painterly' ? 520 : 300}>
          <stop offset="0" stopColor={P.halo} stopOpacity={st === 'painterly' ? 0.95 : 0.8} />
          <stop offset="0.35" stopColor={P.halo} stopOpacity={st === 'painterly' ? 0.45 : 0.25} />
          <stop offset="1" stopColor={P.halo} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={WIDTH} height={HZ + 40} fill={`url(#sky${id})`} />
      {st === 'ink' ? (
        <>
          {/* pigment pooled unevenly across the wash */}
          <rect x={0} y={0} width={WIDTH} height={HZ} filter={`url(#mottle${id})`} opacity={0.55} style={{mixBlendMode: 'multiply'}} />
          <circle cx={SUN.x} cy={SUN.y} r={230} fill={`url(#glow${id})`} filter={`url(#wash${id})`} />
          <circle cx={SUN.x} cy={SUN.y} r={40} fill={P.sun} filter={`url(#wobble${id})`} />
        </>
      ) : null}
      {st === 'flat' ? (
        <>
          <circle cx={SUN.x} cy={SUN.y} r={150} fill={P.halo} opacity={0.22} />
          <circle cx={SUN.x} cy={SUN.y} r={96} fill={P.halo} opacity={0.35} />
          <circle cx={SUN.x} cy={SUN.y} r={46} fill={P.sun} />
          {[
            [150, 292, 420, '#F2CBC0'],
            [250, 322, 520, '#EDBDB7'],
            [90, 352, 330, '#E7B4B3'],
            [1010, 236, 300, '#E3C0C9'],
            [1080, 262, 380, '#DDB4C1'],
          ].map(([x, y, w, c], i) => (
            <rect key={i} x={Number(x)} y={Number(y)} width={Number(w)} height={24} rx={12} fill={String(c)} />
          ))}
        </>
      ) : null}
      {st === 'painterly' ? (
        <>
          <rect x={0} y={0} width={WIDTH} height={HZ + 40} fill={`url(#glow${id})`} />
          {/* god rays */}
          <g opacity={0.16} filter={blur(id, 14)} style={{mixBlendMode: 'screen'}}>
            {[-2.55, -2.2, -1.9, -1.2, -0.75, 2.8].map((a, i) => (
              <polygon key={i} points={`${SUN.x},${SUN.y} ${SUN.x + Math.cos(a) * 1600},${SUN.y + Math.sin(a) * 1600} ${SUN.x + Math.cos(a + 0.07) * 1600},${SUN.y + Math.sin(a + 0.07) * 1600}`} fill="#FFF3D8" />
            ))}
          </g>
          {/* cloud wisps */}
          <g filter={blur(id, 14)} opacity={0.5}>
            <ellipse cx={520} cy={300} rx={420} ry={26} fill="#F2CDB6" />
            <ellipse cx={760} cy={340} rx={300} ry={18} fill="#EFC1B0" />
            <ellipse cx={1180} cy={236} rx={380} ry={20} fill="#D9BFC4" />
          </g>
          <circle cx={SUN.x} cy={SUN.y} r={42} fill={P.sun} filter={blur(id, 3)} />
          <circle cx={SUN.x} cy={SUN.y} r={120} fill="#FFF1CC" opacity={0.5} filter={blur(id, 30)} />
        </>
      ) : null}
      {st === 'anime' ? (
        <>
          <rect x={0} y={0} width={WIDTH} height={HZ + 40} fill={`url(#glow${id})`} opacity={0.8} />
          {clouds.map((puffs, j) => (
            <g key={j}>
              {puffs.map((p, i) => (
                <circle key={`s${i}`} cx={p.x + 6} cy={p.y + 10} r={p.r} fill="#BCD0F1" />
              ))}
              {puffs.map((p, i) => (
                <circle key={`w${i}`} cx={p.x} cy={p.y} r={p.r} fill="#FFFFFF" />
              ))}
              {puffs.map((p, i) => (
                <circle key={`h${i}`} cx={p.x - p.r * 0.1} cy={p.y + p.r * 0.35} r={p.r * 0.72} fill="#DCE7F8" />
              ))}
              {puffs.map((p, i) => (
                <circle key={`t${i}`} cx={p.x - p.r * 0.05} cy={p.y - p.r * 0.12} r={p.r * 0.86} fill="#FFFFFF" />
              ))}
            </g>
          ))}
          <circle cx={SUN.x} cy={SUN.y} r={70} fill="#FFF7DF" opacity={0.6} filter={blur(id, 14)} />
          <circle cx={SUN.x} cy={SUN.y} r={38} fill={P.sun} />
        </>
      ) : null}
      {/* horizon haze */}
      <rect x={0} y={HZ - 70} width={WIDTH} height={90} fill={P.sky[3]} opacity={st === 'painterly' ? 0.55 : st === 'flat' ? 0 : 0.3} filter={blur(id, 30)} />
    </g>
  );
};

// ─── distant ranges ────────────────────────────────────────────────────────
const Ranges: React.FC<Ctx> = ({st, P, id}) => {
  const far = range(HZ + 1, 34, 'far');
  const mid = range(HZ + 2, 18, 'mid', -100, 2020, 10);
  return (
    <g>
      <path d={poly(far)} fill={P.rangeFar} filter={st === 'ink' ? `url(#wash${id})` : st === 'painterly' ? blur(id, 1.2) : undefined} opacity={st === 'ink' ? 0.8 : 1} />
      <path d={poly(mid)} fill={P.rangeMid} filter={st === 'ink' ? `url(#wash${id})` : undefined} opacity={st === 'ink' ? 0.85 : 1} />
      {st === 'anime' ? <path d={poly(mid, false)} fill="none" stroke="#7D9ED0" strokeWidth={1.2} /> : null}
    </g>
  );
};

// ─── the mountain ──────────────────────────────────────────────────────────
/** x of the main ridge at height y (units), so hatching can be denser on the shadow side. */
const ridgeX = (yu: number) => {
  for (let i = 0; i < RIDGE.length - 1; i++) {
    const [x0, y0] = RIDGE[i];
    const [x1, y1] = RIDGE[i + 1];
    if (yu >= y0 && yu <= y1) return x0 + ((x1 - x0) * (yu - y0)) / (y1 - y0);
  }
  return 40;
};

const Mountain: React.FC<Ctx> = ({st, P, id}) => {
  const s = MTN.h / 100;
  const out = roughen(MOUNTAIN, s, 'mtn', 1.8);
  const snow = roughen(SNOWFIELD, s, 'snow', 2.6, 1.6);
  const ridge = RIDGE.map(([x, y]) => [x * s, y * s] as Pt);
  const shadeSide: Pt[] = [...ridge, [-130 * s, 0], [-130 * s, -115 * s], [-10 * s, -115 * s]];
  const litSide: Pt[] = [...ridge, [130 * s, 0], [130 * s, -115 * s], [-10 * s, -115 * s]];
  const g = gullies(s, 'gul', 10);
  const hatch: [Pt, Pt, number][] = [];
  if (st === 'ink') {
    for (let i = 0; i < 150; i++) {
      const u = random(`hx${i}`);
      const v = random(`hy${i}`);
      const x = (-100 + u * 200) * s;
      const y = -v * 100 * s;
      const onShade = x < ridgeX(y / s) * s;
      const len = (5 + random(`hl${i}`) * 9) * s;
      const ang = x < 0 ? 2.2 : 0.95;
      hatch.push([[x, y], [x + Math.cos(ang) * len, y + Math.sin(ang) * len], onShade ? 1 : 0.5]);
    }
  }
  const outline = smooth(out, true, 0.3);
  const snowPath = smooth(snow, true, 0.35);
  const clip = `mc${id}`;
  return (
    <g transform={`translate(${MTN.x},${MTN.y})`}>
      <defs>
        <clipPath id={clip}>
          <path d={outline} />
        </clipPath>
        <clipPath id={`ms${id}`}>
          <path d={poly(shadeSide)} />
        </clipPath>
        <clipPath id={`ml${id}`}>
          <path d={poly(litSide)} />
        </clipPath>
        <linearGradient id={`rockg${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={-MTN.h} x2={0} y2={0}>
          <stop offset="0" stopColor={P.rock} />
          <stop offset="1" stopColor={st === 'painterly' ? '#8E8FA1' : P.rock} />
        </linearGradient>
        <linearGradient id={`haze${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={-MTN.h} x2={0} y2={0}>
          <stop offset="0" stopColor={P.sky[3]} stopOpacity={0.05} />
          <stop offset="1" stopColor={P.sky[3]} stopOpacity={0.55} />
        </linearGradient>
      </defs>
      {/* rock */}
      <path d={outline} fill={st === 'painterly' ? `url(#rockg${id})` : P.rock} filter={st === 'ink' ? `url(#wash${id})` : undefined} opacity={st === 'ink' ? 0.85 : 1} />
      <g clipPath={`url(#${clip})`}>
        {/* the side turned away from the sun */}
        <g clipPath={`url(#ms${id})`}>
          <rect x={-140 * s} y={-120 * s} width={280 * s} height={130 * s} fill={P.rockShade} opacity={st === 'ink' ? 0.55 : st === 'painterly' ? 0.8 : 1} filter={st === 'painterly' ? blur(id, 3) : st === 'ink' ? `url(#wash${id})` : undefined} />
        </g>
        {st === 'ink'
          ? hatch.map(([a, b, w], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={P.rockLine} strokeWidth={0.9 + w * 0.6} opacity={0.55 + w * 0.3} strokeLinecap="round" />)
          : null}
        {/* the white face */}
        <path d={snowPath} fill={P.snow} filter={st === 'ink' ? `url(#wobble${id})` : undefined} />
        <g clipPath={`url(#ms${id})`}>
          <path d={snowPath} fill={P.snowShade} opacity={st === 'ink' ? 0.55 : st === 'painterly' ? 0.85 : 1} filter={st === 'ink' ? `url(#wash${id})` : st === 'painterly' ? blur(id, 3) : undefined} />
        </g>
        {/* snow gullies on the lit flank */}
        <g clipPath={`url(#ml${id})`}>
          {g.map((pts, i) => (
            <path key={i} d={smooth(pts, true, 0.5)} fill={P.snow} opacity={st === 'painterly' ? 0.85 : 1} filter={st === 'painterly' ? blur(id, 1.2) : undefined} />
          ))}
        </g>
        {/* cornices and the two caves, barely there */}
        {CORNICES.map(([cx, cy], i) => (
          <path key={i} d={`M${(cx - 5) * s} ${(cy + 1) * s}q${3 * s} ${-9 * s} ${10 * s} ${-6 * s}q${-4 * s} ${1 * s} ${-3 * s} ${5 * s}z`} fill={P.snow} />
        ))}
        {CAVES.map(([cx, cy], i) => (
          <ellipse key={i} cx={cx * s} cy={cy * s} rx={4.2 * s} ry={2.2 * s} fill={P.rockShade} opacity={st === 'ink' ? 0.5 : 0.7} filter={st === 'painterly' || st === 'ink' ? blur(id, 1.2) : undefined} />
        ))}
        {/* haze: the mountain is far away */}
        {st !== 'flat' ? <rect x={-140 * s} y={-120 * s} width={280 * s} height={130 * s} fill={`url(#haze${id})`} opacity={st === 'anime' ? 0.5 : 1} /> : null}
      </g>
      {/* line and light on the edge */}
      {st === 'ink' ? <path d={outline} fill="none" stroke={SHEET.ink} strokeWidth={1.8} strokeLinejoin="round" filter={`url(#wobble${id})`} opacity={0.85} /> : null}
      {st === 'anime' ? (
        <>
          <g clipPath={`url(#ml${id})`}>
            <path d={outline} fill="none" stroke="#A9B8E2" strokeWidth={5} />
          </g>
          <path d={outline} fill="none" stroke={P.rockLine} strokeWidth={1.6} strokeLinejoin="round" />
        </>
      ) : null}
      {st === 'painterly' ? (
        <g clipPath={`url(#ml${id})`} filter={blur(id, 3)}>
          <path d={outline} fill="none" stroke="#FFD49A" strokeWidth={5} opacity={0.9} />
        </g>
      ) : null}
      {st === 'flat' ? (
        <g clipPath={`url(#${clip})`}>
          <g clipPath={`url(#ml${id})`}>
            <path d={outline} fill="none" stroke="#7E7FAA" strokeWidth={10} />
          </g>
        </g>
      ) : null}
    </g>
  );
};

// ─── the plain ─────────────────────────────────────────────────────────────
const Plain: React.FC<Ctx> = ({st, P, id}) => {
  const strokes = sastrugi(HZ, HEIGHT - BAR + 30, st === 'flat' ? 60 : 130, 'sas');
  return (
    <g>
      <defs>
        <linearGradient id={`gnd${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={HZ} x2={WIDTH} y2={HEIGHT}>
          <stop offset="0" stopColor={P.ground} />
          <stop offset="1" stopColor={st === 'painterly' ? '#E4DDD6' : P.ground} />
        </linearGradient>
        <linearGradient id={`hzw${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={HZ} x2={0} y2={HZ + 150}>
          <stop offset="0" stopColor={P.groundShade} stopOpacity={0.5} />
          <stop offset="1" stopColor={P.groundShade} stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`gl${id}`} gradientUnits="userSpaceOnUse" cx={SUN.x} cy={HZ + 30} r={900}>
          <stop offset="0" stopColor="#FFE6C0" stopOpacity={st === 'painterly' ? 0.75 : st === 'anime' ? 0.35 : 0} />
          <stop offset="1" stopColor="#FFE6C0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={HZ} width={WIDTH} height={HEIGHT - HZ} fill={`url(#gnd${id})`} />
      <rect x={0} y={HZ} width={WIDTH} height={HEIGHT - HZ} fill={`url(#gl${id})`} />
      {/* long cool shadows of drifts crossing the plain */}
      {st !== 'ink' ? (
        <g filter={st === 'painterly' ? blur(id, 6) : undefined} opacity={st === 'painterly' ? 0.45 : st === 'flat' ? 0.55 : 0.6}>
          <path d={smooth([[-100, 700], [300, 690], [760, 712], [1100, 706], [1500, 724], [2020, 716], [2020, 744], [1400, 750], [900, 738], [400, 730], [-100, 736]], true, 0.4)} fill={P.groundShade} />
          <path d={smooth([[-100, 812], [260, 800], [700, 826], [1000, 818], [1300, 834], [2020, 824], [2020, 868], [1300, 866], [760, 858], [200, 850], [-100, 856]], true, 0.4)} fill={P.groundShade} opacity={0.7} />
        </g>
      ) : (
        <g filter={`url(#wash${id})`}>
          <rect x={-50} y={HZ + 1} width={2020} height={150} fill={`url(#hzw${id})`} />
          <path d={smooth([[120, 812], [420, 800], [760, 818], [900, 832], [560, 842], [200, 836]], true, 0.5)} fill={P.groundShade} opacity={0.3} />
          <path d={smooth([[1250, 742], [1520, 732], [1800, 746], [1620, 758], [1340, 756]], true, 0.5)} fill={P.groundShade} opacity={0.28} />
        </g>
      )}
      {/* sastrugi */}
      <g filter={st === 'painterly' ? blur(id, 1.2) : undefined}>
        {strokes.map(([d, depth], i) => (
          <path
            key={i}
            d={d}
            fill={st === 'ink' ? SHEET.line2 : P.sastrugi}
            opacity={st === 'ink' ? 0.35 + depth * 0.5 : st === 'flat' ? 0.9 : 0.55 + depth * 0.4}
            filter={st === 'ink' ? `url(#wobble${id})` : undefined}
          />
        ))}
      </g>
      {/* the horizon line */}
      {st === 'ink' ? <path d={`M-20 ${HZ + 1}H1940`} stroke={SHEET.line2} strokeWidth={1.4} strokeDasharray="220 14 90 22 400 10" filter={`url(#wobble${id})`} /> : null}
      {/* sparkle on the sunlit snow */}
      {st === 'anime' || st === 'painterly'
        ? new Array(40).fill(0).map((_, i) => {
            const x = 900 + random(`sp${i}`) * 1000;
            const y = HZ + 10 + Math.pow(random(`sq${i}`), 1.5) * 300;
            const r = 1.5 + random(`sr${i}`) * 3;
            return st === 'anime' ? (
              <path key={i} d={`M${x} ${y - r * 2.2}L${x + r * 0.4} ${y - r * 0.4}L${x + r * 2.2} ${y}L${x + r * 0.4} ${y + r * 0.4}L${x} ${y + r * 2.2}L${x - r * 0.4} ${y + r * 0.4}L${x - r * 2.2} ${y}L${x - r * 0.4} ${y - r * 0.4}Z`} fill="#FFFFFF" />
            ) : (
              <circle key={i} cx={x} cy={y} r={r * 0.6} fill="#FFF8EA" opacity={0.9} />
            );
          })
        : null}
    </g>
  );
};

// ─── the near drift (foreground, bottom right) ─────────────────────────────
const Drift: React.FC<Ctx> = ({st, P, id}) => {
  const top: Pt[] = [[1000, 960], [1180, 900], [1400, 850], [1640, 826], [1980, 818]];
  const d = smooth([...top, [1980, 1000], [1060, 1000]], true, 0.4);
  const edge = smooth(top, false, 0.4);
  const face = smooth([...top.map(([x, y]) => [x + 10, y + 14] as Pt), [1980, 1000], [1060, 1000]], true, 0.4);
  return (
    <g filter={st === 'painterly' ? blur(id, 6) : undefined}>
      <path d={d} fill={st === 'ink' ? SHEET.paper : P.ground} />
      <path d={face} fill={P.groundShade} opacity={st === 'ink' ? 0.45 : st === 'flat' ? 0.75 : st === 'anime' ? 0.85 : 0.7} filter={st === 'ink' ? `url(#wash${id})` : undefined} />
      {st === 'ink' ? <path d={edge} fill="none" stroke={SHEET.ink} strokeWidth={2.6} strokeDasharray="330 16 150 24 600" filter={`url(#wobble${id})`} /> : null}
      {st === 'ink'
        ? [0, 1, 2, 3, 4, 5, 6].map((i) => {
            const x = 1180 + i * 110;
            const y = 900 - i * 10;
            return <path key={i} d={`M${x} ${y + 22}q${18} ${-8} ${40} ${-4}`} fill="none" stroke={SHEET.line2} strokeWidth={1.6} filter={`url(#wobble${id})`} />;
          })
        : null}
      {st === 'anime' ? <path d={edge} fill="none" stroke="#FFFFFF" strokeWidth={4} /> : null}
    </g>
  );
};

// ─── falling snow ──────────────────────────────────────────────────────────
const Snow: React.FC<Ctx> = ({st, P, id, f}) => {
  const n = 70;
  return (
    <g>
      {new Array(n).fill(0).map((_, i) => {
        const depth = random(`fd${i}`);
        const sp = 0.6 + depth * 2.2;
        const x = ((((random(`fx${i}`) * 2100 - f * sp * 1.4) % 2100) + 2100) % 2100) - 90;
        const y = (((random(`fy${i}`) * 900 + f * sp) % 900) + 900) % 900 + BAR - 40;
        const r = 1.2 + depth * depth * (st === 'painterly' ? 11 : 4.5);
        if (st === 'painterly' && depth > 0.85) {
          return <circle key={i} cx={x} cy={y} r={r * 1.4} fill="#FFFFFF" opacity={0.35} filter={blur(id, 6)} />;
        }
        return <circle key={i} cx={x} cy={y} r={r} fill={P.flake} opacity={st === 'ink' ? 0.95 : 0.85} stroke={st === 'ink' ? '#B9BCBC' : undefined} strokeWidth={st === 'ink' ? 0.6 : 0} />;
      })}
    </g>
  );
};

// ─── the grade ─────────────────────────────────────────────────────────────
const Grade: React.FC<Ctx> = ({st, id}) => (
  <g>
    {st === 'ink' ? (
      <>
        <rect width={WIDTH} height={HEIGHT} filter={`url(#tooth${id})`} opacity={0.22} style={{mixBlendMode: 'multiply'}} />
        <rect width={WIDTH} height={HEIGHT} filter={`url(#paper${id})`} opacity={0.3} style={{mixBlendMode: 'multiply'}} />
      </>
    ) : null}
    {st === 'painterly' ? (
      <>
        <circle cx={SUN.x} cy={SUN.y} r={360} fill="#FFD9A0" opacity={0.28} filter={blur(id, 60)} style={{mixBlendMode: 'screen'}} />
        <rect width={WIDTH} height={HEIGHT} filter={`url(#grain${id})`} opacity={0.1} style={{mixBlendMode: 'overlay'}} />
      </>
    ) : null}
    {st === 'flat' ? <rect width={WIDTH} height={HEIGHT} filter={`url(#grain${id})`} opacity={0.05} style={{mixBlendMode: 'overlay'}} /> : null}
    {st === 'anime' ? (
      <g style={{mixBlendMode: 'screen'}}>
        <ellipse cx={SUN.x} cy={SUN.y} rx={420} ry={5} fill="#FFF3D6" opacity={0.7} filter={blur(id, 3)} />
        <circle cx={SUN.x} cy={SUN.y} r={130} fill="#FFF0CF" opacity={0.25} filter={blur(id, 30)} />
      </g>
    ) : null}
    {st !== 'flat' ? (
      <rect width={WIDTH} height={HEIGHT} fill={`url(#vig${id})`} style={{mixBlendMode: 'multiply'}} />
    ) : null}
  </g>
);

export const StyleScene: React.FC<{style: StyleId}> = ({style}) => {
  const f = useCurrentFrame();
  const sheet = useSheet();
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const P = PALETTES[style];
  const ctx: Ctx = {st: style, P, id, f};
  const part = sheet?.parts['body.34'];
  const push = 1 + f * 0.0004;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <Filters {...ctx} />
        <defs>
          <radialGradient id={`vig${id}`} cx="50%" cy="50%" r="75%">
            <stop offset="0.6" stopColor="#FFFFFF" />
            <stop offset="1" stopColor={style === 'ink' ? '#D8D4C8' : '#9A9AA8'} />
          </radialGradient>
        </defs>
        <g transform={`translate(${WIDTH / 2} ${HEIGHT / 2}) scale(${push}) translate(${-WIDTH / 2} ${-HEIGHT / 2})`}>
          <Sky {...ctx} />
          <Ranges {...ctx} />
          <g filter={style === 'painterly' ? blur(id, 1.2) : undefined}>
            <Mountain {...ctx} />
          </g>
          <Plain {...ctx} />
          {part ? <Character part={part} style={style} P={P} x={HIM.x} y={HIM.y} h={HIM.h} sun={SUN} shadow={{kx: 1.05, ky: -0.06}} /> : null}
          <Drift {...ctx} />
          <Snow {...ctx} />
        </g>
        <Grade {...ctx} />
        <rect x={0} y={0} width={WIDTH} height={BAR} fill="#000" />
        <rect x={0} y={HEIGHT - BAR} width={WIDTH} height={BAR} fill="#000" />
      </svg>
    </AbsoluteFill>
  );
};
