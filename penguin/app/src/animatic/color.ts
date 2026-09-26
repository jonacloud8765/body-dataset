/** Small color helpers and the time-of-day presets used by the animatic's blocking. */

const hex = (c: string) => {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const mix = (a: string, b: string, t: number) => {
  const x = hex(a);
  const y = hex(b);
  const k = Math.max(0, Math.min(1, t));
  const c = x.map((v, i) => Math.round(v + (y[i] - v) * k));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};

export type Tod =
  | 'paper' | 'predawn' | 'firstlight' | 'overcast' | 'whiteout' | 'noon' | 'dusk' | 'night'
  | 'blizzard' | 'moon' | 'dawn' | 'sunrise' | 'creator' | 'morning';

export type Sky = {top: string; low: string; ground: string; far: string};

/** Washes over paper (§9.1-9.2). `far` is the haze color distant things fade toward. */
export const SKY: Record<Tod, Sky> = {
  paper: {top: '#F7F7F0', low: '#F7F7F0', ground: '#F7F7F0', far: '#F7F7F0'},
  predawn: {top: '#9FB0C2', low: '#DCE3E8', ground: '#E6EBEE', far: '#C9D3DC'},
  firstlight: {top: '#AEBDCB', low: '#EEF0EC', ground: '#ECEFEE', far: '#D5DDE3'},
  overcast: {top: '#C6CFD8', low: '#E8ECEE', ground: '#EFF1EF', far: '#DCE2E6'},
  whiteout: {top: '#F2F3EF', low: '#F4F4F0', ground: '#F5F5F1', far: '#F3F4F0'},
  noon: {top: '#86BDE0', low: '#DCEFF8', ground: '#F7F7F0', far: '#C4DDEB'},
  dusk: {top: '#9C8CC2', low: '#E8B4BC', ground: '#E6DDE6', far: '#CDB5CD'},
  night: {top: '#0B1622', low: '#1C3C54', ground: '#2A4256', far: '#1F3A50'},
  blizzard: {top: '#34424F', low: '#55636F', ground: '#6A7883', far: '#56646F'},
  moon: {top: '#101F31', low: '#2E4A66', ground: '#A7B8CB', far: '#4A6480'},
  dawn: {top: '#C7A9C9', low: '#F4C9BE', ground: '#F3E4DF', far: '#E6C3C3'},
  sunrise: {top: '#F2B3A5', low: '#F9D98E', ground: '#F1DFD2', far: '#EFC9B0'},
  creator: {top: '#F6C27A', low: '#FFE3AE', ground: '#F8EBD6', far: '#F5D6A2'},
  morning: {top: '#D3E1EC', low: '#F4F5F1', ground: '#F7F7F0', far: '#E4EAEE'},
};

export const mixSky = (a: Sky, b: Sky, t: number): Sky => ({
  top: mix(a.top, b.top, t),
  low: mix(a.low, b.low, t),
  ground: mix(a.ground, b.ground, t),
  far: mix(a.far, b.far, t),
});
