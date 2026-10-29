import type { SodamPose } from './sodam-poses';

export const SODAM_PERFORMANCES = {
  welcome: '/media/sodam-performance-r1/Sodam-welcome-home-r1.webp',
  listen: '/media/sodam-performance-r1/Sodam-listen-home-r1.webp',
  dance: '/media/sodam-dance-r1/Sodam-dance-149bpm-r1.webp',
} as const;

export const SODAM_LARGE_PERFORMANCES = {
  welcome: '/media/sodam-performance-r1/Sodam-welcome-r1.webp',
  listen: '/media/sodam-performance-r1/Sodam-listen-r1.webp',
} as const;

export const SODAM_SOUND = '/media/sodam-performance-r1/Sodam-wordless-r1.mp3';
export const SODAM_POSTERS = {
  welcome: '/media/sodam-performance-r1/Sodam-welcome-poster-r1.webp',
  listen: '/media/sodam-performance-r1/Sodam-listen-poster-r1.webp',
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
