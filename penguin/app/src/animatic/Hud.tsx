import React from 'react';
import {FONT_DISPLAY, FONT_MONO} from '../fonts';
import {barBeatAt, beatFrame, FPS, HEIGHT, linesAt, nextLineAfter, SECTIONS, SONG_END_S, WIDTH} from '../timing/song';
import {shotAt, SHOTS, TOTAL_FRAMES} from '../timing/timeline';

const mmss = (t: number) => {
  const m = Math.floor(t / 60);
  const s = t - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, '0')}`;
};

const MODE_COLOR: Record<string, string> = {CINEMA: '#3987E5', DOC: '#D95926', FULL: '#F6C979', MAP: '#199E70'};

/**
 * Animatic overlay: what shot this is, where we are in the music, what is being sung,
 * and which in-shot cue just happened. Everything reads from the same song map as the film.
 */
export const Hud: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  const shot = shotAt(frame);
  const local = frame - shot.from;
  const inSong = t < SONG_END_S;
  const bb = barBeatAt((frame + 0.5) / FPS);
  const sinceBeat = frame - beatFrame(bb.index);
  const lines = inSong ? linesAt(t) : [];
  const next = inSong ? nextLineAfter(t) : undefined;
  const cue = (shot.beats ?? []).filter((b) => local >= b.frame && local < b.frame + 36).pop();
  const cut = local < 6;
  const sec = SECTIONS.find((s) => t >= s.start.t && t < s.end.t);
  const secName = inSong ? (sec?.name ?? 'Intro') : 'Epilogue (silent)';
  const lineText = lines.map((l) => l.text).join('  /  ');
  const nextIn = next ? next.start.t - t : 99;

  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: FONT_MONO, color: '#F2F2F2'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 62, background: 'rgba(0,0,0,0.62)', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 18, fontSize: 26}}>
        <span style={{fontWeight: 500, fontSize: 30, color: cut ? '#FFFFFF' : '#E6E6E6', background: cut ? '#E8322B' : 'transparent', padding: '0 10px', borderRadius: 4}}>{shot.id}</span>
        <span style={{fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 30, maxWidth: 640, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{shot.title}</span>
        <span style={{fontSize: 20, padding: '2px 10px', borderRadius: 4, background: MODE_COLOR[shot.mode], color: '#101010', fontWeight: 500}}>{shot.mode}</span>
        <span style={{fontSize: 20, opacity: 0.75}}>{shot.head !== 'none' ? `head: ${shot.head}${shot.sing ? ' · sings' : ''}` : shot.sing ? 'sings' : ''}</span>
        <span style={{flex: 1}} />
        <span style={{fontSize: 22, opacity: 0.8}}>{secName}</span>
        <span style={{fontWeight: 500, fontSize: 28, minWidth: 190, textAlign: 'right'}}>{inSong && bb.index >= 0 ? `BAR ${bb.bar}.${bb.beat}` : '—'}</span>
        <span style={{display: 'flex', gap: 8}}>
          {[1, 2, 3, 4].map((b) => {
            const on = inSong && bb.index >= 0 && b === bb.beat;
            const flash = on && sinceBeat < 4;
            return (
              <span
                key={b}
                style={{
                  width: b === 1 ? 26 : 18,
                  height: b === 1 ? 26 : 18,
                  borderRadius: 999,
                  background: flash ? '#FFFFFF' : on ? (b === 1 ? '#E8322B' : '#9A9A9A') : 'rgba(255,255,255,0.15)',
                  alignSelf: 'center',
                }}
              />
            );
          })}
        </span>
        <span style={{fontSize: 22, opacity: 0.85, minWidth: 210, textAlign: 'right'}}>{`${mmss(t)} · f${frame}`}</span>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 126, background: 'rgba(0,0,0,0.62)', padding: '10px 28px 0'}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 24, height: 58}}>
          <span style={{fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 44, color: lineText ? '#FFFFFF' : 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 1300}}>
            {lineText || (inSong ? '♪' : '(silence)')}
          </span>
          <span style={{flex: 1}} />
          {next && nextIn < 3 ? <span style={{fontSize: 22, opacity: 0.55, whiteSpace: 'nowrap'}}>{`next: ${next.text.slice(0, 34)}`}</span> : null}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, height: 30, fontSize: 22}}>
          <span style={{color: '#F6C979', minHeight: 26, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 1400}}>{cue ? `▶ ${cue.do}` : ''}</span>
        </div>
        <div style={{position: 'absolute', left: 28, right: 28, bottom: 10, height: 12}}>
          {SECTIONS.map((s, i) => (
            <div key={s.id} style={{position: 'absolute', left: `${((i === 0 ? 0 : s.start.frame) / TOTAL_FRAMES) * 100}%`, width: `${((s.end.frame - (i === 0 ? 0 : s.start.frame)) / TOTAL_FRAMES) * 100}%`, top: 0, bottom: 0, background: i % 2 ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.18)'}} />
          ))}
          {SHOTS.map((s) => (
            <div key={s.id} style={{position: 'absolute', left: `${(s.from / TOTAL_FRAMES) * 100}%`, top: -3, width: 2, height: 18, background: 'rgba(255,255,255,0.45)'}} />
          ))}
          <div style={{position: 'absolute', left: `${(frame / TOTAL_FRAMES) * 100}%`, top: -8, width: 4, height: 28, background: '#E8322B'}} />
        </div>
      </div>
      {cut ? <div style={{position: 'absolute', inset: 0, border: '6px solid rgba(232,50,43,0.85)', height: HEIGHT, width: WIDTH, boxSizing: 'border-box'}} /> : null}
    </div>
  );
};
