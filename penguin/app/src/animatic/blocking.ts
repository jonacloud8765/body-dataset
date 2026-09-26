import {CREATOR_GOLD, PAPER, WASH_ICE} from '../theme/palette';
import type {El, Spec} from './types';

/**
 * Per-shot blocking for the animatic (docs/penguin/shotlist.md is the source).
 * Coordinates are 1920x1080 frame pixels. Figures stand with their feet at (x, y).
 * CINEMA shots are letterboxed to 2.39:1, so only y 138-942 is seen.
 */

/** Refrain horizon: 58% of the letterboxed frame (§7.2). */
const HZ = 604;
/** The same 58% line in the full 16:9 documentary frame. */
const DOC_HZ = 626;
/** Refrain thirds: him on the left line, the mountain on the right. */
const LEFT = 640;
const RIGHT = 1280;
/** Him in an extreme wide: under 3% of frame height (§6). */
const TINY = 24;

const ROCK = '#5B5F66';
const TRAMPLED = '#C8CFD5';
const SEA = '#4B6275';

/** The creator's head seen from the beak (S52-S55): a dark hatched dome. */
const dome = (top: number): El => ({
  k: 'poly',
  pts: [[-200, 1200], [-200, top + 360], [200, top + 150], [600, top + 40], [960, top], [1320, top + 40], [1720, top + 150], [2120, top + 360], [2120, 1200]],
  fill: ROCK,
  hatch: true,
});

/** His head in profile for the two profile matches (S20, S40): beak tip lands at (1168, 589). */
const profile: El = {k: 'penguin', keys: [{at: 0, x: 760, y: 2250, h: 1900, view: 'side', facing: 1}]};

const crewTrio = (x: number, y: number, h: number, look: 'ahead' | 'up' = 'up'): El[] => [
  {k: 'crew', x, y, h, role: 'director', look},
  {k: 'crew', x: x + h * 0.7, y: y + 2, h, role: 'camera', look},
  {k: 'crew', x: x + h * 1.4, y, h, role: 'sound', look},
];

