import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Director, DirectorBack, Scientist, ScientistBack} from './People';

/** Both people in every view, for checking the designs. */
export const InterviewCast: React.FC = () => (
  <AbsoluteFill style={{background: '#DCE6F2'}}>
    <svg width={1920} height={1080}>
      <line x1={0} y1={900} x2={1920} y2={900} stroke="#9AA" />
      <Director x={330} y={900} h={620} pose={{}} />
      <Scientist x={900} y={900} h={620} />
      <DirectorBack x={1330} y={640} h={260} />
      <ScientistBack x={1700} y={640} h={260} />
    </svg>
  </AbsoluteFill>
);
