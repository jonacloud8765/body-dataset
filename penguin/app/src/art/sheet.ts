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
};
export type Sheet = {parts: Record<string, SheetPart>};

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
