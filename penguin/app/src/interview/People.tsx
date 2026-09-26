import React from 'react';

/**
 * The two people in the interview, in the film's flat 2D look: flat fills, one ink line.
 *
 * The scientist is drawn from the reference images (penguin/source/interview, local only): gray
 * swept hair, dark wraparound sunglasses, gray moustache and goatee, red parka with the hood down,
 * a dark neck gaiter, a radio on a strap. The interviewer is the film's documentary director:
 * orange parka, hood up with its fur ring, goggles, the scarf over the mouth.
 *
 * No lip sync: while someone talks, the head moves with the voice.
 */

export const INK = '#1D2133';

export type Tint = (c: string) => string;
const same: Tint = (c) => c;

// ─── the scientist ─────────────────────────────────────────────────────────
// Drawn in the reference illustration's pixel space (he sits facing left, 3/4 toward the lens).
// The seat point (where he sits on the rock) is at SEAT; the head turns about NECK.
const SEAT: [number, number] = [965, 850];
const NECK: [number, number] = [935, 470];

const RED = '#B8322C';
const RED_DARK = '#8E2522';
const GAITER = '#2B2725';
const PANTS = '#3A3E47';
const BOOT = '#24262B';
const SKIN = '#D39C78';
const SKIN_DARK = '#B97F5E';
const HAIR = '#C9CBCD';
const HAIR_DARK = '#A4A8AD';
const BEARD = '#D2CEC6';
const BEARD_DARK = '#B9B4AA';
const LENS = '#20232B';
const LENS_HI = '#566072';

export type Pose = {
  /** head tilt, degrees (positive = chin down) */
  nod?: number;
  /** head turned further left, toward the colony, 0-1 */
  look?: number;
  /** breathing, -1..1 */
  breath?: number;
};

const Ink: React.FC<{d: string; fill: string; w?: number}> = ({d, fill, w = 3.5}) => (
  <path d={d} fill={fill} stroke={INK} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" />
);

