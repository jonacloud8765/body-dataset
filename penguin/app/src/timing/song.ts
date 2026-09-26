import songMap from '../../../analysis/song-map.json';

/** The measured song (penguin/analysis/song-map.json) and musical-time math. */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export type Pos = {pos?: string; t: number; frame: number};
export type Line = {id: string; section: string; text: string; start: Pos; end: Pos; confidence: string};
export type Section = {id: string; name: string; bars: number[]; start: Pos; end: Pos};
export type BarInfo = {bar: number; t: number; frame: number; intensity?: number; drums?: boolean};
export type SongEvent = {id: string; pos: string; t: number; frame: number; what: string};

const map = songMap as unknown as {
  source: {duration_s: number};
  grid: {bpm: number; beat_s: number; bar_s: number; meter: number; first_bar_s: number};
  bar_starts: BarInfo[];
  sections: Section[];
  lines: Line[];
  events: SongEvent[];
};

export const GRID = map.grid;
export const SONG_END_S = map.source.duration_s;
export const SONG_END_FRAME = Math.round(SONG_END_S * FPS);
export const LINES = map.lines;
export const SECTIONS = map.sections;
export const BARS = map.bar_starts;
export const EVENTS = map.events;

/** 'bar.beat' ('20.4.5' = bar 20, beat 4.5) or '<seconds>s' -> seconds. */
export const posToSeconds = (pos: string): number => {
  if (pos.endsWith('s')) {
    return parseFloat(pos);
  }
  const [bar, ...rest] = pos.split('.');
  const beat = rest.length ? parseFloat(rest.join('.')) : 1;
  return GRID.first_bar_s + ((parseInt(bar, 10) - 1) * GRID.meter + (beat - 1)) * GRID.beat_s;
};

export const secondsToFrame = (t: number) => Math.round(t * FPS);
export const frameToSeconds = (f: number) => f / FPS;
export const posToFrame = (pos: string) => secondsToFrame(posToSeconds(pos));

/** Continuous beat count from bar 1 beat 1 (negative before it). */
export const beatsAt = (t: number) => (t - GRID.first_bar_s) / GRID.beat_s;

/** Frame of global beat k (k = 0 is bar 1, beat 1). Always computed from seconds: no drift. */
export const beatFrame = (k: number) => secondsToFrame(GRID.first_bar_s + k * GRID.beat_s);

export const barBeatAt = (t: number) => {
  const b = beatsAt(t);
  const k = Math.floor(b);
  const m = GRID.meter;
  return {bar: Math.floor(k / m) + 1, beat: (((k % m) + m) % m) + 1, phase: b - k, index: k};
};

/** Frames since the most recent beat at global frame f (the beat frame itself is 0). */
export const framesSinceBeat = (f: number) => {
  const {index} = barBeatAt((f + 0.5) / FPS);
  return f - beatFrame(index);
};

export const linesAt = (t: number) => LINES.filter((l) => t >= l.start.t && t < l.end.t);
export const nextLineAfter = (t: number) => LINES.find((l) => l.start.t > t);

export const sectionAt = (t: number): Section | undefined => {
  if (t < SECTIONS[0].start.t) {
    return SECTIONS[0];
  }
  return SECTIONS.find((s) => t >= s.start.t && t < s.end.t);
};

export const intensityAt = (t: number) => {
  const {bar} = barBeatAt(t);
  return BARS[Math.max(0, Math.min(BARS.length - 1, bar - 1))]?.intensity ?? 0;
};
