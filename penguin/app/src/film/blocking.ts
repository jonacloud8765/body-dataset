import {SPECS} from '../animatic/blocking';
import type {El, Spec} from '../animatic/types';

/**
 * The film's blocking: the approved animatic's shot plans (animatic/blocking.ts), with the changes
 * the finished drawing needs: walking paces his legs can make, the crew's business with the sign
 * and with him, the creator's legs, where the sun sits.
 */
const film: Record<string, Spec> = structuredClone(SPECS);

type Penguin = Extract<El, {k: 'penguin'}>;
type Crew = Extract<El, {k: 'crew'}>;
const els = (id: string) => film[id].els ?? [];
const penguin = (id: string, n = 0) => els(id).filter((e): e is Penguin => e.k === 'penguin')[n];
const crew = (id: string, role: Crew['role']) => els(id).find((e): e is Crew => e.k === 'crew' && e.role === role)!;

// S20, S40 · the mirror match: his beak tip sits exactly where the mountain's spur will be
const profileAt = (id: string, x: number, y: number) => {
  for (const ph of film[id].phases ?? []) {
    for (const e of ph.els) if (e.k === 'penguin') e.keys = [{...e.keys[0], x, y}];
  }
};
profileAt('S20', 885, 2212);
profileAt('S40', 896, 2270);

// S16 · the time-lapse: his feet race like the clouds
penguin('S16').rate = 12;

// S17 · the sun breaks through where the light comes from
film.S17.sun = {x: 1780, y: 230};

// S22 · the director holds the sign up to the lens; he turns and walks on at his own pace
crew('S22', 'director').sign = '21.1';
{
  const p = penguin('S22');
  p.keys[p.keys.length - 1] = {at: 1, x: 1270};
  film.S22.cam = [{at: '22.3.5', x: 0}, {at: 1, x: 220}];
}

// S24 · a few quick steps to the edge, then the belly flop
{
  const p = penguin('S24');
  p.keys = [
    {at: 0, x: 760, y: 780, h: 260, view: 'side', pose: 'stand'},
    {at: '23.4', x: 760, pose: 'walk'},
    {at: '24.1', x: 900, y: 786, pose: 'toboggan'},
    {at: 1, x: 1200, y: 840},
  ];
}

// S28 · the director carries him back toward camp and sets him down, turned round
{
  const d = crew('S28', 'director');
  d.x = 1040;
  d.carry = [0, '28.3'];
  const p = penguin('S28');
  p.keys = [
    {at: 0, x: 905, y: 690, h: 260, view: 'side', facing: 1, pose: 'lifted'},
    {at: '28.2.5', x: 880, y: 720},
    {at: '28.3', x: 760, y: 900, facing: -1, pose: 'stand'},
  ];
}

// S29 · and again
{
  const d = crew('S29', 'director');
  d.carry = [0, '29.1+10f'];
  const p = penguin('S29');
  p.keys[0] = {at: 0, x: 925, y: 690, h: 260, view: 'side', facing: 1, pose: 'lifted'};
}

// S34 · the flash of the first step lands inside the flash
{
  const pip = els('S34').find((e) => e.k === 'pip');
  if (pip && pip.k === 'pip') pip.els = [{k: 'feet', x: 890, y: 760, size: 380, stepAt: '35.1+9f'}];
}

// S45 · the rock runs past the frame edge all the way through the move
{
  const rock = els('S45').find((e) => e.k === 'poly');
  if (rock && rock.k === 'poly') rock.pts = [[-200, 1400], [-200, 1000], [2200, -200], [2900, -200], [2900, 1400]];
}

// S37 · the sun comes up behind the mountain's shoulder
film.S37.sun = {x: 1420, y: 330};

// S42 · he walks the width of the frame at a steady double-time
{
  const p = penguin('S42');
  p.keys = [{at: 0, x: -150, y: 900, h: 360, view: 'side', facing: 1, pose: 'walk'}, {at: 1, x: 1080}];
  film.S42.cam = [{at: '42.3', x: 0}, {at: 1, x: 320}];
}

// S59 · the mountain stands: its legs are his legs, its feet planted in the snow
{
  const e = els('S59');
  const legs: El = {k: 'legs', xs: [790, 1110], y: 712, top: 520, w: 120, facing: -1, turnAt: '144.2s'};
  const rest = e.filter((x) => x.k !== 'rect');
  const g = rest.findIndex((x) => x.k === 'ground');
  rest.splice(g + 1, 0, legs);
  film.S59.els = rest;
}

export const FILM_SPECS: Record<string, Spec> = film;
