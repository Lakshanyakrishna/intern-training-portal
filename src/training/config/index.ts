import type { OpportunityForte } from '../../lib/db';
import type { TrainingTrackConfig } from './types';
import { frontendTrack } from './frontend';
import { backendTrack } from './backend';
import { aiTrack } from './ai';
import { mobileTrack } from './mobile';
import { uiuxTrack } from './uiux';
import { generalTrack } from './general';

export * from './types';
export { frontendTrack, backendTrack, aiTrack, mobileTrack, uiuxTrack, generalTrack };
// qa.ts is exported but deliberately not registered below -- see its own
// file comment (no real 'QA' opportunity forte exists yet).
export { qaTrack } from './qa';

// The one place a forte maps to its track. Adding a new forte's config
// later means adding one entry here -- nothing else in src/training/
// ever branches on a forte name directly.
const REGISTRY: Record<OpportunityForte, TrainingTrackConfig> = {
  'Frontend': frontendTrack,
  'Backend': backendTrack,
  'Agentic AI': aiTrack,
  'Mobile Development': mobileTrack,
  'UI / UX Design': uiuxTrack,
};

export function getTrainingTrackForForte(forte: OpportunityForte | null | undefined): TrainingTrackConfig {
  if (forte && REGISTRY[forte]) return REGISTRY[forte];
  return generalTrack;
}
