import { CheckCircle, XCircle } from '../../components/Icons';
import { JOURNEY_STEPS, STAGE_STEP_INDEX } from '../mock/journey';
import type { Stage } from '../types';

// The one element that never disappears -- always visible, always answers
// "where am I." Two independent layouts (not a single flex-wrap) so the
// horizontal desktop connectors and the vertical mobile connectors can each
// use the right axis instead of fighting a shared one.
export default function JourneyTracker({ stage }: { stage: Stage }) {
  const current = STAGE_STEP_INDEX[stage];
  const isRejected = stage === 'rejected';

  return (
    <nav aria-label="Application journey" className="bg-surface border border-line rounded-2xl shadow-sm shadow-black/[0.03] p-5 sm:p-6">
      {/* Desktop / tablet: horizontal */}
      <ol className="hidden sm:flex items-start">
        {JOURNEY_STEPS.map((step, i) => {
          const done = i < current;
          const active = !isRejected && i === current;
          const rejectedHere = isRejected && i === current;
          return (
            <li key={step.id} className={`flex items-center ${i < JOURNEY_STEPS.length - 1 ? 'flex-1' : ''}`}>
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    rejectedHere ? 'bg-red-500 border-red-500 text-white' :
                    done ? 'bg-accent border-accent text-accent-text' :
                    active ? 'border-accent text-accent bg-surface scale-110 shadow-sm' :
                    'border-line text-secondary bg-surface'
                  }`}
                >
                  {rejectedHere ? <XCircle className="w-4 h-4" /> : done ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-semibold">{i + 1}</span>}
                </div>
                <span className={`text-xs font-medium text-center w-20 transition-colors ${done || active || rejectedHere ? 'text-primary' : 'text-secondary'}`}>
                  {step.label}
                </span>
              </div>
              {i < JOURNEY_STEPS.length - 1 && (
                <div className="h-0.5 flex-1 mx-1 mb-5 bg-line overflow-hidden">
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
          const done = i < current;
          const active = !isRejected && i === current;
          const rejectedHere = isRejected && i === current;
          const last = i === JOURNEY_STEPS.length - 1;
          return (
            <li key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 ${
                    rejectedHere ? 'bg-red-500 border-red-500 text-white' :
                    done ? 'bg-accent border-accent text-accent-text' :
                    active ? 'border-accent text-accent bg-surface scale-110' :
                    'border-line text-secondary bg-surface'
                  }`}
                >
                  {rejectedHere ? <XCircle className="w-3.5 h-3.5" /> : done ? <CheckCircle className="w-3.5 h-3.5" /> : <span className="text-[11px] font-semibold">{i + 1}</span>}
                </div>
                {!last && (
                  <div className="w-0.5 flex-1 min-h-6 bg-line overflow-hidden">
                    <div className="w-full bg-accent transition-all duration-500 ease-out" style={{ height: i < current ? '100%' : '0%' }} />
                  </div>
                )}
              </div>
              <span className={`text-sm font-medium pb-6 pt-1 ${done || active || rejectedHere ? 'text-primary' : 'text-secondary'}`}>
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
