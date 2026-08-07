import type { ModuleState } from '../config/types';
import { CheckCircle, Circle, Lock } from '../../components/Icons';

const LABELS: Record<ModuleState, string> = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  'not-started': 'Not Started',
  locked: 'Locked',
};

const STYLES: Record<ModuleState, string> = {
  completed: 'bg-accent/10 text-accent',
  'in-progress': 'bg-accent/10 text-accent',
  'not-started': 'bg-surface-alt text-secondary',
  locked: 'bg-surface-alt text-secondary',
};

export function ModuleStatusChip({ state }: { state: ModuleState }) {
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STYLES[state]}`}>
      {LABELS[state]}
    </span>
  );
}

export function ModuleStatusIcon({ state, className = 'w-5 h-5' }: { state: ModuleState; className?: string }) {
  if (state === 'completed') return <CheckCircle className={`${className} text-accent`} />;
  if (state === 'locked') return <Lock className={`${className} text-secondary`} />;
  return <Circle className={`${className} text-secondary`} />;
}
