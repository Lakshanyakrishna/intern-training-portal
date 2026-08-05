import { CheckCircle, XCircle } from '../../components/Icons';
import { JOURNEY_STEPS, STAGE_STEP_INDEX } from '../mock/journey';
import type { Stage } from '../types';

type StepState = 'done' | 'active' | 'rejected' | 'upcoming';

const STATUS_LABEL: Record<StepState, string> = {
  done: 'Completed',
  active: 'In progress',
  rejected: 'Not selected',
  upcoming: 'Pending',
};

function stepState(i: number, current: number, isRejected: boolean): StepState {
  if (isRejected && i === current) return 'rejected';
  if (i < current) return 'done';
  if (i === current) return 'active';
  return 'upcoming';
}

// The one element that never disappears -- always visible, always answers
// "where am I." Two independent layouts (not a single flex-wrap) so the
// horizontal desktop connectors and the vertical mobile connectors can each
// use the right axis instead of fighting a shared one.
export default function JourneyTracker({ stage }: { stage: Stage }) {
  const current = STAGE_STEP_INDEX[stage];
  const isRejected = stage === 'rejected';

  return (
    <nav aria-label="Application journey" className="bg-surface border border-line rounded-2xl shadow-sm shadow-black/[0.03] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          Application Progress
        </span>
        <span className="text-xs font-medium text-secondary tabular-nums">
          Step {Math.min(current + 1, JOURNEY_STEPS.length)} of {JOURNEY_STEPS.length}
        </span>
      </div>

      {/* Desktop / tablet: horizontal */}
      <ol className="hidden sm:flex items-start">
        {JOURNEY_STEPS.map((step, i) => {
          const state = stepState(i, current, isRejected);
          return (
            <li key={step.id} className={`flex items-center ${i < JOURNEY_STEPS.length - 1 ? 'flex-1' : ''}`}>
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    state === 'rejected' ? 'bg-red-500 border-red-500 text-white' :
                    state === 'done' ? 'bg-accent border-accent text-accent-text' :
                    state === 'active' ? 'border-accent text-accent bg-surface shadow-[0_0_0_4px_var(--color-surface-alt)]' :
                    'border-line text-secondary bg-surface'
                  }`}
                >
                  {state === 'rejected' ? <XCircle className="w-4 h-4" /> : state === 'done' ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className={`text-xs font-medium text-center w-20 transition-colors ${state === 'upcoming' ? 'text-secondary' : 'text-primary'}`}>
                    {step.label}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide text-center w-20 ${
                    state === 'rejected' ? 'text-red-500' :
                    state === 'active' ? 'text-accent' :
                    'text-secondary'
                  }`}>
                    {STATUS_LABEL[state]}
                  </span>
                </div>
              </div>
              {i < JOURNEY_STEPS.length - 1 && (
                <div className="h-[3px] flex-1 mx-1 mb-8 bg-line overflow-hidden rounded-full">
                  <div
                    className="h-full bg-accent transition-all duration-500 ease-out"
                    style={{ width: i < current ? '100%' : '0%' }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile: vertical */}
      <ol className="sm:hidden space-y-0">
        {JOURNEY_STEPS.map((step, i) => {
          const state = stepState(i, current, isRejected);
          const last = i === JOURNEY_STEPS.length - 1;
          return (
            <li key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 ${
                    state === 'rejected' ? 'bg-red-500 border-red-500 text-white' :
                    state === 'done' ? 'bg-accent border-accent text-accent-text' :
                    state === 'active' ? 'border-accent text-accent bg-surface shadow-[0_0_0_4px_var(--color-surface-alt)]' :
                    'border-line text-secondary bg-surface'
                  }`}
                >
                  {state === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> : state === 'done' ? <CheckCircle className="w-3.5 h-3.5" /> : <span className="text-[11px] font-bold">{i + 1}</span>}
                </div>
                {!last && (
                  <div className="w-[3px] flex-1 min-h-6 bg-line overflow-hidden rounded-full">
                    <div className="w-full bg-accent transition-all duration-500 ease-out" style={{ height: i < current ? '100%' : '0%' }} />
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-2 pb-6 pt-1">
                <span className={`text-sm font-medium ${state === 'upcoming' ? 'text-secondary' : 'text-primary'}`}>
                  {step.label}
                </span>
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                  state === 'rejected' ? 'text-red-500' :
                  state === 'active' ? 'text-accent' :
                  'text-secondary'
                }`}>
                  {STATUS_LABEL[state]}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
