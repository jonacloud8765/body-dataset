import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, Easing, Html5Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {tint} from '../film/Props';
import {WORLD} from '../world/palette';
import {Director, DirectorBack, Scientist, ScientistBack, type Pose} from './People';
import {BgColony, BgLand, BgWide} from './Set';

/**
 * The interview: the documentary crew's director talks with a penguin scientist on a rocky outcrop
 * above the colony. A standalone clip in the film's universe: the flat 2D look, the documentary's
 * grade and handheld camera, 1920x1080 at 30 fps, on the conversation's own audio.
 *
 * Coverage follows the speakers (from the audio: public/audio/interview.json, local only):
 * a wide two-shot to open, then over-the-shoulders and close-ups of whoever talks, with short
 * listening reactions in the pauses, and wides over the music. No lip sync.
 */
export const INTERVIEW_FPS = 30;
export const INTERVIEW_FRAMES = 4563; // the audio's 152.09 s

type Data = {fps: number; frames: number; turns: {who: 'interviewer' | 'subject'; from: number; to: number}[]; env: {interviewer: number[]; subject: number[]}};

let cache: Data | null | undefined;
const useData = (): Data | null => {
  const [data, setData] = useState<Data | null>(cache ?? null);
  const [handle] = useState(() => (cache === undefined ? delayRender('Loading the interview timing') : null));
  useEffect(() => {
    if (handle === null) return;
    fetch(staticFile('audio/interview.json'))
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((d) => {
        cache = d;
        setData(d);
        continueRender(handle);
      });
  }, [handle]);
  return data;
};

type Setup = 'wide' | 'otsS' | 'otsI' | 'cuS' | 'cuI' | 'mcuS' | 'mcuI';
type Cut = {at: number; setup: Setup; look?: boolean; out?: boolean};

/** The edit: every cut sits in a pause between phrases (seconds of the clip). */
const EDL: Cut[] = [
  {at: 0.0, setup: 'wide'},
  {at: 8.1, setup: 'otsI'},
  {at: 12.6, setup: 'cuI'},
  {at: 18.1, setup: 'mcuS'},
  {at: 20.1, setup: 'cuI'},
  {at: 25.4, setup: 'cuS'},
  {at: 32.5, setup: 'otsS'},
  {at: 38.1, setup: 'mcuI'},
  {at: 40.2, setup: 'cuS'},
  {at: 44.5, setup: 'wide', look: true},
  {at: 48.0, setup: 'cuI'},
  {at: 52.4, setup: 'mcuS', look: true},
  {at: 56.3, setup: 'otsI'},
  {at: 61.3, setup: 'cuI'},
  {at: 69.6, setup: 'mcuS'},
  {at: 71.6, setup: 'otsI'},
  {at: 78.3, setup: 'mcuS'},
  {at: 81.0, setup: 'cuI'},
  {at: 89.9, setup: 'wide', look: true},
  {at: 96.0, setup: 'cuS', look: true},
  {at: 101.0, setup: 'mcuI'},
  {at: 104.9, setup: 'otsI'},
  {at: 110.4, setup: 'cuI'},
  {at: 116.4, setup: 'mcuS', look: true},
  {at: 121.0, setup: 'otsI'},
  {at: 126.2, setup: 'cuI'},
  {at: 129.5, setup: 'wide'},
  {at: 133.4, setup: 'cuI'},
  {at: 138.6, setup: 'mcuS'},
  {at: 140.1, setup: 'otsI'},
  {at: 145.6, setup: 'wide', look: true, out: true},
];

/** Listening nods (seconds): brief, in the pauses. */
const NODS = {
  subject: [19.0, 70.3, 79.1, 117.6, 139.1, 22.8, 64.2, 112.5],
  interviewer: [38.8, 42.9, 34.4, 31.2],
};

const DOC_GRADE = 'saturate(0.78) contrast(0.96) brightness(1.03) hue-rotate(-6deg)';
const W = 1920;
const H = 1080;

const pulse = (t: number, t0: number, dur = 0.55) => {
  const u = (t - t0) / dur;
  return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0;
};

