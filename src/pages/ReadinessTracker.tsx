import { useProgress } from '../hooks/useProgress';
import { Link } from 'react-router-dom';
import { BookOpen, Target, BarChart3, Code, MessageSquare, Award, Zap, XCircle, ArrowRight, Grid } from '../components/Icons';

const skillModules = [
  { skill: 'Git & GitHub', moduleId: 'git', icon: 'code', track: 'Foundation' },
  { skill: 'API Integration', moduleId: 'api', icon: 'grid', track: 'Foundation' },
  { skill: 'AI-Assisted Dev', moduleId: 'ai', icon: 'zap', track: 'Development' },
  { skill: 'Testing & QA', moduleId: 'testing', icon: 'award', track: 'Development' },
  { skill: 'Debugging', moduleId: 'debugging', icon: 'xcircle', track: 'Development' },
  { skill: 'Code Review', moduleId: 'code-review', icon: 'code', track: 'Development' },
  { skill: 'Deployment', moduleId: 'deployment', icon: 'arrowright', track: 'Project' },
  { skill: 'Supabase', moduleId: 'supabase', icon: 'grid', track: 'Project' },
  { skill: 'Communication', moduleId: 'communication', icon: 'messagesquare', track: 'Project' },
];

function getSkillLevel(percent: number): { label: string; color: string; bg: string; bar: string } {
  if (percent === 0) return { label: 'Not Started', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-700', bar: 'bg-gray-400' };
  if (percent < 40) return { label: 'Learning', color: 'text-accent', bg: 'bg-neutral-100 dark:bg-neutral-900/20', bar: 'bg-neutral-500' };
  if (percent < 80) return { label: 'Practicing', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/20', bar: 'bg-amber-500' };
  return { label: 'Complete', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/20', bar: 'bg-green-500' };
}

const tracks = ['Foundation', 'Development', 'Project'];
const trackColors: Record<string, string> = {
  Foundation: 'text-accent',
  Development: 'text-purple-600 dark:text-purple-400',
  Project: 'text-emerald-600 dark:text-emerald-400',
};

const iconModules: Record<string, React.ReactNode> = {
  code: <Code className="w-5 h-5" />,
  grid: <Grid className="w-5 h-5" />,
  zap: <Zap className="w-5 h-5" />,
  award: <Award className="w-5 h-5" />,
  xcircle: <XCircle className="w-5 h-5" />,
  arrowright: <ArrowRight className="w-5 h-5" />,
  messagesquare: <MessageSquare className="w-5 h-5" />,
};

export default function TrainingStatus() {
  const { progress, getModuleProgress } = useProgress();

  const trainingDayCount = (() => {
    if (!progress.trainingStartDate) return 1;
    const diff = Math.floor((new Date().getTime() - new Date(progress.trainingStartDate).getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff + 1);
  })();

  const completedCount = skillModules.filter(s => getModuleProgress(s.moduleId).percent >= 80).length;

  const windowStatus = (() => {
    if (trainingDayCount < 18) return { label: 'Early Track', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/30', note: 'Completing before day 18 requires mandatory mentor review' };
    if (trainingDayCount <= 30) return { label: 'On Track', color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/30', note: 'You are within the 18–30 day eligibility window' };
    return { label: 'Extended', color: 'text-secondary', bg: 'bg-gray-100 dark:bg-gray-800', note: 'Training completed beyond 30 days — certificate only' };
  })();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl"><BarChart3 className="w-8 h-8 inline-block" /></span>
        <div>
          <h1 className="text-2xl font-bold text-primary">Training Status</h1>
          <p className="text-sm text-secondary">Your skill progress across all training modules</p>
        </div>
      </div>

      {/* Training Timeline */}
      <div className="bg-surface border border-line rounded-2xl p-6">
        <h2 className="font-semibold text-primary mb-4">Training Timeline</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">{trainingDayCount}</p>
            <p className="text-xs text-secondary">Day of Training</p>
          </div>
          <div className="flex-1 min-w-48">
            <div className="flex items-center justify-between text-xs text-secondary mb-1">
              <span>Day 1</span>
              <span className="text-green-600 dark:text-green-400">18 days</span>
              <span className="text-amber-600 dark:text-amber-400">30 days</span>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="absolute left-0 h-full bg-green-400 dark:bg-green-600 rounded-full" style={{ width: '60%' }} />
              <div className="absolute left-[60%] h-full bg-amber-300 dark:bg-amber-700 rounded-full" style={{ width: '40%' }} />
              <div
                className="absolute top-0 h-full w-1 bg-gray-800 dark:bg-white rounded"
                style={{ left: `${Math.min((trainingDayCount / 35) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-green-600 dark:text-green-400">Eligible window: 18–30 days</span>
            </div>
          </div>
          <div>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${windowStatus.bg} ${windowStatus.color}`}>{windowStatus.label}</span>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[160px]">{windowStatus.note}</p>
          </div>
        </div>
      </div>

      {/* Module Progress Overview */}
      <div className="bg-surface border border-line rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-primary">Overall Completion</h2>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{completedCount}/{skillModules.length}</span>
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-neutral-500 via-purple-500 to-emerald-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${(completedCount / skillModules.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {completedCount >= skillModules.length
            ? 'All modules complete! Proceed to Capstone.'
            : `${skillModules.length - completedCount} modules remaining`}
        </p>
      </div>

      {/* Mentor Feedback (visible to intern) */}
      {progress.mentorFeedback.length > 0 && (
        <div className="bg-neutral-50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <h2 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-3">Mentor Feedback</h2>
          <div className="space-y-3">
            {progress.mentorFeedback.map((fb, i) => (
              <div key={i} className="bg-surface rounded-xl p-4 border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{fb.date} · {fb.module}</span>
                  <span className="text-xs font-bold text-accent">{fb.score}/10</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{fb.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Breakdown by Track */}
      {tracks.map(track => {
        const trackModules = skillModules.filter(s => s.track === track);
        return (
          <div key={track} className="space-y-3">
            <h2 className={`font-semibold text-sm uppercase tracking-wide ${trackColors[track]}`}>{track} Track</h2>
            {trackModules.map(sm => {
              const mp = getModuleProgress(sm.moduleId);
              const level = getSkillLevel(mp.percent);
              return (
                <Link
                  key={sm.moduleId}
                  to={`/module/${sm.moduleId}`}
                  className="block bg-surface border border-line rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{iconModules[sm.icon]}</span>
                    <span className="flex-1 font-medium text-primary text-sm">{sm.skill}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${level.bg} ${level.color}`}>
                      {level.label}
                    </span>
                    <span className="text-xs font-bold text-secondary">{mp.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${level.bar} rounded-full h-2 transition-all duration-500`}
                      style={{ width: `${mp.percent}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        );
      })}

      {/* Final status */}
      <div className="bg-gradient-to-br from-slate-800 to-indigo-900 rounded-2xl p-6 text-white text-center">
        <span className="text-4xl">{completedCount >= skillModules.length ? <Target className="w-8 h-8 inline-block" /> : <BookOpen className="w-8 h-8 inline-block" />}</span>
        <h2 className="text-lg font-semibold mt-2">
          {completedCount >= skillModules.length ? 'Modules Complete — Proceed to Capstone' : 'Keep Going'}
        </h2>
        <p className="text-sm text-neutral-200 mt-1 max-w-sm mx-auto">
          {completedCount >= skillModules.length
            ? 'Complete the Capstone project and submit for mentor review to become project eligible.'
            : `${skillModules.length - completedCount} module${skillModules.length - completedCount !== 1 ? 's' : ''} remaining. Complete all modules to unlock the Capstone.`}
        </p>
        {completedCount >= skillModules.length && (
          <Link
            to="/capstone"
            className="mt-4 inline-block px-6 py-2.5 bg-white text-indigo-800 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-sm"
          >
            Go to Capstone →
          </Link>
        )}
      </div>
    </div>
  );
}
