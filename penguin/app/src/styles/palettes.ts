/** The four candidate looks. Every color the scene uses comes from here. */
export type StyleId = 'ink' | 'flat' | 'painterly' | 'anime';

export const STYLE_NAMES: Record<StyleId, string> = {
  ink: 'Ink & wash',
  flat: 'Flat graphic',
  painterly: 'Cinematic painterly',
  anime: 'Anime cel',
};

export type Palette = {
  sky: string[];
  sun: string;
  halo: string;
  rangeFar: string;
  rangeMid: string;
  rock: string;
  rockShade: string;
  rockLine: string;
  snow: string;
  snowShade: string;
  ground: string;
  groundShade: string;
  sastrugi: string;
  castShadow: string;
  white: string;
  mass: string;
  lines: string;
  navy: string;
  bodyShade: string;
  rim: string;
  flake: string;
};

/** Sheet colors (sampled from the model sheet's palette swatches). */
export const SHEET = {paper: '#F7F7F0', ink: '#1F201B', navy: '#1E3D55', line2: '#7D7D7C'};

export const PALETTES: Record<StyleId, Palette> = {
  ink: {
    sky: ['#9CB3C7', '#C9D5DD', '#E9E2D6', '#F2DBC0'],
    sun: SHEET.paper,
    halo: '#F2C27E',
    rangeFar: '#CBD4DC',
    rangeMid: '#B5C1CC',
    rock: '#8E959D',
    rockShade: '#6C7785',
    rockLine: '#34373B',
    snow: SHEET.paper,
    snowShade: '#B8C6D3',
    ground: SHEET.paper,
    groundShade: '#AFBFCE',
    sastrugi: '#8A9197',
    castShadow: '#A3B4C6',
    white: SHEET.paper,
    mass: SHEET.ink,
    lines: SHEET.ink,
    navy: SHEET.navy,
    bodyShade: '#A2B1C4',
    rim: '#F0C284',
    flake: '#FFFFFF',
  },
  flat: {
    sky: ['#5E82C4', '#90A7D8', '#E6B8AE', '#F8D6A6'],
    sun: '#FFF7E4',
    halo: '#FFE3B8',
    rangeFar: '#C8AEC8',
    rangeMid: '#B19BBF',
    rock: '#4B5174',
    rockShade: '#3B405E',
    rockLine: '#4B5174',
    snow: '#F6F2F2',
    snowShade: '#C3C3DF',
    ground: '#F4EFE9',
    groundShade: '#C6C6DE',
    sastrugi: '#DAD5E5',
    castShadow: '#C6C6DE',
    white: '#F9F5EE',
    mass: '#1D2133',
    lines: '#262B40',
    navy: '#253F69',
    bodyShade: '#C8CADF',
    rim: '#FFCB93',
    flake: '#FFFFFF',
  },
  painterly: {
    sky: ['#4D6C9C', '#8BA3C6', '#E1C1A6', '#F5D5A3'],
    sun: '#FFF6E2',
    halo: '#FFE0A8',
    rangeFar: '#B7B2C3',
    rangeMid: '#A3A2B9',
    rock: '#5A5F72',
    rockShade: '#3C4253',
    rockLine: '#2C3140',
    snow: '#F3EEE8',
    snowShade: '#97A6C3',
    ground: '#F3E9DB',
    groundShade: '#A5B2CC',
    sastrugi: '#C4CADB',
    castShadow: '#7D8DAE',
    white: '#F2EEE6',
    mass: '#15171C',
    lines: '#1A1C22',
    navy: '#20405C',
    bodyShade: '#8190AD',
    rim: '#FFD39C',
    flake: '#FFFFFF',
  },
  anime: {
    sky: ['#2A63CB', '#4E94E6', '#A7D7F5', '#FFE6C3'],
    sun: '#FFFFFF',
    halo: '#FFF1CF',
    rangeFar: '#A4C1E6',
    rangeMid: '#8CAFDD',
    rock: '#55608A',
    rockShade: '#3A4267',
    rockLine: '#262A40',
    snow: '#FBFDFF',
    snowShade: '#B3C6EE',
    ground: '#F8FBFF',
    groundShade: '#BACEF2',
    sastrugi: '#CFDDF6',
    castShadow: '#AFC4EE',
    white: '#FFFFFF',
    mass: '#1A1C28',
    lines: '#1A1C28',
    navy: '#1F3A6A',
    bodyShade: '#BFC9E8',
    rim: '#FFE2B0',
    flake: '#FFFFFF',
  },
};
