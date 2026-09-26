/**
 * Generates public/audio/soundtrack.wav deterministically from the score:
 * - heartbeat "lub-dub" placed exactly on the beats that drive the visuals (beatsAt)
 * - a filtered ambience bed whose level and brightness follow the condition
 *   (muffled in Red = auditory exclusion; overlapping in Black; near-silence at the freeze)
 * Run: npm run audio
 */
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {beatsAt, bpmAt, levelAt, S} from '../src/score';
import {FPS, TOTAL_FRAMES} from '../src/timeline';

const SR = 44100;
const DUR = TOTAL_FRAMES / FPS;
const N = Math.ceil(DUR * SR);
const out = new Float32Array(N);

/** Deterministic PRNG (mulberry32). */
const prng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Heartbeat loudness over the film (quiet in the world, forward in Act III). */
const heartGain = (T: number) => {
  let g = 0.28;
  if (T < S('S01') + 1) g = 0.5;
  if (T >= S('S03') + 6 && T < S('S11')) g = 0.42;
  if (T >= S('S11') && T < S('S16')) g = 0.18;
  if (T >= S('S16')) g = 0.3 + 0.12 * levelAt(T);
  if (T >= S('S20')) g = 0.75;
  if (T >= S('S21') + 12.2 && T < S('S22')) g = 0.9;
  if (T >= S('S23')) g = 0.3;
  return g;
};

// 1) Heartbeat: detect beat onsets at 1 ms resolution.
let prev = Math.floor(beatsAt(0));
for (let ms = 1; ms < DUR * 1000; ms++) {
  const T = ms / 1000;
  const b = Math.floor(beatsAt(T));
  if (b === prev) continue;
  prev = b;
  const period = 60 / bpmAt(T);
  const gain = heartGain(T);
  const hits: [number, number, number][] = [
    [T, 1, 58],
    [T + 0.28 * period, 0.55, 66],
  ];
  for (const [t0, amp, f0] of hits) {
    const start = Math.floor(t0 * SR);
    const len = Math.floor(0.16 * SR);
    let phase = 0;
    for (let i = 0; i < len && start + i < N; i++) {
      const t = i / SR;
      const f = f0 * (1 + 0.9 * Math.exp(-t * 40));
      phase += (2 * Math.PI * f) / SR;
      const env = (1 - Math.exp(-t * 900)) * Math.exp(-t * 26);
      out[start + i] += gain * amp * env * Math.sin(phase);
    }
  }
}

// 2) Ambience bed: brown-ish noise through a one-pole low-pass whose cutoff follows the condition.
const rnd = prng(42);
let brown = 0;
let lp = 0;
for (let i = 0; i < N; i++) {
  const T = i / SR;
  const lvl = levelAt(T);
  brown = (brown + (rnd() * 2 - 1) * 0.02) * 0.998;
  let cutoff = 1800;
  let gain = 0.55;
  if (T < S('S01') + 5) gain = 0.55 * smooth(S('S01') + 5.5, S('S01') + 8.5, T);
  if (T >= S('S04') + 0.6 && T < S('S05')) gain = 0.25;
  if (T >= S('S16')) {
    cutoff = 1800 - 380 * Math.max(0, lvl - 1);
    gain = 0.55 - 0.1 * Math.max(0, lvl - 1);
  }
  if (T >= S('S20') + 1 && T < S('S21')) {
    cutoff = 380;
    gain = 0.2;
  }
  if (T >= S('S21') && T < S('S21') + 12.2) {
    cutoff = 2600;
    gain = 0.75 + 0.25 * Math.sin(T * 7.1) * Math.sin(T * 3.3);
  }
  if (T >= S('S21') + 12.2 && T < S('S22')) gain = 0.04;
  if (T >= S('S22') && T < S('S24')) gain = 0.12;
  if (T >= S('S24') + 14.5) gain *= 1 - smooth(S('S24') + 14.5, S('S24') + 15.9, T);
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
  lp += a * (brown - lp);
  out[i] += gain * lp * 0.9;
}

// 3) Normalize to -1 dBFS peak and write 16-bit PCM mono WAV.
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[i]));
const norm = peak > 0 ? 0.89 / peak : 1;
const buf = Buffer.alloc(44 + N * 2);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + N * 2, 4);
buf.write('WAVE', 8);
buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(1, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 2, 28);
buf.writeUInt16LE(2, 32);
buf.writeUInt16LE(16, 34);
buf.write('data', 36);
buf.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, out[i] * norm)) * 32767), 44 + i * 2);

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, '..', 'public', 'audio', 'soundtrack.wav');
mkdirSync(dirname(file), {recursive: true});
writeFileSync(file, buf);
console.log(`Wrote ${file} (${DUR.toFixed(1)} s, peak normalized from ${peak.toFixed(3)})`);
