import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInternTrack } from '../hooks/useInternTrack';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { ModuleStatusChip, ModuleStatusIcon } from '../components/ModuleStatusChip';
import SkeletonBlock from '../components/SkeletonBlock';
import { ChevronDown, Clock } from '../../components/Icons';
import type { ModuleConfig, ModuleState, StageConfig } from '../config/types';

function StageSection({ stage, previousStageLastModule, moduleState, defaultOpen }: {
  stage: StageConfig;
  previousStageLastModule: ModuleConfig | undefined;
  moduleState: (module: ModuleConfig, previous: ModuleConfig | undefined) => ModuleState;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const modules = stage.modules.slice().sort((a, b) => a.order - b.order);
  const doneCount = modules.filter(m => moduleState(m, undefined) === 'completed').length;

  return (
    <div className="bg-surface border border-line rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-surface-alt transition-colors"
      >
        <div>
          <h3 className="text-sm font-semibold text-primary">{stage.title}</h3>
          {stage.description && <p className="text-xs text-secondary mt-0.5">{stage.description}</p>}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {modules.length > 0 && (
            <span className="text-xs text-secondary tabular-nums">{doneCount}/{modules.length}</span>
          )}
          <ChevronDown className={`w-4 h-4 text-secondary transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        modules.length === 0 ? (
          <div className="px-5 pb-4 text-sm text-secondary">Modules for this stage aren't available yet.</div>
        ) : (
          <div className="divide-y divide-line border-t border-line">
            {modules.map((module, i) => {
              const prev = i === 0 ? previousStageLastModule : modules[i - 1];
              const state = moduleState(module, prev);
              const locked = state === 'locked';
              const content = (
                <div className="flex items-center gap-4 px-5 py-3.5">
                  <ModuleStatusIcon state={state} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-primary">
                      <span className="text-secondary tabular-nums mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                      {module.title}
                    </p>
                    {module.description && <p className="text-xs text-secondary mt-0.5 truncate">{module.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {module.estimatedMinutes && (
                      <span className="flex items-center gap-1 text-xs text-secondary">
                        <Clock className="w-3.5 h-3.5" />
                        {module.estimatedMinutes} min
                      </span>
                    )}
                    <ModuleStatusChip state={state} />
                  </div>
                </div>
              );
              return locked ? (
                <div key={module.id} className="opacity-50 cursor-not-allowed">{content}</div>
              ) : (
                <Link key={module.id} to={`/training/module/${module.id}`} className="block hover:bg-surface-alt transition-colors">
                  {content}
                </Link>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

export default function LearningPath() {
  const { user } = useAuth();
  const { track, loading } = useInternTrack(user?.id);
  const progress = useTrainingProgress(user?.id, track ?? { forte: 'General', trackName: '', description: '', stages: [] });

  if (loading || !track) {
    return (
      <div className="space-y-4">
        <SkeletonBlock className="h-16" />
        <SkeletonBlock className="h-16" />
        <SkeletonBlock className="h-16" />
      </div>
    );
  }

  const stages = track.stages.slice().sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-accent uppercase tracking-wider mb-1">{track.trackName}</p>
        <h1 className="text-2xl font-bold text-primary">Learning Path</h1>
        <p className="text-sm text-secondary mt-1">Your structured roadmap from foundation to graduation.</p>
      </div>

      <div className="space-y-3">
        {stages.map((stage, i) => {
          const prevStage = i > 0 ? stages[i - 1] : undefined;
          const prevStageModules = prevStage?.modules.slice().sort((a, b) => a.order - b.order);
          const previousStageLastModule = prevStageModules?.[prevStageModules.length - 1];
          return (
            <StageSection
              key={stage.id}
              stage={stage}
              previousStageLastModule={previousStageLastModule}
              moduleState={progress.moduleState}
              defaultOpen={i === 0 || stage.id === progress.currentStage?.id}
            />
          );
        })}
      </div>
    </div>
  );
}