/** The scientist, 3/4 front, facing left. (x, y) is where he sits; h is his seated height in px. */
export const Scientist: React.FC<{x: number; y: number; h: number; pose?: Pose; tint?: Tint; flip?: boolean}> = ({x, y, h, pose = {}, tint = same, flip = false}) => {
  const s = h / 860; // seated height in reference px: hair top (200) to boot soles (1062)
  const nod = pose.nod ?? 0;
  const look = pose.look ?? 0;
  const br = pose.breath ?? 0;
  const T = tint;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (flip ? -1 : 1)} ${s}) translate(${-SEAT[0]} ${-SEAT[1]})`}>
      {/* legs: seated, knees toward the lens and left */}
      <Ink d="M 1040 820 C 960 830, 840 838, 740 852 C 706 860, 700 898, 728 908 C 820 902, 950 892, 1060 880 Z" fill={T(PANTS)} />
      <Ink d="M 708 884 L 760 887 L 752 1000 L 702 1000 Z" fill={T(PANTS)} />
      <Ink d="M 686 990 L 768 990 C 774 1010, 769 1030, 759 1035 L 671 1035 C 664 1020, 671 1000, 686 990 Z" fill={T(BOOT)} />
      <Ink d="M 1085 845 C 990 862, 870 874, 772 894 C 740 904, 740 940, 772 946 C 870 940, 990 928, 1105 905 Z" fill={T(PANTS)} />
      <Ink d="M 756 920 L 808 923 L 800 1030 L 750 1030 Z" fill={T(PANTS)} />
      <Ink d="M 734 1020 L 818 1020 C 824 1040, 818 1058, 808 1062 L 719 1062 C 711 1048, 719 1030, 734 1020 Z" fill={T(BOOT)} />

      <g transform={`translate(0 ${br * 3}) `}>
        {/* the hood, down behind his neck */}
        <Ink d="M 1030 370 C 1080 350, 1150 360, 1176 400 C 1196 440, 1190 500, 1170 540 L 1100 560 L 1060 470 Z" fill={T(RED)} />
        <path d="M 1045 386 C 1090 373, 1140 386, 1155 420 L 1150 500 L 1090 480 Z" fill={T(RED_DARK)} />
        {/* the parka */}
        <Ink d="M 800 520 C 840 490, 870 485, 885 505 C 915 525, 960 540, 1015 525 C 1065 512, 1110 540, 1150 600 C 1180 660, 1186 760, 1172 852 C 1100 872, 900 877, 800 862 C 780 780, 780 620, 800 520 Z" fill={T(RED)} />
        <path d="M 800 520 C 780 620, 780 780, 800 862 C 822 866, 842 868, 858 868 C 838 780, 830 640, 852 538 Z" fill={T(RED_DARK)} />
        <path d="M 905 548 C 902 640, 894 740, 886 868" fill="none" stroke={INK} strokeWidth={2.5} />
        {/* his left arm, folded across */}
        <Ink d="M 1100 580 C 1150 600, 1176 680, 1166 772 L 1116 792 C 1111 722, 1096 652, 1080 602 Z" fill={T(RED)} />
        <Ink d="M 1152 740 C 1080 745, 950 750, 890 752 C 880 765, 882 790, 895 795 C 980 796, 1080 791, 1162 786 Z" fill={T(RED)} />
        <Ink d="M 900 748 C 868 745, 848 760, 853 781 C 858 797, 884 802, 900 795 Z" fill={T(BOOT)} />
        {/* the radio on its strap, a patch on the chest */}
        <path d="M 905 526 L 919 533 L 818 718 L 803 710 Z" fill={T('#1F2127')} />
        <g transform="rotate(-20 800 690)">
          <Ink d="M 780 650 L 822 650 L 822 732 L 780 732 Z" fill={T('#26282E')} w={3} />
          <path d="M 812 650 L 812 616" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <rect x={788} y={662} width={26} height={14} fill={T('#3B3F48')} />
        </g>
        <Ink d="M 915 542 L 945 536 L 950 561 L 926 566 Z" fill={T('#E6E6E2')} w={2.5} />
        {/* the neck gaiter */}
        <Ink d="M 868 440 C 900 456, 950 456, 995 402 C 1010 386, 1040 381, 1060 386 L 1086 470 C 1060 510, 1000 530, 940 536 C 900 537, 862 526, 845 512 C 848 480, 856 455, 868 440 Z" fill={T(GAITER)} />

        {/* the head */}
        <g transform={`rotate(${nod - look * 7} ${NECK[0]} ${NECK[1]}) translate(${-look * 10} ${look * 4}) translate(${NECK[0]} ${NECK[1]}) scale(1.24) translate(${-NECK[0]} ${-NECK[1]})`}>
          <Ink d="M 842 272 C 824 226, 858 184, 916 178 C 978 172, 1032 202, 1052 256 C 1064 298, 1056 348, 1036 368 L 998 364 L 990 300 Z" fill={T(HAIR_DARK)} />
          <Ink d="M 872 262 C 910 250, 965 258, 988 285 C 998 320, 1000 360, 992 395 C 980 425, 950 447, 922 450 C 895 452, 878 440, 872 420 L 866 398 C 862 388, 858 378, 858 370 C 856 364, 861 358, 864 352 C 858 340, 852 325, 856 312 C 858 290, 862 275, 872 262 Z" fill={T(SKIN)} />
          <Ink d="M 988 330 C 1003 330, 1007 352, 999 372 C 995 379, 988 377, 987 370 Z" fill={T(SKIN_DARK)} w={2.5} />
          {/* stubble along the jaw, then the goatee and moustache */}
          <path d="M 926 404 C 945 402, 970 398, 990 392 C 985 415, 962 440, 930 450 C 934 432, 934 416, 926 404 Z" fill={T(BEARD_DARK)} />
          <Ink d="M 878 408 C 890 410, 912 410, 926 406 C 933 420, 929 436, 917 446 C 902 451, 886 447, 880 436 C 876 428, 876 416, 878 408 Z" fill={T(BEARD)} w={2.5} />
          <Ink d="M 864 392 C 874 384, 892 382, 902 386 C 912 382, 926 386, 933 396 C 922 400, 910 398, 902 396 C 890 400, 874 400, 864 392 Z" fill={T(BEARD)} w={2.5} />
          <path d="M 884 404 C 896 406, 908 406, 918 403" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 866 350 C 862 358, 858 364, 860 369 C 864 373, 870 373, 874 371" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 882 374 C 887 384, 887 391, 884 396" fill="none" stroke={T(SKIN_DARK)} strokeWidth={3} strokeLinecap="round" />
          {/* brows over the glasses */}
          <path d="M 868 312 C 880 306, 895 306, 906 310 M 926 309 C 940 304, 956 305, 968 311" fill="none" stroke={T(HAIR_DARK)} strokeWidth={5} strokeLinecap="round" />
          {/* wraparound sunglasses */}
          <path d="M 976 321 L 998 331 L 995 338 L 974 327 Z" fill={T(LENS)} stroke={INK} strokeWidth={2} />
          <Ink d="M 842 322 L 908 318 C 912 330, 910 342, 900 350 C 885 356, 858 354, 848 346 C 842 338, 840 330, 842 322 Z" fill={T(LENS)} w={3} />
          <Ink d="M 916 320 L 978 318 C 980 330, 974 342, 962 348 C 948 353, 928 350, 920 342 C 916 335, 915 327, 916 320 Z" fill={T(LENS)} w={3} />
          <path d="M 906 322 L 918 322 L 918 328 L 906 328 Z" fill={T(LENS)} />
          <path d="M 852 327 L 882 324 L 878 331 L 854 333 Z M 926 325 L 952 323 L 948 329 L 928 330 Z" fill={T(LENS_HI)} />
          {/* the hair: thick, gray, swept back off the forehead, a few locks falling forward */}
          <Ink d="M 846 294 C 836 250, 856 204, 906 190 C 952 178, 1004 188, 1034 218 C 1050 234, 1058 258, 1058 282 C 1044 270, 1030 264, 1016 264 C 1026 278, 1030 294, 1028 310 C 1014 294, 998 284, 982 282 C 988 292, 990 302, 988 312 C 972 294, 950 286, 928 286 C 914 286, 900 292, 890 300 C 889 288, 883 278, 873 274 C 865 282, 857 292, 846 294 Z" fill={T(HAIR)} />
          <Ink d="M 1000 290 C 1024 302, 1038 332, 1042 356 L 1014 350 L 1006 320 Z" fill={T(HAIR)} w={3} />
          <path d="M 868 254 C 900 230, 952 222, 1004 236 M 880 276 C 912 262, 964 260, 1014 274 M 924 200 C 958 194, 996 202, 1024 222 M 986 236 C 1010 244, 1028 256, 1040 270" fill="none" stroke={T(HAIR_DARK)} strokeWidth={3} strokeLinecap="round" />
          <path d="M 904 190 C 910 176, 924 168, 938 170 M 1030 214 C 1042 208, 1054 212, 1058 222 M 1050 300 C 1060 306, 1062 318, 1058 326" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
};

/** The scientist from behind his right shoulder (the foreground of the reverse over-the-shoulder). */
export const ScientistBack: React.FC<{x: number; y: number; h: number; pose?: Pose; tint?: Tint}> = ({x, y, h, pose = {}, tint = same}) => {
  // local units: 100 = from the shoulder line to the top of the head
  const s = h / 100;
  const nod = pose.nod ?? 0;
  const T = tint;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* shoulder and hood */}
      <Ink d="M -120 70 C -90 30, -40 12, 10 14 C 60 16, 110 40, 140 80 L 150 140 L -130 140 Z" fill={T(RED)} w={1.2} />
      <path d="M 20 16 C 60 18, 100 36, 128 66 C 104 52, 70 44, 40 44 Z" fill={T(RED_DARK)} />
      <Ink d="M -40 24 C -10 6, 60 6, 80 30 C 70 48, 20 52, -30 44 Z" fill={T(RED)} w={1.2} />
      <Ink d="M -52 20 C -40 4, -10 -4, 18 -2 C 40 0, 58 6, 66 18 C 40 30, -20 34, -52 20 Z" fill={T(GAITER)} w={1.2} />
      <g transform={`rotate(${nod * 0.6} 0 0)`}>
        {/* a sliver of cheek and ear as he looks left */}
        <Ink d="M -58 -20 C -62 -44, -56 -64, -46 -74 L -38 -10 Z" fill={T(SKIN)} w={1} />
        <Ink d="M -44 -52 C -54 -52, -56 -40, -50 -32 C -47 -29, -43 -31, -42 -35 Z" fill={T(SKIN_DARK)} w={0.9} />
        {/* the back of his head: gray hair, swept, with flyaways */}
        <Ink d="M -48 -8 C -60 -40, -52 -84, -18 -98 C 20 -112, 58 -96, 66 -60 C 72 -30, 60 -2, 38 6 C 10 12, -30 10, -48 -8 Z" fill={T(HAIR)} w={1.2} />
        <path d="M -30 -80 C -10 -90, 20 -92, 44 -78 M -36 -56 C -6 -66, 30 -64, 56 -48 M -30 -30 C 0 -36, 30 -30, 54 -20" fill="none" stroke={T(HAIR_DARK)} strokeWidth={1.4} strokeLinecap="round" />
        <path d="M 30 -104 C 36 -112, 46 -114, 52 -110 M 60 -80 C 70 -84, 76 -80, 78 -74" fill="none" stroke={INK} strokeWidth={0.9} strokeLinecap="round" />
      </g>
    </g>
  );
};

// ─── the interviewer: the film's documentary director ──────────────────────
const PARKA = '#E8742E';
const PARKA_DARK = '#C85A20';
const FUR = '#F4EAD9';
const FACE_SKIN = '#E2A987';
const GOGGLE = '#3C5A7A';
const SCARF = '#2F6F8F';
const MITT = '#2C303B';

/**
 * The director, 3/4 front, facing right, sitting. Local units: the seat point at (0, 0), the top
 * of the hood at about -560. h is the seated height in px.
 */
export const Director: React.FC<{x: number; y: number; h: number; pose?: Pose; tint?: Tint}> = ({x, y, h, pose = {}, tint = same}) => {
  const s = h / 640;
  const nod = pose.nod ?? 0;
  const br = pose.breath ?? 0;
  const T = tint;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* legs, knees toward the lens and right, boots */}
      <Ink d="M -90 -20 C -20 -30, 90 -30, 160 -20 C 190 -14, 196 22, 170 30 C 90 34, -20 34, -95 30 Z" fill={T('#3B4150')} />
      <Ink d="M 150 10 L 196 12 L 204 74 L 158 74 Z" fill={T('#3B4150')} />
      <Ink d="M 146 66 L 222 66 C 236 74, 238 92, 228 100 L 140 100 C 134 88, 136 74, 146 66 Z" fill={T(BOOT)} />
      <Ink d="M -60 0 C 20 -6, 120 -2, 186 12 C 214 22, 214 56, 186 60 C 100 62, 0 58, -64 50 Z" fill={T('#3B4150')} />
      <Ink d="M 176 42 L 222 44 L 228 112 L 182 112 Z" fill={T('#3B4150')} />
      <Ink d="M 172 104 L 250 104 C 264 112, 266 130, 256 138 L 166 138 C 160 126, 162 112, 172 104 Z" fill={T(BOOT)} />
      <g transform={`translate(0 ${br * 2.5})`}>
        {/* the parka */}
        <Ink d="M -130 -330 C -90 -370, 60 -372, 110 -330 C 150 -290, 160 -160, 150 -30 C 80 -10, -60 -10, -140 -30 C -155 -150, -156 -280, -130 -330 Z" fill={T(PARKA)} />
        <path d="M -130 -330 C -156 -280, -155 -150, -140 -30 C -120 -26, -100 -22, -86 -20 C -100 -150, -100 -280, -78 -348 Z" fill={T(PARKA_DARK)} />
        <path d="M 14 -340 L 6 -20" stroke={INK} strokeWidth={3} />
        {/* the clipboard on the lap, both mitts on it */}
        <g transform="rotate(-12 60 -90)">
          <Ink d="M -20 -150 L 120 -150 L 120 -40 L -20 -40 Z" fill={T('#9A7449')} />
          <Ink d="M -8 -140 L 108 -140 L 108 -50 L -8 -50 Z" fill={T('#FFFFFF')} w={2.5} />
          <path d="M 6 -120 L 90 -120 M 6 -102 L 78 -102 M 6 -84 L 94 -84 M 6 -66 L 60 -66" stroke={T('#9AA3B5')} strokeWidth={4} strokeLinecap="round" />
          <Ink d="M 30 -160 L 70 -160 L 70 -144 L 30 -144 Z" fill={T('#B9BCC0')} w={2.5} />
        </g>
        <Ink d="M 100 -250 C 140 -220, 150 -150, 130 -110 L 90 -100 C 100 -150, 90 -200, 70 -230 Z" fill={T(PARKA)} />
        <Ink d="M 132 -118 C 150 -112, 152 -86, 132 -80 C 112 -76, 100 -96, 110 -112 Z" fill={T(MITT)} />
        <Ink d="M -90 -240 C -70 -200, -40 -140, -10 -110 L -40 -84 C -80 -120, -110 -180, -120 -228 Z" fill={T(PARKA_DARK)} />
        <Ink d="M -28 -118 C -8 -116, -2 -90, -20 -82 C -40 -76, -52 -96, -42 -110 Z" fill={T(MITT)} />
        {/* the head in its hood */}
        <g transform={`rotate(${nod} 0 -330)`}>
          <Ink d="M -130 -400 C -140 -500, -60 -566, 20 -560 C 110 -552, 160 -480, 150 -400 C 146 -350, 120 -318, 90 -300 L -80 -300 C -115 -320, -128 -360, -130 -400 Z" fill={T(PARKA)} />
          <path d="M -130 -400 C -138 -470, -100 -530, -50 -552 C -82 -500, -96 -440, -92 -380 L -80 -300 C -115 -320, -128 -360, -130 -400 Z" fill={T(PARKA_DARK)} />
          {/* fur ring round the face opening */}
          <path
            d="M 40 -530 C 70 -532, 100 -520, 118 -500 C 132 -484, 140 -462, 140 -440 C 142 -410, 134 -376, 118 -352 C 100 -326, 70 -312, 40 -312 C 10 -312, -18 -328, -34 -356 C -48 -380, -52 -412, -48 -442 C -44 -474, -26 -504, 0 -520 C 12 -527, 26 -530, 40 -530 Z"
            fill={T(FUR)}
            stroke={INK}
            strokeWidth={3.5}
            strokeDasharray="14 5"
            strokeLinejoin="round"
          />
          <Ink d="M 46 -506 C 90 -506, 124 -470, 122 -426 C 120 -382, 92 -340, 50 -336 C 10 -334, -22 -372, -24 -420 C -26 -468, 4 -506, 46 -506 Z" fill={T(FACE_SKIN)} />
          {/* goggles over the eyes */}
          <Ink d="M -18 -470 L 124 -474 C 130 -458, 126 -436, 112 -428 L -12 -424 C -24 -434, -24 -456, -18 -470 Z" fill={T(GOGGLE)} />
          <path d="M 4 -462 L 44 -463 L 40 -454 L 6 -453 Z" fill="#FFFFFF" opacity={0.7} />
          <path d="M 116 -410 C 128 -404, 130 -392, 120 -386" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          {/* the scarf, pulled up over the mouth against the cold */}
          <Ink d="M -26 -398 C 20 -410, 90 -414, 128 -398 C 134 -370, 118 -334, 84 -318 L -30 -316 C -40 -340, -38 -372, -26 -398 Z" fill={T(SCARF)} />
          <path d="M -10 -372 C 30 -380, 80 -382, 118 -370 M 0 -346 C 36 -352, 72 -352, 100 -344" fill="none" stroke={T('#245A74')} strokeWidth={4} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
};

/** The director from behind the left shoulder (the foreground of the over-the-shoulder on the scientist). */
export const DirectorBack: React.FC<{x: number; y: number; h: number; pose?: Pose; tint?: Tint}> = ({x, y, h, pose = {}, tint = same}) => {
  const s = h / 100;
  const nod = pose.nod ?? 0;
  const T = tint;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Ink d="M -150 90 C -120 40, -60 20, 0 20 C 60 20, 110 40, 130 80 L 140 150 L -160 150 Z" fill={T(PARKA)} w={1.2} />
      <path d="M -150 90 C -120 40, -70 22, -20 20 C -60 40, -90 70, -100 150 L -160 150 Z" fill={T(PARKA_DARK)} />
      <g transform={`rotate(${nod * 0.6} 0 10)`}>
        {/* the back of the hood; the fur ring shows at its right edge as he faces right */}
        <Ink d="M -70 10 C -86 -40, -70 -96, -20 -110 C 30 -122, 76 -96, 84 -52 C 90 -16, 76 12, 50 22 C 10 34, -44 30, -70 10 Z" fill={T(PARKA)} w={1.2} />
        <path d="M -70 10 C -86 -40, -72 -92, -30 -108 C -58 -80, -66 -40, -54 16 Z" fill={T(PARKA_DARK)} />
        <path d="M 70 -84 C 88 -64, 94 -30, 84 -2 C 78 12, 66 20, 56 22 C 70 0, 76 -40, 70 -84 Z" fill={T(FUR)} stroke={INK} strokeWidth={1.1} strokeDasharray="4 1.6" />
        <path d="M -20 -104 C 0 -60, 4 -20, -6 20" fill="none" stroke={INK} strokeWidth={0.9} opacity={0.6} />
      </g>
    </g>
  );
};
