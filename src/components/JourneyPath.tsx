import type { JourneyStage } from '../types';

interface JourneyPathProps {
  stages: JourneyStage[];
  completedStages: string[];
  onCompleteStage: (stageId: string) => void;
}

export default function JourneyPath({ stages, completedStages, onCompleteStage }: JourneyPathProps) {
  return (
    <div className="relative">
      {stages.map((stage, index) => {
        const isCompleted = completedStages.includes(stage.id);
        const isCurrent = !isCompleted && (index === 0 || completedStages.includes(stages[index - 1]?.id ?? ''));
        const isLocked = !isCompleted && !isCurrent;

        return (
          <div key={stage.id} className="flex items-start gap-4 pb-8 last:pb-0 relative">
            {index < stages.length - 1 && (
              <div className={`absolute left-3.5 top-8 w-0.5 h-full -z-0 ${
                isCompleted
                  ? 'bg-green-400 dark:bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`} />
            )}
            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm z-10 transition-colors ${
              isCompleted
                ? 'bg-green-500 text-white'
                : isCurrent
                  ? 'bg-neutral-500 text-white ring-4 ring-neutral-200 dark:ring-neutral-800'
                  : 'bg-gray-300 dark:bg-gray-600 text-secondary'
            }`}>
              {isCompleted ? '✓' : index + 1}
            </div>
            <div className={`flex-1 min-w-0 ${isLocked ? 'opacity-50' : ''}`}>
              <div className={`rounded-xl p-3 border transition-colors ${
                isCompleted
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : isCurrent
                    ? 'bg-neutral-50 dark:bg-neutral-900/20 border-neutral-200 dark:border-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900/30'
                    : 'bg-surface-alt border-line'
              }`}
                onClick={() => isCurrent && onCompleteStage(stage.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stage.icon}</span>
                  <span className={`text-sm font-medium ${
                    isCompleted
                      ? 'text-green-800 dark:text-green-200'
                      : isCurrent
                        ? 'text-neutral-800 dark:text-neutral-200'
                        : 'text-secondary'
                  }`}>{stage.title}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