export const Interview: React.FC = () => {
  const frame = useCurrentFrame();
  const data = useData();
  const t = frame / INTERVIEW_FPS;
  const P = WORLD.noon;
  const tn = (c: string) => tint(c, P);
  let ci = 0;
  EDL.forEach((c, i) => {
    if (t >= c.at) ci = i;
  });
  const cut = EDL[ci];
  const next = EDL[ci + 1]?.at ?? INTERVIEW_FRAMES / INTERVIEW_FPS;
  const u = (t - cut.at) / Math.max(0.1, next - cut.at);

  // voices drive the heads a little (no lip sync): the chin dips with the loud syllables
  const env = (who: 'interviewer' | 'subject', off = 2) => data?.env[who][Math.max(0, frame - off)] ?? 0;
  const speaking = (who: 'interviewer' | 'subject') => env(who) * 3.2 + Math.sin(t * 2.1) * 0.8 * Math.min(1, env(who) * 3);
  const nodding = (who: 'interviewer' | 'subject') => NODS[who].reduce((a, t0) => a + pulse(t, t0) * 5, 0);
  const lookOut = cut.look ? interpolate(t - cut.at, [0.3, 1.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)}) : 0;
  const sPose: Pose = {nod: speaking('subject') + nodding('subject') + lookOut * 5, look: lookOut, breath: Math.sin(t * 1.55)};
  const iPose: Pose = {nod: speaking('interviewer') + nodding('interviewer') + (cut.look ? lookOut * 3 : 0), breath: Math.sin(t * 1.45 + 1)};

  // the documentary's handheld camera, and a slow push (or pull, at the end) on every shot
  const hh = {x: 7 * Math.sin(t * 1.3) + 4 * Math.sin(t * 3.1 + 1), y: 5 * Math.sin(t * 1.7 + 2) + 3 * Math.sin(t * 2.9), roll: 0.35 * Math.sin(t * 0.9 + 0.5)};
  const push = cut.out ? 1.07 - 0.07 * u : 1 + 0.035 * u;
  const cam = (cx: number, cy: number) => `translate(${W / 2} ${H / 2}) rotate(${hh.roll}) scale(${push}) translate(${-cx - hh.x} ${-cy - hh.y})`;
  const id = `iv${ci}`;
  const pan = hh.x * 2;

  const shot = (() => {
    switch (cut.setup) {
      case 'wide':
        return (
          <g transform={cam(W / 2, H / 2)}>
            <BgWide P={P} t={t} id={id} pan={pan} />
            <Director x={650} y={818} h={430} pose={iPose} tint={tn} />
            <Scientist x={1275} y={818} h={440} pose={sPose} tint={tn} />
          </g>
        );
      case 'otsS':
        return (
          <g transform={cam(W / 2, H / 2)}>
            <BgColony P={P} t={t} id={id} pan={pan} />
            <Scientist x={1180} y={1330} h={1250} pose={sPose} tint={tn} />
            <g style={{filter: 'blur(3px)'}}>
              <DirectorBack x={270} y={930} h={760} pose={iPose} tint={tn} />
            </g>
          </g>
        );
      case 'cuS':
      case 'mcuS': {
        const cu = cut.setup === 'cuS';
        return (
          <g transform={cam(W / 2, H / 2)}>
            <g transform={`translate(${W / 2} ${H / 2}) scale(${cu ? 1.18 : 1.08}) translate(${-W / 2} ${-H / 2})`}>
              <BgColony P={P} t={t} id={id} pan={pan} />
            </g>
            <Scientist x={cu ? 1090 : 1130} y={cu ? 1520 : 1160} h={cu ? 1550 : 1150} pose={sPose} tint={tn} />
          </g>
        );
      }
      case 'otsI':
        return (
          <g transform={cam(W / 2, H / 2)}>
            <BgLand P={P} t={t} id={id} pan={pan} />
            <Director x={760} y={1130} h={1024} pose={iPose} tint={tn} />
            <g style={{filter: 'blur(3px)'}}>
              <ScientistBack x={1650} y={900} h={780} pose={sPose} tint={tn} />
            </g>
          </g>
        );
      case 'cuI':
      case 'mcuI': {
        const cu = cut.setup === 'cuI';
        return (
          <g transform={cam(W / 2, H / 2)}>
            <g transform={`translate(${W / 2} ${H / 2}) scale(${cu ? 1.18 : 1.08}) translate(${-W / 2} ${-H / 2})`}>
              <BgLand P={P} t={t} id={id} pan={pan} />
            </g>
            <Director x={cu ? 860 : 820} y={cu ? 1620 : 1236} h={cu ? 1664 : 1216} pose={iPose} tint={tn} />
          </g>
        );
      }
      default:
        return null;
    }
  })();

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Html5Audio src={staticFile('audio/interview.mp3')} />
      <AbsoluteFill style={{filter: DOC_GRADE}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect x={-400} y={-400} width={W + 800} height={H + 800} fill={P.sky[2]} />
          {data ? shot : null}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 58%, rgba(0,0,0,0.32) 100%)'}} />
    </AbsoluteFill>
  );
};
