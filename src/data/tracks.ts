import type { Module } from '../types';

export interface TrackDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  moduleIds: string[];
}

export const tracks: TrackDef[] = [
  {
    id: 'foundation',
    name: 'Foundation Track',
    icon: 'foundation',
    description: 'Core developer skills — version control and API fundamentals.',
    moduleIds: ['git', 'api'],
  },
  {
    id: 'development',
    name: 'Development Track',
    icon: 'development',
    description: 'Build quality software with AI, testing, debugging, and code review.',
    moduleIds: ['ai', 'testing', 'debugging', 'code-review'],
  },
  {
    id: 'project',
    name: 'Project Track',
    icon: 'project',
    description: 'Ship and maintain real applications with deployment, databases, and communication.',
    moduleIds: ['deployment', 'supabase', 'communication'],
  },
  {
    id: 'final',
    name: 'Final Track',
    icon: 'final',
    description: 'Prove your readiness with the capstone project and final review.',
    moduleIds: ['capstone'],
  },
];

export function getModulesForTrack(trackId: string, allModules: Module[]): Module[] {
  const track = tracks.find(t => t.id === trackId);
  if (!track) return [];
  return track.moduleIds
    .map(id => allModules.find(m => m.id === id))
    .filter((m): m is Module => m !== undefined);
}

export function getTrackProgress(trackId: string, getModuleProgress: (id: string) => { percent: number; completed: number; total: number }): { completed: number; total: number; percent: number } {
  const track = tracks.find(t => t.id === trackId);
  if (!track) return { completed: 0, total: 0, percent: 0 };
  const mods = track.moduleIds.filter(id => id !== 'capstone');
  const total = mods.length;
  const completed = mods.filter(id => getModuleProgress(id).percent >= 80).length;
  return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
}
