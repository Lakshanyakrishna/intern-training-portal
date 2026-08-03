// [Placeholder] Program-wide stats shown to every applicant regardless of
// their own journey stage. Real data would come from an aggregate query
// over opportunities/departments/applications once those exist at scale.
import type { QuickStat } from '../types';

export const MOCK_QUICK_STATS: QuickStat[] = [
  { id: 'opportunities', icon: 'briefcase', value: '24', label: 'Open Opportunities', linkLabel: 'Explore now' },
  { id: 'departments', icon: 'users', value: '4', label: 'Departments', linkLabel: 'Find your fit' },
  { id: 'review-time', icon: 'clock', value: '3 Days', label: 'Average review time', linkLabel: 'Quick response' },
  { id: 'placement', icon: 'award', value: '95%', label: 'Placement rate', linkLabel: 'Our promise' },
];
