/**
 * Anime palettes by time of day: the film's color arc (§9) in the chosen style. Sky stops go
 * top -> horizon. `sun` is the disc, `glow` its halo. Ground colors are the lit snow and the snow in
 * shadow; `rock`/`rockShade`/`rockLit` paint the mountain; `rim` is the rim light on dark shapes.
 */
export type Tod =
  | 'predawn' | 'firstlight' | 'overcast' | 'whiteout' | 'noon' | 'dusk' | 'night' | 'blizzard'
  | 'moon' | 'dawn' | 'sunrise' | 'creator' | 'morning';

export type WorldPalette = {
  sky: [string, string, string, string];
  sun: string;
  glow: string;
  cloud: string;
  cloudShade: string;
  range: [string, string];
  rock: string;
  rockShade: string;
  rockLit: string;
  line: string;
  snow: string;
  snowShade: string;
  sastrugi: string;
  sparkle: string;
  /** the character's cel shadow and rim for this light */
  bodyShade: string;
  bodyRim: string;
  /** 0-1 haze toward the horizon color */
  haze: number;
  stars: number;
};

export const WORLD: Record<Tod, WorldPalette> = {
  predawn: {
    sky: ['#2B3E63', '#4F6C99', '#9FB6D6', '#D9E2EE'], sun: '#FFFFFF', glow: '#C9D8F0', cloud: '#8EA3C6', cloudShade: '#6C82A8',
    range: ['#8B9EC0', '#7A8FB4'], rock: '#56648A', rockShade: '#3F4A6B', rockLit: '#7A89AE', line: '#232842',
    snow: '#DDE6F2', snowShade: '#A9BAD6', sastrugi: '#C4D2E8', sparkle: '#FFFFFF', bodyShade: '#AEBCDA', bodyRim: '#6C86C2', haze: 0.55, stars: 0.35,
  },
  firstlight: {
    sky: ['#4A6FA8', '#7FA0CF', '#C7D4E6', '#F4E3D4'], sun: '#FFF8EA', glow: '#FFE7C8', cloud: '#E9EEF6', cloudShade: '#B9C6DC',
    range: ['#A9B8D2', '#98AAC9'], rock: '#5B6690', rockShade: '#404A6E', rockLit: '#8793B8', line: '#232842',
    snow: '#EEF3FA', snowShade: '#B7C6E2', sastrugi: '#D2DDEF', sparkle: '#FFFFFF', bodyShade: '#B9C6E2', bodyRim: '#7C95CF', haze: 0.5, stars: 0,
  },
  overcast: {
    sky: ['#7F8FA8', '#A2B0C4', '#C7D0DC', '#E3E8EE'], sun: '#F4F6F8', glow: '#E8ECF1', cloud: '#C5CEDB', cloudShade: '#A3AFC2',
    range: ['#B4BECD', '#A6B1C3'], rock: '#5E6780', rockShade: '#48506A', rockLit: '#77809A', line: '#262A3A',
    snow: '#F1F3F6', snowShade: '#C6CEDB', sastrugi: '#DCE1E9', sparkle: '#FFFFFF', bodyShade: '#C4CCDA', bodyRim: '#8391AE', haze: 0.45, stars: 0,
  },
  whiteout: {
    sky: ['#DDE2E8', '#E9ECF0', '#F1F3F5', '#F6F7F8'], sun: '#FFFFFF', glow: '#FFFFFF', cloud: '#F1F3F6', cloudShade: '#E2E6EC',
    range: ['#EEF1F4', '#E8ECF0'], rock: '#C9CFD8', rockShade: '#BCC3CE', rockLit: '#D6DBE2', line: '#9098A6',
    snow: '#F7F8FA', snowShade: '#E6EAEF', sastrugi: '#ECEFF3', sparkle: '#FFFFFF', bodyShade: '#D9DEE6', bodyRim: '#A9B3C4', haze: 0.85, stars: 0,
  },
  noon: {
    sky: ['#2A63CB', '#4E94E6', '#A7D7F5', '#E8F4FB'], sun: '#FFFFFF', glow: '#FFF6DE', cloud: '#FFFFFF', cloudShade: '#BCD0F1',
    range: ['#A4C1E6', '#8CAFDD'], rock: '#55608A', rockShade: '#3A4267', rockLit: '#8C9ACB', line: '#262A40',
    snow: '#F8FBFF', snowShade: '#BACEF2', sastrugi: '#CFDDF6', sparkle: '#FFFFFF', bodyShade: '#BFC9E8', bodyRim: '#5E7BBE', haze: 0.3, stars: 0,
  },
  dusk: {
    sky: ['#3B3F8A', '#7B63A8', '#E28FA0', '#FFC49A'], sun: '#FFE9C4', glow: '#FFB98A', cloud: '#F4A9A8', cloudShade: '#9A74A8',
    range: ['#A77FA6', '#8F6E9E'], rock: '#4B4775', rockShade: '#33305A', rockLit: '#C07F98', line: '#221F3A',
    snow: '#F3DCE4', snowShade: '#A99BC8', sastrugi: '#D9C5DC', sparkle: '#FFF1E0', bodyShade: '#B3A6D0', bodyRim: '#F09A84', haze: 0.35, stars: 0.1,
  },
  night: {
    sky: ['#070D1F', '#0F1D3D', '#1D3462', '#2E4B7A'], sun: '#F4F7FF', glow: '#9DB6E8', cloud: '#22365E', cloudShade: '#15254A',
    range: ['#23375E', '#1B2E52'], rock: '#1E2A48', rockShade: '#131C35', rockLit: '#3E5486', line: '#070B18',
    snow: '#6D82AE', snowShade: '#42567F', sastrugi: '#586D99', sparkle: '#C9D8FF', bodyShade: '#7A8CB8', bodyRim: '#8FB0F0', haze: 0.35, stars: 1,
  },
  blizzard: {
    sky: ['#3A4757', '#556373', '#6F7C8B', '#86929F'], sun: '#C9D1DA', glow: '#AEB8C4', cloud: '#6A7686', cloudShade: '#4E5A69',
    range: ['#6F7B89', '#65717F'], rock: '#46505F', rockShade: '#36404E', rockLit: '#5C6778', line: '#1D232C',
    snow: '#9AA6B4', snowShade: '#76828F', sastrugi: '#8894A1', sparkle: '#DDE4EC', bodyShade: '#8A96A6', bodyRim: '#AFC0D6', haze: 0.7, stars: 0,
  },
  moon: {
    sky: ['#081330', '#132A57', '#2A4C84', '#4C73A8'], sun: '#F6F8FF', glow: '#BFD3F5', cloud: '#2C4A7C', cloudShade: '#1C355E',
    range: ['#2E4C7E', '#253F6C'], rock: '#243759', rockShade: '#16243F', rockLit: '#5A7DB8', line: '#060B1A',
    snow: '#A9C0E6', snowShade: '#6886BA', sastrugi: '#8EA8D6', sparkle: '#FFFFFF', bodyShade: '#8AA2CF', bodyRim: '#9EC4FF', haze: 0.25, stars: 0.9,
  },
  dawn: {
    sky: ['#3C4F8F', '#8A86C0', '#F0B3BD', '#FFD8B4'], sun: '#FFF4E4', glow: '#FFCFAE', cloud: '#F7C3C4', cloudShade: '#A894C0',
    range: ['#B39CC4', '#A08DBA'], rock: '#4E5480', rockShade: '#363B63', rockLit: '#E09AA7', line: '#20223A',
    snow: '#F6E4EA', snowShade: '#B4ACD4', sastrugi: '#E0D2E4', sparkle: '#FFFFFF', bodyShade: '#BDB2D8', bodyRim: '#F7A58F', haze: 0.35, stars: 0,
  },
  sunrise: {
    sky: ['#E47F74', '#F6A77E', '#FFD28C', '#FFF0C4'], sun: '#FFFDF2', glow: '#FFE9A8', cloud: '#FFD2A6', cloudShade: '#E39A8C',
    range: ['#E3A694', '#D69288'], rock: '#4A3E5E', rockShade: '#322A45', rockLit: '#FFB27A', line: '#221A2E',
    snow: '#FFEBDC', snowShade: '#CFA7B8', sastrugi: '#F4D2C8', sparkle: '#FFFFFF', bodyShade: '#D8B3C0', bodyRim: '#FFB070', haze: 0.3, stars: 0,
  },
  creator: {
    sky: ['#F59B45', '#FFBE5C', '#FFDD8A', '#FFF3C6'], sun: '#FFFFFF', glow: '#FFE39A', cloud: '#FFE7B3', cloudShade: '#F0B070',
    range: ['#F2C38C', '#E8B07A'], rock: '#5A4A45', rockShade: '#3D3131', rockLit: '#FFC45C', line: '#2A1E1A',
    snow: '#FFF4DE', snowShade: '#E9BE8E', sastrugi: '#FBE0B8', sparkle: '#FFFFFF', bodyShade: '#EDC79E', bodyRim: '#FFB547', haze: 0.25, stars: 0,
  },
  morning: {
    sky: ['#4D89D6', '#86B8EC', '#CDE6F7', '#F2F8FC'], sun: '#FFFFFF', glow: '#FFF8E6', cloud: '#FFFFFF', cloudShade: '#C9DAF2',
    range: ['#B7CDEA', '#A4BFE3'], rock: '#5C6890', rockShade: '#434C72', rockLit: '#95A4D0', line: '#262A40',
    snow: '#F9FBFE', snowShade: '#C4D5F0', sastrugi: '#DCE6F6', sparkle: '#FFFFFF', bodyShade: '#C4CEEA', bodyRim: '#6E8BC9', haze: 0.3, stars: 0,
  },
};

const hex = (c: string) => {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const mixHex = (a: string, b: string, t: number) => {
  const x = hex(a);
  const y = hex(b);
  const k = Math.max(0, Math.min(1, t));
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
};

/** Blend two palettes (time passing inside a shot). */
export const mixWorld = (a: WorldPalette, b: WorldPalette, t: number): WorldPalette => {
  const out = {} as Record<string, unknown>;
  for (const k of Object.keys(a) as (keyof WorldPalette)[]) {
    const va = a[k];
    const vb = b[k];
    if (typeof va === 'number') out[k] = va + ((vb as number) - va) * t;
    else if (Array.isArray(va)) out[k] = va.map((c, i) => mixHex(c, (vb as string[])[i], t));
    else out[k] = mixHex(va as string, vb as string, t);
  }
  return out as unknown as WorldPalette;
};