export const SPECS: Record<string, Spec> = {
  // ─── Intro ───────────────────────────────────────────────────────────────
  S01: {sky: 'paper', els: [{k: 'map'}], cam: [{at: 0, zoom: 1}, {at: 1, zoom: 1.04, x: 60, y: -10}]},

  S02: {
    sky: 'predawn',
    els: [
      {k: 'ground', y: 380, color: TRAMPLED},
      {k: 'rect', x: -200, y: 250, w: 2400, h: 130, fill: SEA},
      {k: 'colony', x: 960, y: 610, w: 2300, ph: 60, rows: 6, cols: 40},
      {k: 'colony', x: 960, y: 1110, w: 2200, ph: 100, rows: 15, cols: 26, hero: [9, 13]},
    ],
    focus: {x: 640, y: 560, w: 380, h: 300},
  },

  S03: {
    sky: 'predawn',
    els: [
      {k: 'ground', y: 250, color: TRAMPLED},
      {k: 'rect', x: -200, y: 130, w: 2400, h: 120, fill: SEA},
      {k: 'colony', x: 960, y: 700, w: 2400, ph: 150, rows: 5, cols: 16, seed: 3},
      {k: 'colony', x: 960, y: 1150, w: 1500, ph: 240, rows: 5, cols: 9, hero: [2, 4], waveAt: '4.1'},
    ],
    cam: [
      {at: 0, zoom: 1, x: -120, y: 60},
      {at: '4.1', zoom: 1, x: 0, y: 60},
      {at: '4.1+5f', zoom: 1.7, x: 0, y: 350},
      {at: '4.1+11f', zoom: 1.6, x: 0, y: 344},
    ],
    focus: {x: 800, y: 300, w: 330, h: 470},
    lowerThirdAt: '4.3',
  },

  S04: {
    sky: 'predawn',
    els: [
      {k: 'ground', y: HZ},
      {k: 'mountain', x: 1500, y: HZ, h: 13, haze: 0.7},
      {k: 'poly', pts: [[-100, 1100], [-100, 770], [400, 780], [800, 750], [1200, 790], [1700, 760], [2100, 780], [2100, 1100]], fill: TRAMPLED, stroke: 'none', hatch: true},
      {k: 'penguin', keys: [{at: 0, x: 300, y: 1650, h: 1350, view: 'back34'}]},
    ],
    cam: [{at: 0, zoom: 1}, {at: 1, zoom: 1.12, x: 110}],
  },

  S05: {
    sky: 'predawn',
    els: [
      {k: 'ground', y: 480},
      {k: 'poly', pts: [[-100, 480], [2100, 480], [2100, 850], [1500, 866], [1000, 846], [500, 870], [-100, 856]], fill: TRAMPLED, stroke: 'none', hatch: true},
      {k: 'feet', x: 890, y: 760, size: 380},
    ],
  },

  S06: {
    sky: {from: 'predawn', to: 'firstlight', at: 0, over: 1},
    els: [
      {k: 'ground', y: HZ},
      {k: 'poly', pts: [[-100, HZ + 6], [LEFT + 10, HZ + 30], [LEFT - 30, 720], [-100, 800]], fill: TRAMPLED, stroke: 'none'},
      {k: 'colony', x: 230, y: HZ + 40, w: 420, ph: 28, rows: 3, cols: 16},
      {k: 'mountain', x: RIGHT, y: HZ, h: 12, haze: 0.7},
      {k: 'penguin', keys: [{at: 0, x: LEFT, y: HZ + 40, h: TINY, view: 'side', pose: 'stand'}, {at: '8.4', pose: 'walk'}], walk: 'every'},
      {k: 'streaks', at: '7.3', frames: 44},
    ],
  },

  S07: {
    sky: 'firstlight',
    els: [
      {k: 'ground', y: 480},
      {k: 'feet', x: 890, y: 760, size: 380, stepAt: '9.1'},
    ],
    cam: [{at: '9.1', y: 0}, {at: '9.1+1f', y: 16}, {at: '9.1+3f', y: 0}],
  },

  // ─── Verse ───────────────────────────────────────────────────────────────
  S08: {
    sky: 'overcast',
    els: [
      {k: 'ground', y: 700, marks: 'sastrugi', scroll: 40},
      {k: 'penguin', keys: [{at: 0, x: 240, y: 900, h: 560, view: 'side', pose: 'walk'}, {at: 1, x: 820}], walk: 'every'},
    ],
  },

  S09: {
    sky: 'whiteout',
    els: [
      {k: 'ground', y: HZ, line: false},
      {k: 'footprints', x1: -20, y1: HZ + 40, x2: 606, y2: HZ + 40, n: 44, size: 2.6},
      {k: 'penguin', keys: [{at: 0, x: 612, y: HZ + 40, h: TINY, view: 'side', pose: 'walk'}, {at: 1, x: LEFT}], walk: 'every'},
    ],
  },

  S10: {
    sky: 'overcast',
    els: [
      {k: 'ground', y: HZ},
      {k: 'colony', x: 1380, y: HZ + 4, w: 300, ph: 20, rows: 3, cols: 12},
      {
        k: 'penguin',
        keys: [
          {at: 0, x: 820, y: 1480, h: 1000, view: 'front34', pose: 'walk'},
          {at: '11.2', view: 'back34', pose: 'stand'},
          {at: '11.4', view: 'front34'},
        ],
        walk: 'every',
      },
    ],
    cam: [{at: '11.4+6f', x: 0}, {at: 1, x: 1500}],
  },

  S11: {
    sky: 'overcast',
    els: [
      {k: 'ground', y: HZ},
      {k: 'mountain', x: 1320, y: HZ, h: 22, haze: 0.55},
      {k: 'penguin', keys: [{at: 0, x: 930, y: HZ + 14, h: 16, view: 'back', pose: 'walk'}, {at: 1, x: 950, y: HZ + 10, h: 13}], walk: 'every'},
      {k: 'colony', x: 960, y: 1300, w: 2400, ph: 1000, rows: 1, cols: 3, blur: 7, turns: [{at: '12.2', until: '12.4', col: 0}, {at: '12.3', until: '12.4.5', col: 2}]},
    ],
  },

  S12: {
    sky: 'overcast',
    els: [
      {k: 'ground', y: 740},
      {
        k: 'penguin',
        keys: [
          {at: 0, x: 900, y: 820, h: 520, view: 'side', pose: 'fallen'},
          {at: '13.3', pose: 'stand'},
          {at: '13.4', pose: 'shake'},
          {at: '13.4.8', pose: 'stand'},
        ],
      },
      {k: 'streaks', at: 0, frames: 12},
    ],
  },

  S13: {
    sky: 'overcast',
    els: [
      {k: 'ground', y: 160},
      {k: 'poly', pts: [[640, 1100], [900, 1100], [800, 820], [560, 620], [240, 470], [-100, 420], [-100, 520], [180, 580], [460, 720], [640, 880]], fill: TRAMPLED, stroke: 'none', hatch: true},
      {k: 'ellipse', x: 800, y: 870, rx: 150, ry: 46, fill: WASH_ICE, opacity: 0.85},
      {k: 'trail', x1: 850, y1: 872, x2: 1580, y2: 560, from: '14.2', to: 1, width: 10},
      {
        k: 'penguin',
        keys: [
          {at: 0, x: 700, y: 900, h: 170, view: 'side', pose: 'walk'},
          {at: '14.1', x: 800, y: 876, pose: 'toboggan'},
          {at: '14.2', x: 850, y: 872},
          {at: 1, x: 1580, y: 560},
        ],
        walk: 'every',
      },
    ],
    cam: [{at: 0, x: 0, y: 0}, {at: 1, x: 320, y: -90}],
  },

  S14: {
    sky: 'overcast',
    els: [
      {k: 'ground', y: 760},
      {k: 'penguin', keys: [{at: 0, x: 700, y: 1990, h: 1800, view: 'side'}]},
    ],
    cam: [{at: 0, zoom: 1}, {at: 1, zoom: 1.08, x: 40}],
  },

  S15: {
    sky: 'overcast',
    els: [
      {k: 'ground', y: HZ},
      {k: 'mountain', x: 1000, y: HZ, h: 64, haze: 0.25, plumes: ['15.3']},
    ],
    cam: [{at: 0, zoom: 1}, {at: 1, zoom: 1.05, y: -10}],
  },

  S16: {
    sky: 'timelapse',
    els: [
      {k: 'ground', y: DOC_HZ},
      {k: 'mountain', x: 1520, y: DOC_HZ, h: 40, haze: 0.45},
      {
        k: 'penguin',
        keys: [
          {at: 0, x: 260, y: DOC_HZ + 30, h: 18, view: 'side', pose: 'walk'},
          {at: 0.3, x: 330},
          {at: 0.32, x: 600},
          {at: 0.63, x: 670},
          {at: 0.65, x: 940},
          {at: 0.98, x: 1010},
        ],
        walk: 'every',
      },
    ],
    focus: {x: 760, y: 380, w: 400, h: 320},
  },

  // ─── Chorus 1 ────────────────────────────────────────────────────────────
  S17: {
    sky: {from: 'overcast', to: 'noon', at: '17.1', over: '17.1+6f'},
    els: [
      {k: 'ground', y: 900},
      {k: 'glow', x: 1900, y: 180, r: 700, color: '#FFF1C9', from: '17.1', to: '17.1+6f'},
      {k: 'penguin', keys: [{at: 0, x: 900, y: 2000, h: 1800, view: 'front34'}]},
    ],
    cam: [{at: 0, y: 0}, {at: 1, y: -24}],
  },

  S18: {
    sky: 'noon',
    els: [
      {k: 'ground', y: 700, marks: 'sastrugi', scroll: 60},
      {k: 'mountain', x: 2500, y: 700, h: 110, haze: 0.4, move: {x: -1250, at: [0, 0.9]}},
      {k: 'penguin', keys: [{at: 0, x: 960, y: 1500, h: 1100, view: 'front34', facing: 1}, {at: 0.55, view: 'back34'}]},
    ],
  },

  S19: {
    sky: 'noon',
    els: [
      {k: 'ground', y: 640, marks: 'sastrugi', scroll: 90},
      {k: 'mountain', x: 1520, y: 640, h: 90, haze: 0.4},
      {k: 'penguin', keys: [{at: 0, x: 760, y: 860, h: 420, view: 'side', pose: 'walk'}], walk: 'every'},
    ],
  },

  // A mirror match: his beak points right, the mountain's spur points left (they meet beak to beak).
  S20: {
    phases: [
      {from: 0, sky: 'noon', els: [{k: 'ground', y: 1000}, profile]},
      {from: '19.2', sky: 'noon', els: [{k: 'ground', y: 871}, {k: 'mountain', x: 1605, y: 871, h: 475, haze: 0.3}]},
    ],
    dissolveFrames: 24,
  },

  S21: {
    sky: 'noon',
    els: [
      {k: 'ground', y: 640},
      {k: 'mountain', x: 1200, y: 640, h: 96, haze: 0.3, plumes: ['20.1']},
      {k: 'glint', x: 1152, y: 612, at: '20.3', frames: 10, r: 34},
    ],
    cam: [{at: 0, zoom: 1}, {at: 1, zoom: 1.1, x: 80, y: 20}],
  },

  S22: {
    sky: 'noon',
    els: [
      {k: 'ground', y: 300},
      {k: 'mountain', x: 1820, y: 300, h: 40, haze: 0.65},
      {k: 'crew', x: 1660, y: 760, h: 560, role: 'sound', facing: -1},
      {
        k: 'penguin',
        keys: [
          {at: 0, x: 1000, y: 880, h: 420, view: 'front34', pose: 'stand'},
          {at: '22.1', view: 'front'},
          {at: '22.2', view: 'front34'},
          {at: '22.3', x: 1000, view: 'side', facing: 1, pose: 'walk'},
          {at: 1, x: 2150},
        ],
        walk: 'every',
      },
      {k: 'boom', x: 1080, y: 150, dipAt: 0},
      {k: 'crew', x: 330, y: 1320, h: 1150, role: 'director', facing: 1},
      {k: 'sign', x: 190, y: 330, w: 520, h: 340, texts: [{at: '21.1', text: "WE'RE MAKING A DOCUMENTARY"}, {at: '22.1', text: 'CAN WE INTERRUPT YOUR JOURNEY?'}]},
    ],
    cam: [{at: '22.3.5', x: 0}, {at: 1, x: 520}],
    focus: {x: 830, y: 420, w: 340, h: 480},
  },

  S23: {
    sky: 'noon',
    els: [
      {k: 'ground', y: 560},
      {k: 'crew', x: 1250, y: 600, h: 90, role: 'camera', facing: -1},
      {k: 'crew', x: 1330, y: 604, h: 90, role: 'director', facing: -1},
      {k: 'rect', x: 1340, y: 500, w: 44, h: 30, fill: PAPER, stroke: '#1E1F1A'},
      {k: 'crew', x: 1450, y: 600, h: 90, role: 'sound', facing: 1},
      {k: 'penguin', keys: [{at: 0, x: 900, y: 880, h: 320, view: 'front34', pose: 'walk'}], walk: 'every'},
    ],
    cam: [{at: 0, zoom: 1.04}, {at: 1, zoom: 1}],
  },

  S24: {
    sky: 'noon',
    els: [
      {k: 'ground', y: 690},
      {k: 'mountain', x: 1640, y: 690, h: 110, haze: 0.35},
      {k: 'poly', pts: [[-200, 780], [1100, 780], [2200, 1200], [2200, 1400], [-200, 1400]], fill: PAPER},
      {
        k: 'penguin',
        keys: [
          {at: 0, x: 760, y: 780, h: 260, view: 'side', pose: 'stand'},
          {at: '23.4', x: 760, pose: 'walk'},
          {at: '24.1', x: 1060, y: 790, pose: 'toboggan'},
          {at: 1, x: 1200, y: 840},
        ],
        walk: 'double',
      },
    ],
    cam: [{at: '24.1+14f', x: 0, y: 0}, {at: 1, x: 760, y: 300}],
  },

  S25: {
    sky: 'noon',
    els: [
      {k: 'ground', y: 700, marks: 'sastrugi', scroll: 400},
      {k: 'mountain', x: 1620, y: 700, h: 120, haze: 0.35},
      {k: 'motion', speed: 40},
      {k: 'penguin', keys: [{at: 0, x: 900, y: 760, h: 300, view: 'side', pose: 'toboggan'}]},
    ],
    cam: [{at: 0, roll: 6}],
  },

  S26: {
    sky: 'noon',
    els: [
      {k: 'ground', y: 900},
      {k: 'mountain', x: 1500, y: 900, h: 150, haze: 0.35},
      {
        k: 'penguin',
        keys: [
          {at: 0, x: 300, y: 800, h: 200, view: 'side', pose: 'airborne'},
          {at: 0.42, x: 780, y: 250},
          {at: '26.1.5', x: 1280, y: 900, pose: 'toboggan'},
          {at: 1, x: 1400, y: 905},
        ],
      },
      {k: 'debris', x: 1280, y: 860, at: ['26.1.5'], spread: 420, color: '#FFFFFF'},
    ],
    cam: [{at: 0, y: 0}, {at: 0.42, y: -210}, {at: '26.1.5', y: 0}],
  },

  S27: {
    sky: {from: 'noon', to: 'dusk', at: 0, over: 1},
    els: [
      {k: 'ground', y: HZ},
      {k: 'mountain', x: RIGHT, y: HZ, h: 96, haze: 0.25, eyes: [{at: '27.3', state: 'glint'}, {at: '27.3+6f', state: 'none'}]},
      {k: 'glint', x: 1236, y: 531, at: '27.3', frames: 6, r: 6},
      {k: 'glint', x: 1254, y: 524, at: '27.3', frames: 6, r: 6},
      {
        k: 'penguin',
        keys: [{at: 0, x: 600, y: HZ + 40, h: TINY, view: 'side', pose: 'toboggan'}, {at: '26.3', x: 600, pose: 'walk'}, {at: 1, x: 680}],
        walk: 'every',
      },
    ],
  },

  // ─── Verse 2: the documentary strikes back ───────────────────────────────
  S28: {
    sky: 'night',
    els: [
      {k: 'ground', y: 520},
      {k: 'camp', x: 1450, y: 660, s: 1},
      {k: 'crew', x: 960, y: 980, h: 560, role: 'director', facing: -1},
      {
        k: 'penguin',
        keys: [
          {at: 0, x: 900, y: 650, h: 260, view: 'side', facing: 1, pose: 'lifted'},
          {at: '28.2.5', x: 820, y: 700},
          {at: '28.3', x: 760, y: 900, facing: -1, pose: 'stand'},
        ],
        walk: 'every',
      },
      {k: 'glow', x: 990, y: 420, r: 150, color: '#FFFFFF', from: 0, to: 0.05},
    ],
    focus: {x: 700, y: 420, w: 360, h: 460},
  },

  S29: {
    sky: 'night',
    els: [
      {k: 'ground', y: 520},
      {k: 'camp', x: 1450, y: 660, s: 1},
      {k: 'crew', x: 1060, y: 980, h: 560, role: 'director', facing: -1},
      {
        k: 'penguin',
        keys: [
          {at: 0, x: 1150, y: 650, h: 260, view: 'side', facing: 1, pose: 'lifted'},
          {at: '29.1+10f', x: 820, y: 900, facing: -1, pose: 'stand'},
          {at: '29.3', view: 'side', facing: -1},
          {at: '29.3+4f', x: 820, view: 'front', facing: 1, pose: 'walk'},
          {at: 1, x: 900, y: 1010, h: 340},
        ],
        walk: 'every',
      },
      {k: 'glow', x: 1090, y: 420, r: 150, color: '#FFFFFF', from: 0, to: 0.05},
    ],
    focus: {x: 700, y: 480, w: 360, h: 460},
  },

  S30: {
    sky: 'night',
    els: [
      {k: 'ground', y: 420},
      {k: 'camp', x: 1560, y: 500, s: 0.5},
      {k: 'penguin', keys: [{at: 0, x: 960, y: 2950, h: 2500, view: 'front'}]},
    ],
    cam: [{at: 0, zoom: 1}, {at: '30.3', zoom: 1, y: 0, roll: 0}, {at: '30.3+6f', zoom: 0.8, y: 50, roll: -5}, {at: 1, zoom: 0.82, y: 40, roll: -4}],
    glitchAt: '30.3',
    focus: {x: 700, y: 380, w: 520, h: 520},
  },

  // ─── Pre-chorus: doubt ───────────────────────────────────────────────────
  S31: {
    sky: 'blizzard',
    els: [
      {k: 'ground', y: HZ, line: false},
      {k: 'penguin', keys: [{at: 0, x: LEFT, y: HZ + 40, h: 34, view: 'side', headTurn: 0}, {at: '31.2', headTurn: 0}, {at: '31.3', headTurn: 1}, {at: '31.4', headTurn: 1}, {at: 1, headTurn: 0}]},
      {k: 'storm', density: 1},
    ],
  },

  S32: {
    sky: 'blizzard',
    els: [
      {k: 'rect', x: -1600, y: -1600, w: 5120, h: 4280, fill: '#6A7883', hatch: true},
      {k: 'ellipse', x: 140, y: 250, rx: 7, ry: 7, fill: '#FFD58A'},
      {k: 'ellipse', x: 175, y: 262, rx: 5, ry: 5, fill: '#FFD58A'},
      {k: 'ellipse', x: 210, y: 240, rx: 6, ry: 6, fill: '#FFD58A'},
      {k: 'ellipse', x: 1700, y: 880, rx: 9, ry: 9, fill: '#FFFFFF'},
      {k: 'ellipse', x: 1740, y: 900, rx: 9, ry: 9, fill: '#FFFFFF'},
      {k: 'penguin', keys: [{at: 0, x: 960, y: 540, h: 260, view: 'top'}], counterRoll: true},
      {k: 'storm', density: 0.8},
    ],
    cam: [{at: 0, roll: 0}, {at: '34.1', roll: 180}],
  },

  // ─── Bridge ──────────────────────────────────────────────────────────────
  S33: {
    sky: 'moon',
    els: [
      {k: 'ground', y: 560},
      {k: 'ellipse', x: 960, y: 760, rx: 1200, ry: 170, fill: WASH_ICE, opacity: 0.85},
      {k: 'penguin', keys: [{at: 0, x: 960, y: 1000, h: 200, view: 'back', pose: 'walk'}, {at: 0.4, y: 960, pose: 'stand'}], walk: 'every'},
      {k: 'storm', density: 1, partAt: 0},
    ],
    cam: [{at: 0, y: 0, zoom: 1}, {at: 1, y: 140, zoom: 0.9}],
  },

  S34: {
    sky: 'moon',
    els: [
      {k: 'rect', x: -200, y: -200, w: 2320, h: 1480, fill: '#A7B8CB'},
      {k: 'print', x: 960, y: 500, size: 900},
      {k: 'penguin', keys: [{at: 0, x: 960, y: 925, h: 34, view: 'top'}]},
      {k: 'pip', x: 0, y: 0, w: 1920, h: 1080, at: '35.1', frames: 18, els: [{k: 'feet', x: 890, y: 760, size: 380, stepAt: '36.1'}]},
    ],
    cam: [{at: 0, zoom: 0.9}, {at: 0.45, zoom: 1}],
  },

  S35: {
    sky: 'moon',
    els: [
      {k: 'aurora', faint: true},
      {k: 'penguin', keys: [{at: 0, x: 960, y: 2150, h: 1900, view: 'front34', pose: 'lookup'}]},
    ],
    cam: [{at: 0, zoom: 1}, {at: 1, zoom: 1.1, y: -40}],
  },

  S36: {
    sky: {from: 'moon', to: 'dawn', at: '36.2', over: '36.4'},
    els: [
      {k: 'aurora', foldAt: '36.2'},
      {k: 'ground', y: HZ},
      {k: 'mountain', x: 1520, y: HZ, h: 442, haze: 0.1, eyes: [{at: 0, state: 'sealed'}]},
      {k: 'penguin', keys: [{at: 0, x: LEFT, y: HZ + 40, h: TINY, view: 'side', pose: 'stand'}]},
    ],
  },

  // ─── Chorus 2 ────────────────────────────────────────────────────────────
  S37: {
    sky: {from: 'dawn', to: 'sunrise', at: '37.1', over: '37.1+6f'},
    els: [
      {k: 'ground', y: 900},
      {k: 'mountain', x: 2300, y: 1100, h: 900, haze: 0.15},
      {k: 'glow', x: 1500, y: 300, r: 560, color: '#F2B3A5', from: '37.1', to: '37.1+6f'},
      {k: 'penguin', keys: [{at: 0, x: 900, y: 2000, h: 1800, view: 'front34'}]},
    ],
    cam: [{at: 0, y: 0}, {at: 1, y: -24}],
  },

  S38: {
    sky: 'dawn',
    els: [
      {k: 'ground', y: 700, marks: 'sastrugi', scroll: 60},
      {k: 'mountain', x: 2700, y: 700, h: 1400, haze: 0.12, move: {x: -1500, at: [0, 0.9]}},
      {k: 'crew', x: 2000, y: 790, h: 110, role: 'director', walk: true, sink: 22, move: {x: -1450, at: [0, 0.9]}},
      {k: 'crew', x: 2090, y: 794, h: 110, role: 'camera', walk: true, sink: 22, move: {x: -1450, at: [0, 0.9]}},
      {k: 'crew', x: 2180, y: 790, h: 110, role: 'sound', walk: true, sink: 22, move: {x: -1450, at: [0, 0.9]}},
      {k: 'rect', x: -600, y: 770, w: 3400, h: 500, fill: '#F3E4DF'},
      {k: 'penguin', keys: [{at: 0, x: 960, y: 1500, h: 1100, view: 'front34', pose: 'walk'}, {at: 0.55, view: 'back34'}], walk: 'every'},
    ],
  },

  S39: {
    sky: 'dawn',
    els: [
      {k: 'ground', y: HZ},
      {k: 'mountain', x: 2000, y: 640, h: 2400, haze: 0.08},
      {k: 'penguin', keys: [{at: 0, x: LEFT, y: 740, h: 32, view: 'back', pose: 'walk'}, {at: 1, y: 700, h: 28}], walk: 'every'},
    ],
  },

  S40: {
    phases: [
      {from: 0, sky: 'dawn', els: [{k: 'ground', y: 1000}, profile]},
      {from: '39.2', sky: 'dawn', els: [{k: 'mountain', x: 1700, y: 1000, h: 600, haze: 0.04}]},
    ],
  },

  S41: {
    sky: 'dawn',
    els: [
      {k: 'ground', y: 700},
      {k: 'mountain', x: 1400, y: 1500, h: 2400, haze: 0.05},
      {
        k: 'penguin',
        keys: [{at: 0, x: 900, y: 1500, h: 1000, view: 'front34', pose: 'walk'}, {at: '40.1', pose: 'stand'}, {at: '40.4', pose: 'walk'}],
        walk: 'every',
      },
      {k: 'breath', at: '40.1'},
      {k: 'debris', x: 1250, y: 180, at: ['40.3', '40.3.5'], spread: 520, color: '#D9DEE2'},
    ],
  },

  S42: {
    sky: 'dawn',
    els: [
      {k: 'ground', y: 300},
      {k: 'mountain', x: 2300, y: 900, h: 1600, haze: 0.35},
      {
        k: 'penguin',
        keys: [{at: 0, x: -200, y: 900, h: 360, view: 'side', facing: 1, pose: 'walk'}, {at: '42.2', x: 900}, {at: 1, x: 2150}],
        walk: 'every',
      },
      {k: 'crew', x: 280, y: 1300, h: 1100, role: 'director', facing: 1, move: {x: 120, at: [0, '41.1']}},
      {k: 'sign', x: 220, y: 360, w: 520, h: 340, texts: [{at: '41.1', text: "WE'RE STILL MAKING A DOCUMENTARY"}, {at: '42.1', text: 'PLEASE?'}]},
      {k: 'ellipse', x: 120, y: 1000, rx: 520, ry: 260, fill: '#FFFFFF', opacity: 0.35},
    ],
    cam: [{at: '42.3', x: 0}, {at: 1, x: 600}],
    focus: {x: 760, y: 440, w: 340, h: 460},
  },

  // ─── Chorus 3: the climb ─────────────────────────────────────────────────
  S43: {
    sky: 'dawn',
    els: [
      {k: 'ground', y: 760},
      {k: 'poly', pts: [[1180, 1100], [1200, 700], [1320, 420], [1520, 300], [1800, 200], [2100, 160], [2100, 1100]], fill: ROCK, hatch: true},
      {k: 'penguin', keys: [{at: 0, x: 780, y: 1650, h: 1300, view: 'side', pose: 'stand'}, {at: '43.1', pose: 'climb'}]},
    ],
  },

  S44: {
    sky: 'dawn',
    els: [
      {k: 'mountain', x: 2200, y: 1300, h: 3800, haze: 0.05},
      {k: 'poly', pts: [[-100, 1200], [-100, 1000], [300, 900], [700, 960], [1100, 880], [1500, 940], [2000, 860], [2100, 1200]], fill: ROCK, hatch: true},
      {k: 'penguin', keys: [{at: 0, x: 420, y: 1500, h: 1000, view: 'back34'}]},
    ],
    cam: [{at: 0, y: 0}, {at: 0.9, y: -1100}],
  },

  S45: {
    sky: 'dawn',
    els: [
      {k: 'poly', pts: [[-200, 1400], [-200, 1000], [2200, -200], [2400, -200], [2400, 1400]], fill: ROCK, hatch: true},
      {k: 'penguin', keys: [{at: 0, x: 500, y: 650, h: 360, view: 'side', pose: 'climb'}, {at: 1, x: 1100, y: 350}]},
    ],
    cam: [{at: 0, x: 0, y: 0}, {at: 1, x: 600, y: -300}],
  },

  S46: {
    sky: 'dawn',
    els: [
      {k: 'poly', pts: [[1300, 780], [1240, -2400], [2200, -2400], [2200, 780]], fill: ROCK, hatch: true},
      {k: 'poly', pts: [[-200, 1400], [-200, 780], [1300, 780], [1340, 740], [2200, 720], [2200, 1400]], fill: '#4E5259', hatch: true},
      {k: 'penguin', keys: [{at: 0, x: 700, y: 850, h: 360, view: 'side', pose: 'climb'}, {at: '45.4', y: 780, pose: 'stand'}]},
    ],
    cam: [{at: '45.4', y: 0, zoom: 1}, {at: 1, y: -700, zoom: 0.8}],
  },

  S47: {
    sky: {from: 'dawn', to: 'sunrise', at: 0, over: 1},
    els: [
      {k: 'glow', x: 880, y: 120, r: 640, color: '#F9D98E', from: 0, to: 1},
      {k: 'mountain', x: 1000, y: 1300, h: 1250, haze: 0.05},
      {k: 'rect', x: -200, y: 890, w: 2400, h: 400, fill: '#F1DFD2'},
      ...crewTrio(560, 912, 60),
      {k: 'penguin', keys: [{at: 0, x: 780, y: 430, h: 14, view: 'back', pose: 'climb'}, {at: 1, x: 790, y: 370}]},
    ],
    cam: [{at: 0, zoom: 1}, {at: 1, zoom: 1.06}],
  },

  S48: {
    sky: 'sunrise',
    els: [
      {k: 'poly', pts: [[-200, 1300], [-200, 300], [700, 150], [1300, 150], [2200, 300], [2200, 1300]], fill: ROCK, hatch: true},
      {k: 'penguin', keys: [{at: 0, x: 960, y: 960, h: 420, view: 'back', pose: 'climb'}, {at: 1, y: 720}]},
      {k: 'streaks', at: 0, frames: 72, vertical: true},
    ],
    cam: [{at: 0, y: 0}, {at: 1, y: -200}],
  },

  S49: {
    sky: 'sunrise',
    els: [
      {k: 'ground', y: 990},
      {k: 'sun', x: 884, y: 180, r: 60},
      {k: 'mountain', x: 960, y: 930, h: 760, dark: true, rim: ['49.1', '49.4.5']},
      {k: 'penguin', keys: [{at: 0, x: 428, y: 486, h: 12, view: 'side', facing: 1}]},
    ],
  },

  S50: {
    sky: 'sunrise',
    els: [
      {k: 'glow', x: 1200, y: 170, r: 420, color: '#FFFFFF', from: 0, to: 0.4},
      {k: 'poly', pts: [[-200, 1400], [-200, 1100], [2200, 100], [2400, 100], [2400, 1400]], fill: ROCK, hatch: true},
      {k: 'penguin', keys: [{at: 0, x: 800, y: 683, h: 360, view: 'side', pose: 'climb'}, {at: 1, x: 1000, y: 600}]},
      {k: 'debris', x: 1150, y: 80, at: ['50.1', '50.2', '50.3', '50.4'], spread: 520},
    ],
    cam: [{at: 0, x: 0, y: 0}, {at: 1, x: 200, y: -80}],
    shakeOnDownbeat: true,
  },

  // ─── Outro: the creator ──────────────────────────────────────────────────
  S51: {
    sky: 'sunrise',
    els: [
      {k: 'ground', y: 262},
      {k: 'footprints', x1: 1010, y1: 880, x2: 364, y2: 266, n: 70, size: 3.4, color: '#7F8A93'},
      {k: 'colony', x: 350, y: 268, w: 90, ph: 10, rows: 2, cols: 10},
      ...crewTrio(1040, 884, 30),
      {k: 'poly', pts: [[-200, 1300], [-200, 820], [600, 870], [1200, 990], [2200, 930], [2200, 1300]], fill: ROCK, hatch: true},
      {k: 'penguin', keys: [{at: 0, x: 420, y: 1250, h: 900, view: 'back', headTurn: 0}, {at: '51.3', headTurn: 1}]},
    ],
    cam: [{at: 0, zoom: 1.08}, {at: 1, zoom: 1}],
  },

  S52: {
    sky: 'sunrise',
    els: [
      dome(60),
      {k: 'eyes', x: 960, y: 330, gap: 980, size: 320},
      {k: 'poly', pts: [[560, 1200], [1360, 1200], [1010, 560], [910, 560]], fill: '#C9D2DA'},
      {k: 'penguin', keys: [{at: 0, x: 960, y: 1010, h: 240, view: 'back', pose: 'climb'}, {at: '52.2', y: 960, pose: 'stand'}]},
    ],
  },

  S53: {
    sky: 'sunrise',
    els: [
      dome(-120),
      {k: 'eyes', x: 960, y: 470, gap: 1320, size: 680},
      {k: 'poly', pts: [[700, 1200], [1220, 1200], [1060, 820], [860, 820]], fill: '#C9D2DA'},
      {k: 'penguin', keys: [{at: 0, x: 960, y: 880, h: 90, view: 'back', pose: 'stand'}, {at: '53.2', pose: 'walk'}, {at: '53.3', y: 866, pose: 'stand'}], walk: 'every'},
    ],
  },

  S54: {
    phases: [
      {from: 0, sky: 'sunrise', els: [{k: 'penguin', keys: [{at: 0, x: 960, y: 2150, h: 1900, view: 'front34', pose: 'lookup'}]}]},
      {from: '54.2.5', sky: 'sunrise', els: [{k: 'seal', x: -200, y: -100, w: 2320, h: 1300, cracks: ['54.3', '54.4', '55.1']}], cam: [{at: '54.2.5', zoom: 1}, {at: 1, zoom: 1.08}]},
    ],
  },

  S55: {
    sky: {from: 'sunrise', to: 'creator', at: 0, over: '55.3+12f'},
    els: [
      dome(-120),
      {k: 'glow', x: 960, y: 470, r: 1100, color: CREATOR_GOLD, from: 0, to: '55.3+12f'},
      {k: 'eyes', x: 960, y: 470, gap: 1320, size: 680, openAt: 0},
      {k: 'poly', pts: [[700, 1200], [1220, 1200], [1060, 820], [860, 820]], fill: '#C9D2DA'},
      {k: 'penguin', keys: [{at: 0, x: 960, y: 866, h: 90, view: 'back', headTurn: 0}, {at: 0.5, headTurn: 1}]},
    ],
    cam: [{at: 0, zoom: 1.1}, {at: 1, zoom: 1}],
    letterboxOutAt: '55.3',
  },

  S56: {
    sky: 'creator',
    els: [
      {k: 'rect', x: -100, y: -100, w: 2120, h: 1280, fill: '#3E4148'},
      {k: 'bigEye', x: 960, y: 540, size: 1500, pupil: [1, 0.82], reflection: true},
    ],
  },

  S57: {
    sky: 'creator',
    els: [
      {k: 'group', els: [{k: 'ellipse', x: 400, y: 1060, rx: 700, ry: 120, fill: '#FFFFFF', opacity: 0.9}, {k: 'ellipse', x: 1500, y: 1110, rx: 900, ry: 150, fill: '#FFFFFF', opacity: 0.9}], move: {y: 260, at: [0, '136.3s']}},
      {
        k: 'group',
        els: [
          {k: 'poly', pts: [[1080, 1300], [1060, 700], [1160, 420], [1400, 280], [1700, 300], [1960, 460], [2100, 800], [2100, 1300]], fill: ROCK, hatch: true},
          {k: 'poly', pts: [[1200, 560], [420, 640], [1200, 720]], fill: '#C9D2DA'},
          {k: 'bigEye', x: 1420, y: 460, size: 150},
          {
            k: 'penguin',
            keys: [
              {at: 0, x: 520, y: 630, h: 60, view: 'side', facing: 1, pose: 'stand'},
              {at: '137.0s', pose: 'bow'},
              {at: '137.4s+12f', pose: 'stand'},
            ],
          },
        ],
        move: {y: -250, at: [0, '136.3s']},
      },
      {k: 'ring', x: 520, y: 380, at: '137.4s'},
    ],
    cam: [{at: '136.3s', zoom: 1, x: 0, y: 0}, {at: 1, zoom: 1.8, x: -440, y: -170}],
  },

  S58: {
    sky: 'morning',
    els: [
      {k: 'ground', y: 700},
      {k: 'glow', x: 960, y: -200, r: 900, color: CREATOR_GOLD, from: 0, to: 0.3},
      {k: 'crew', x: 700, y: 920, h: 380, role: 'director', look: 'up'},
      {k: 'crew', x: 1120, y: 920, h: 380, role: 'sound', look: 'up', facing: -1},
    ],
    cam: [{at: '139.6s', roll: 0, y: 0, zoom: 1}, {at: '140.0s', roll: -35, y: 360, zoom: 1.3}],
    focus: {x: 600, y: 420, w: 640, h: 420},
  },

  S59: {
    sky: 'morning',
    els: [
      {k: 'rect', x: 820, y: 520, w: 50, h: 190, fill: PAPER, stroke: '#1E1F1A'},
      {k: 'rect', x: 1050, y: 520, w: 50, h: 190, fill: PAPER, stroke: '#1E1F1A'},
      {k: 'ground', y: 700},
      {k: 'mountain', x: 960, y: 700, h: 360, haze: 0.1, move: {y: -170, at: ['141.6s', '143.4s']}, turnAt: '144.2s'},
      {
        k: 'penguin',
        keys: [
          {at: 0, x: 924, y: 340, h: 8, view: 'side', facing: -1},
          {at: '141.6s', y: 340},
          {at: '143.4s', y: 170},
          {at: '144.2s', x: 924},
          {at: '144.2s+20f', x: 996, facing: 1},
        ],
      },
      {k: 'streaks', at: '141.6s', frames: 54, vertical: true},
    ],
  },

  S60: {
    sky: 'morning',
    els: [
      {k: 'ground', y: DOC_HZ},
      {k: 'footprints', x1: 560, y1: 1100, x2: LEFT, y2: DOC_HZ + 8, n: 30, size: 4},
      {k: 'footprints', x1: 1340, y1: 1180, x2: RIGHT, y2: DOC_HZ + 20, n: 6, size: 46},
      {
        k: 'group',
        els: [
          {k: 'mountain', x: RIGHT, y: DOC_HZ, h: 300, haze: 0.2},
          {k: 'penguin', keys: [{at: 0, x: RIGHT - 30, y: DOC_HZ - 300, h: 8, view: 'back'}]},
        ],
        move: {y: 330, at: [0.08, 0.78]},
        clipY: DOC_HZ,
      },
    ],
    cam: [{at: 0, roll: -12}],
    freezeLast: 20,
    focus: {x: 1060, y: 380, w: 440, h: 300},
  },

  S61: {sky: 'paper', els: [{k: 'endcard'}]},
};
