import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInternTrack } from '../hooks/useInternTrack';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import ProgressRing from '../components/ProgressRing';
import StatCard from '../components/StatCard';
import SkeletonBlock from '../components/SkeletonBlock';
import { MOCK_MENTOR } from '../mock/mentor';
import { MOCK_ACHIEVEMENTS } from '../mock/achievements';
import {
  ArrowRight, Award, BookOpen, Calendar, CheckCircle, Circle, Flag, Trophy, Users, Zap,
} from '../../components/Icons';

export default function TrainingDashboard() {
  const { user } = useAuth();
  const { track, loading: trackLoading } = useInternTrack(user?.id);
  const progress = useTrainingProgress(user?.id, track ?? { forte: 'General', trackName: '', description: '', stages: [] });

  if (trackLoading || !track) {
    return (
      <div className="space-y-6">
        <SkeletonBlock className="h-40" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SkeletonBlock className="h-20" />
          <SkeletonBlock className="h-20" />
          <SkeletonBlock className="h-20" />
          <SkeletonBlock className="h-20" />
        </div>
        <SkeletonBlock className="h-64" />
      </div>
    );
  }

  const earnedAchievements = MOCK_ACHIEVEMENTS.filter(a => a.earned);

  return (
    <div className="space-y-6">
      {/* Welcome + assigned internship + overall progress */}
      <div className="relative overflow-hidden rounded-2xl bg-sidebar-bg text-sidebar-text px-6 py-7 sm:px-8 sm:py-8 shadow-lg shadow-black/10">
        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sidebar-text-secondary mb-1.5">
              {track.trackName}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              {user?.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome back'}
            </h1>
            <p className="text-sm text-sidebar-text-secondary mt-2 max-w-md">{track.description}</p>
          </div>
          <ProgressRing percent={progress.overallPercent} size={72} strokeWidth={5} />
        </div>
      </div>

      {/* Continue learning */}
      {progress.currentModule ? (
        <Link
          to={`/training/module/${progress.currentModule.id}`}
          className="group flex items-center gap-4 rounded-xl border border-line bg-surface p-5 hover:border-accent/40 transition-colors"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-0.5">
              {progress.currentStage?.title} · Continue Learning
            </p>
            <p className="text-sm font-semibold text-primary truncate">{progress.currentModule.title}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-secondary group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
      ) : (
        <div className="rounded-xl border border-line bg-surface p-5 text-center">
          <CheckCircle className="w-6 h-6 text-accent mx-auto mb-2" />
          <p className="text-sm font-medium text-primary">All assigned modules complete</p>
        </div>
      )}

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<CheckCircle className="w-4 h-4" />} label="Modules Completed" value={`${progress.doneCount}/${progress.totalCount}`} />
        <StatCard icon={<Zap className="w-4 h-4" />} label="XP" value={progress.progress.xp} />
        <StatCard icon={<Trophy className="w-4 h-4" />} label="Level" value={progress.progress.level} />
        <StatCard icon={<Flag className="w-4 h-4" />} label="Streak" value={`${progress.progress.streakDays}d`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly goals */}
          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className="text-sm font-semibold text-primary mb-3">Weekly Goals</h2>
            <div className="space-y-3">
              {progress.progress.weeklyGoals.map(goal => (
                <div key={goal.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-secondary">{goal.label}</span>
                    <span className="text-primary font-medium tabular-nums">{goal.current}/{goal.target}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-alt overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((goal.current / goal.target) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training timeline / latest updates */}
          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className="text-sm font-semibold text-primary mb-3">Training Timeline</h2>
            <div className="space-y-3">
              {progress.progress.timeline.slice().reverse().map(event => (
                <div key={event.id} className="flex items-start gap-3">
                  <Circle className="w-2.5 h-2.5 text-accent mt-1.5 shrink-0 fill-current" />
                  <div className="min-w-0">
                    <p className="text-sm text-primary">{event.label}</p>
                    <p className="text-xs text-secondary">{new Date(event.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Mentor */}
          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className="text-sm font-semibold text-primary mb-3">Mentor</h2>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {MOCK_MENTOR.avatarInitial}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-primary truncate">{MOCK_MENTOR.name}</p>
                <p className="text-xs text-secondary truncate">{MOCK_MENTOR.role}</p>
              </div>
            </div>
            <Link to="/training/mentor" className="mt-3 flex items-center gap-1 text-xs font-medium text-accent hover:underline w-fit">
              <Users className="w-3.5 h-3.5" />
              View mentor section
            </Link>
          </div>

          {/* Estimated completion */}
          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className="text-sm font-semibold text-primary mb-3">Estimated Completion</h2>
            <div className="flex items-center gap-2 text-secondary">
              <Calendar className="w-4 h-4" />
              <p className="text-sm">
                {progress.progress.estimatedCompletion
                  ? new Date(progress.progress.estimatedCompletion).toLocaleDateString()
                  : 'Not yet estimated'}
              </p>
            </div>
          </div>

          {/* Upcoming deadlines */}
          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className="text-sm font-semibold text-primary mb-3">Upcoming Deadlines</h2>
            {progress.progress.upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-secondary">Nothing due yet.</p>
            ) : (
              <div className="space-y-2">
                {progress.progress.upcomingDeadlines.map(d => (
                  <div key={d.id} className="flex items-center justify-between text-sm">
                    <span className="text-primary">{d.label}</span>
                    <span className="text-xs text-secondary tabular-nums">{new Date(d.dueDate).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievements teaser */}
          <div className="bg-surface border border-line rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-primary">Achievements</h2>
              <Link to="/training/achievements" className="text-xs font-medium text-accent hover:underline">View all</Link>
            </div>
            {earnedAchievements.length === 0 ? (
              <p className="text-xs text-secondary">No achievements earned yet — keep going.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {earnedAchievements.map(a => (
                  <span key={a.id} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                    <Award className="w-3.5 h-3.5" />
                    {a.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
