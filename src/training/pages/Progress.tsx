import { useAuth } from '../../contexts/AuthContext';
import { useInternTrack } from '../hooks/useInternTrack';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { flattenModules } from '../config/types';
import ProgressRing from '../components/ProgressRing';
import StatCard from '../components/StatCard';
import SkeletonBlock from '../components/SkeletonBlock';
import { BookOpen, Calendar, CheckCircle, ClipboardCheck, Code, Zap } from '../../components/Icons';

export default function TrainingProgress() {
  const { user } = useAuth();
  const { track, loading } = useInternTrack(user?.id);
  const progress = useTrainingProgress(user?.id, track ?? { forte: 'General', trackName: '', description: '', stages: [] });

  if (loading || !track) {
    return (
      <div className="space-y-4">
        <SkeletonBlock className="h-40" />
        <SkeletonBlock className="h-64" />
      </div>
    );
  }

  const flat = flattenModules(track);
  const totalLessons = flat.reduce((sum, { module }) => sum + module.lessons.length, 0);
  const doneLessons = flat.reduce((sum, { module }) => sum + progress.getModuleProgress(module.id).completedLessonIds.length, 0);
  const totalPractice = flat.reduce((sum, { module }) => sum + module.practice.length, 0);
  const donePractice = flat.reduce((sum, { module }) => sum + progress.getModuleProgress(module.id).completedPracticeIds.length, 0);
  const totalAssessments = flat.filter(({ module }) => module.assessment).length;
  const passedAssessments = flat.filter(({ module }) => module.assessment && progress.getModuleProgress(module.id).assessmentPassed).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Progress</h1>
        <p className="text-sm text-secondary mt-1">{track.trackName}</p>
      </div>

      <div className="bg-surface border border-line rounded-xl p-6 flex items-center gap-6 flex-wrap">
        <ProgressRing percent={progress.overallPercent} size={88} strokeWidth={6} />
        <div>
          <p className="text-sm font-semibold text-primary">Overall completion</p>
          <p className="text-xs text-secondary mt-1">{progress.doneCount} of {progress.totalCount} modules complete</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<BookOpen className="w-4 h-4" />} label="Lessons Completed" value={`${doneLessons}/${totalLessons}`} />
        <StatCard icon={<Code className="w-4 h-4" />} label="Practice Completed" value={`${donePractice}/${totalPractice}`} />
        <StatCard icon={<ClipboardCheck className="w-4 h-4" />} label="Assessments Passed" value={`${passedAssessments}/${totalAssessments}`} />
        <StatCard icon={<Zap className="w-4 h-4" />} label="Current XP" value={progress.progress.xp} />
      </div>

      {/* Module completion breakdown */}
      <div className="bg-surface border border-line rounded-xl p-5">
        <h2 className="text-sm font-semibold text-primary mb-3">Module Completion</h2>
        <div className="space-y-3">
          {flat.map(({ module }, i) => {
            const mp = progress.getModuleProgress(module.id);
            const total = module.lessons.length + module.practice.length + (module.assessment ? 1 : 0);
            const done = mp.completedLessonIds.length + mp.completedPracticeIds.length + (mp.assessmentPassed ? 1 : 0);
            const percent = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div key={module.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-secondary truncate">{i + 1}. {module.title}</span>
                  <span className="text-primary font-medium tabular-nums shrink-0 ml-2">{percent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-alt overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly progress */}
      <div className="bg-surface border border-line rounded-xl p-5">
        <h2 className="text-sm font-semibold text-primary mb-3">Weekly Progress</h2>
        <div className="space-y-3">
          {progress.progress.weeklyGoals.map(goal => (
            <div key={goal.id} className="flex items-center gap-3">
              <CheckCircle className={`w-4 h-4 shrink-0 ${goal.current >= goal.target ? 'text-accent' : 'text-secondary'}`} />
              <span className="text-sm text-primary flex-1">{goal.label}</span>
              <span className="text-xs text-secondary tabular-nums">{goal.current}/{goal.target}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Training calendar -- placeholder */}
      <div className="bg-surface border border-line rounded-xl p-5">
        <h2 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-secondary" />
          Training Calendar
        </h2>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-md bg-surface-alt" />
          ))}
        </div>
        <p className="text-xs text-secondary mt-3">Daily activity will be shown here once real progress events exist.</p>
      </div>
    </div>
  );
}
