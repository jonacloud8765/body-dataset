export type HeadId = 'own' | 'frown' | 'sideeye' | 'smirk' | 'annoyed' | 'profile' | 'laugh' | 'sad' | 'surprised' | 'angry';
export type BodyId = '34' | 'front';

export type Vec = [number, number];

/**
 * Everything that moves, in the body frame (sheet px). Undefined = rest pose.
 * Legs are placed by where the ankles go; knees are solved.
 */
export type RigPose = {
  /** pelvis offset (moves hips, torso and head) */
  pelvis?: Vec;
  /** upper body lean in degrees, around the hips (positive = toward facing) */
  lean?: number;
  /** extra rotation of the head around the neck, degrees */
  headTilt?: number;
  /** ankle positions, far/near (3/4 view) or L/R (front view) */
  ankleA?: Vec;
  ankleB?: Vec;
  /** foot rotations in degrees (toe down positive) */
  footA?: number;
  footB?: number;
  /** squash & stretch of the upper body (1 = rest) */
  squash?: number;
  /** whole-figure rotation around the pelvis, degrees (falls, slides, dives) */
  spin?: number;
  /** near flipper swing at the shoulder, degrees (positive swings the tip back) */
  flipper?: number;
};
