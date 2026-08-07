import type { DbOpportunity } from '../../lib/db';
import type { Opportunity } from '../types';

// Bridges the real opportunities table to the applicant UI's Opportunity
// shape (OpportunityCard, BrowseOpportunities, the dashboard's "next up"
// cards). `category` here is the forte ('Frontend', 'Backend', ...) --
// DbOpportunity.category is a different, unrelated field (internship /
// training / fellowship / project) and must not be confused with it, since
// this is exactly the value useInternTrack later reads back out via the
// application's opportunity_id to pick the intern's training track.
//
// skills and image have no real column yet -- they render through
// OpportunityCard's existing empty/placeholder handling rather than being
// faked here. duration and deadline are computed only from real
// startDate/endDate; there's no separate application-deadline column in
// the schema, so this never fabricates one.
export function mapDbOpportunityToApplicant(o: DbOpportunity): Opportunity {
  return {
    id: o.id,
    title: o.title,
    description: o.description,
    skills: [],
    duration: formatDuration(o.startDate, o.endDate),
    seats: o.slots ?? 0,
    deadline: formatDeadline(o.endDate),
    category: o.forte ?? 'General',
    image: undefined,
  };
}

function formatDuration(startDate?: string, endDate?: string): string {
  if (!startDate || !endDate) return 'Not specified';
  const days = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Not specified';
  const weeks = Math.round(days / 7);
  return `${weeks} week${weeks === 1 ? '' : 's'}`;
}

function formatDeadline(endDate?: string): string {
  if (!endDate) return 'Not specified';
  return new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
