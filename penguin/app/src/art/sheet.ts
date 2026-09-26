import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * The traced model sheet (public/art/sheet.json, written by scripts/trace-sheet.py; local only).
 * Paths are in sheet pixels relative to each part's anchor (feet baseline or neck base), y down.
 */
export type SheetPart = {
  box: number[];
  anchor: [number, number];
  height: number;
  width: number;
  left: number;
  top: number;
  fill: string;
  ink: string;
  mass: string;
  lines: string;
  /** the big black areas only: they cast cel shadow onto the white beside them */
  casts: string;
  /** torso only: the region under its cut line (that edge is open, not an outline) */
  below?: string;
};
export type SheetBody = {
  anchor: [number, number];
  height: number;
  parts: Record<string, SheetPart>;
  joints: Record<string, [number, number]>;
  heads: Record<string, {s: number; x: number; y: number; score: number}>;
  /** each leg measured off the drawing (outside-to-outside widths) */
  legs: Record<string, LegMeasure>;
  /** where a head blends into the neck: [opaque above, gone below], body frame y */
  fade: {own: [number, number]; sheet: [number, number]};
};
export type LegMeasure = {
  top: {x: number; y: number; w: number};
  hem: {x: number; y: number; w: number};
  ankle: {x: number; y: number; w: number};
  cuff: number;
  /** where the leg comes out from under the torso */
  cut: number;
};
export type Sheet = {
  parts: Record<string, SheetPart>;
  bodies: Record<string, SheetBody>;
  heads: Record<string, SheetPart>;
  poses: Record<string, SheetPart & {anchor: [number, number]}>;
};

let cache: Sheet | null | undefined;
let pending: Promise<Sheet | null> | null = null;

const load = () => {
  if (!pending) {
    pending = fetch(staticFile('art/sheet.json'))
      .then((r) => (r.ok ? (r.json() as Promise<Sheet>) : null))
      .catch(() => null)
      .then((d) => {
        cache = d;
        return d;
      });
  }
  return pending;
};

/** The traced sheet, or null when it hasn't been generated (the rig then falls back to blocking figures). */
export const useSheet = (): Sheet | null => {
  const [sheet, setSheet] = useState<Sheet | null>(cache ?? null);
  const [handle] = useState(() => (cache === undefined ? delayRender('Loading the traced model sheet') : null));
  useEffect(() => {
    if (handle === null) return;
    load().then((d) => {
      setSheet(d);
      continueRender(handle);
    });
  }, [handle]);
  return sheet;
};
