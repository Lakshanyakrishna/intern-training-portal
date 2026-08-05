// [Placeholder] Program-wide stats shown to every applicant regardless of
// their own journey stage. Real data would come from an aggregate query
// over opportunities/departments/applications once those exist at scale.
//
// Opportunities/Departments counts are derived from MOCK_OPPORTUNITIES
// itself rather than hardcoded -- a stat card that sends someone to a page
// showing a different number than the one they just read is worse than no
// link at all.
import type { QuickStat } from '../types';
import { MOCK_OPPORTUNITIES } from './opportunities';

const openOpportunityCount = MOCK_OPPORTUNITIES.length;
const departmentCount = new Set(MOCK_OPPORTUNITIES.map(o => o.category)).size;

export const MOCK_QUICK_STATS: QuickStat[] = [
  { id: 'opportunities', icon: 'briefcase', value: String(openOpportunityCount), label: 'Open Opportunities', linkLabel: 'Explore now', action: { type: 'link', href: '/applicant/opportunities' } },
  { id: 'departments', icon: 'users', value: String(departmentCount), label: 'Departments', linkLabel: 'Find your fit', action: { type: 'link', href: '/applicant/opportunities', state: { focusFilters: true } } },
  { id: 'review-time', icon: 'clock', value: '1–3 Days', label: 'Average review time', linkLabel: 'Quick response', action: { type: 'scroll', targetId: 'estimated-timeline' } },
  { id: 'placement', icon: 'award', value: '95%', label: 'Placement rate', linkLabel: 'Our promise', action: { type: 'link', href: '/about#stats' } },
];
