import type { WeeklyGoal } from '../types';
import ProgressBar from './ProgressBar';

interface WeeklyGoalCardProps {
  goal: WeeklyGoal;
}

export default function WeeklyGoalCard({ goal }: WeeklyGoalCardProps) {
  const labsPercent = goal.labs > 0 ? Math.round((goal.labsCompleted / goal.labs) * 100) : 0;
  const assessmentsPercent = goal.assessments > 0 ? Math.round((goal.assessmentsCompleted / goal.assessments) * 100) : 0;
  const xpPercent = goal.weeklyXpTarget > 0 ? Math.round((goal.weeklyXp / goal.weeklyXpTarget) * 100) : 0;
  const overallPercent = Math.round((labsPercent + assessmentsPercent + xpPercent) / 3);

  return (
    <div className="bg-surface border border-line rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-primary">Weekly Goal</h3>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-secondary mb-1">
            <span>Labs</span>
            <span>{goal.labsCompleted}/{goal.labs}</span>
          </div>
          <ProgressBar percent={labsPercent} size="sm" showLabel={false} />
        </div>

        <div>
          <div className="flex justify-between text-xs text-secondary mb-1">
            <span>Assessments</span>
            <span>{goal.assessmentsCompleted}/{goal.assessments}</span>
          </div>
          <ProgressBar percent={assessmentsPercent} size="sm" showLabel={false} />
        </div>

        <div>
          <div className="flex justify-between text-xs text-secondary mb-1">
            <span>XP</span>
            <span>{goal.weeklyXp}/{goal.weeklyXpTarget}</span>
          </div>
          <ProgressBar percent={xpPercent} size="sm" showLabel={false} />
        </div>
      </div>

      <div className="pt-2 border-t border-line">
        <div className="flex justify-between items-center">
          <span className="text-xs text-secondary">Overall Progress</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{overallPercent}%</span>
        </div>
        <div className="mt-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-neutral-500 to-indigo-500 rounded-full h-2 transition-all duration-500"
            style={{ width: `${Math.min(overallPercent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
