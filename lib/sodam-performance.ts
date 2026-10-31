import type { SodamPose } from './sodam-poses';

// r2 (docs/sodam-performance-r2.md): every file is cut once from the 1440 px originals with a smoothed,
// codec-square-free outline. Large files serve the received invitation (up to 340 CSS px, 280 px on
// 3x phones); home files serve the 176 CSS px companion at the 384 px of the 3D poses it alternates with.
// Each poster matches its animation's size, so the swap from still to motion keeps the same sharpness.
export const SODAM_PERFORMANCES = {
  welcome: '/media/sodam-performance-r2/Sodam-welcome-home-r2.webp',
  listen: '/media/sodam-performance-r2/Sodam-listen-home-r2.webp',
  dance: '/media/sodam-dance-r2/Sodam-dance-149bpm-r2.webp',
} as const;

export const SODAM_LARGE_PERFORMANCES = {
  welcome: '/media/sodam-performance-r2/Sodam-welcome-r2.webp',
  listen: '/media/sodam-performance-r2/Sodam-listen-r2.webp',
} as const;

export const SODAM_SOUND = '/media/sodam-performance-r1/Sodam-wordless-r1.mp3';
export const SODAM_POSTERS = {
  welcome: '/media/sodam-performance-r2/Sodam-welcome-home-poster-r2.webp',
  listen: '/media/sodam-performance-r2/Sodam-listen-home-poster-r2.webp',
} as const;
export const SODAM_LARGE_POSTERS = {
  welcome: '/media/sodam-performance-r2/Sodam-welcome-poster-r2.webp',
  listen: '/media/sodam-performance-r2/Sodam-listen-poster-r2.webp',
} as const;
export type SodamPerformance = keyof typeof SODAM_PERFORMANCES;

/** Interface state, never an inference about the visitor's feelings. */
export function companionPose(state: {
  supportOnly: boolean; error: boolean; loading: boolean; speaking: boolean;
  isWriting: boolean; hasDraft: boolean; open: boolean; hasAnswer: boolean; product?: boolean;
}): SodamPose {
  if (state.supportOnly) return 'listening';
  if (state.error) return 'oops';
  if (state.loading) return 'waiting';
  if (state.isWriting) return state.hasDraft ? 'writing' : 'listening';
  if (state.speaking || state.open) return 'listening';
  if (state.product) return 'deliver';
  if (state.hasAnswer) return 'listening';
  if (state.hasDraft) return 'thinking';
  return 'welcome';
}
