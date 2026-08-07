import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInternTrack } from '../hooks/useInternTrack';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import StatCard from '../components/StatCard';
import SkeletonBlock from '../components/SkeletonBlock';
import EmptyState from '../../applicant/components/EmptyState';
import { MOCK_MENTOR } from '../mock/mentor';
import { MOCK_ACHIEVEMENTS } from '../mock/achievements';
import { MOCK_RESOURCES } from '../mock/resources';
import { flattenModules, type ModuleConfig } from '../config/types';
import {
  ArrowRight, Award, BookOpen, Calendar, CheckCircle, Circle, Clock, FileText,
  Flag, Lock, LumoraStar, MessageSquare, Trophy, Users, Zap,
} from '../../components/Icons';

const SECTION_LABEL = 'text-[11px] font-semibold uppercase tracking-wider text-secondary';

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

  // Per-stage lock/completion summary for the learning-path preview --
  // walked once across the flattened curriculum so each module's state
  // depends on the one immediately before it, same rule the hook itself
  // uses internally.
  const flat = flattenModules(track);
  let previousModule: ModuleConfig | undefined;
  const moduleStates = new Map<string, ReturnType<typeof progress.moduleState>>();
  for (const { module } of flat) {
    moduleStates.set(module.id, progress.moduleState(module, previousModule));
    previousModule = module;
  }
  const pathStages = track.stages
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter(stage => stage.key !== 'graduation')
    .map(stage => {
      const modules = stage.modules.slice().sort((a, b) => a.order - b.order);
      const total = modules.length;
      const done = modules.filter(m => moduleStates.get(m.id) === 'completed').length;
      const locked = total > 0 && moduleStates.get(modules[0].id) === 'locked';
      return { stage, total, done, locked };
    });

  // Continue-learning card resolves down to the specific next lesson (not
  // just the module) so the CTA can say exactly what's next.
  const currentModule = progress.currentModule;
  const currentModuleProgress = currentModule ? progress.getModuleProgress(currentModule.id) : undefined;
  const currentModuleLessons = currentModule ? currentModule.lessons.slice().sort((a, b) => a.order - b.order) : [];
  const currentLesson = currentModuleLessons.find(l => !currentModuleProgress?.completedLessonIds.includes(l.id))
    ?? currentModuleLessons[currentModuleLessons.length - 1];
  const lessonIndex = currentLesson ? currentModuleLessons.findIndex(l => l.id === currentLesson.id) + 1 : 0;
  const lessonDonePercent = currentModuleLessons.length > 0
    ? Math.round(((currentModuleProgress?.completedLessonIds.length ?? 0) / currentModuleLessons.length) * 100)
    : 0;

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-6">
        {/* Welcome + assigned internship */}
        <div className="relative overflow-hidden rounded-2xl bg-sidebar-bg text-sidebar-text px-6 py-7 sm:px-8 sm:py-8 shadow-lg shadow-black/10 animate-[slideUp_0.4s_ease-out]">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.15]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
          />
          <LumoraStar aria-hidden="true" className="absolute -right-6 -top-8 w-44 h-44 text-sidebar-text-secondary opacity-[0.12] rotate-12" />
          <div className="relative min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sidebar-text-secondary mb-1.5">
              {track.trackName} Internship
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              {user?.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome back'}
            </h1>
            <p className="text-sm text-sidebar-text-secondary mt-2 max-w-md">Continue where you left off and keep building.</p>
          </div>
        </div>

        {/* Continue learning */}
        {currentModule ? (
          <Link
            to={currentLesson ? `/training/lesson/${currentLesson.id}` : `/training/module/${currentModule.id}`}
            className="group block rounded-xl border border-line bg-surface p-5 shadow-sm shadow-black/[0.03] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md hover:shadow-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background animate-[slideUp_0.4s_ease-out_0.05s_both]"
          >
            <p className={`${SECTION_LABEL} mb-3`}>Continue Learning</p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-transform duration-200 group-hover:scale-105">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary truncate">{currentModule.title}</p>
                {currentLesson ? (
                  <>
                    <p className="text-xs text-secondary mt-0.5 truncate">
                      Lesson {lessonIndex} of {currentModuleLessons.length} · {currentLesson.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2 max-w-xs">
                      <div className="h-1.5 flex-1 rounded-full bg-surface-alt overflow-hidden">
                        <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${lessonDonePercent}%` }} />
                      </div>
                      <span className="text-xs text-secondary tabular-nums shrink-0">{lessonDonePercent}%</span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-secondary mt-0.5">{progress.currentStage?.title} · pick up where you left off</p>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0">
                {currentLesson?.estimatedMinutes && (
                  <div className="text-right hidden sm:block">
                    <p className="flex items-center justify-end gap-1 text-[11px] text-secondary">
                      <Clock className="w-3 h-3" />
                      Estimated time
                    </p>
                    <p className="text-sm font-medium text-primary">{currentLesson.estimatedMinutes} min</p>
                  </div>
                )}
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-text text-sm font-medium group-hover:opacity-90 transition-opacity">
                  {currentLesson ? 'Resume Lesson' : 'Open Module'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-xl border border-line bg-surface p-5 text-center animate-[slideUp_0.4s_ease-out_0.05s_both]">
            <CheckCircle className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-sm font-medium text-primary">All assigned modules complete</p>
          </div>
        )}

        {/* Stat grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={<CheckCircle className="w-4 h-4" />} label="Modules Completed" value={`${progress.doneCount}/${progress.totalCount}`} delay={0.1} />
          <StatCard icon={<Zap className="w-4 h-4" />} label="XP" value={progress.progress.xp} delay={0.13} />
          <StatCard icon={<Trophy className="w-4 h-4" />} label="Level" value={progress.progress.level} delay={0.16} />
          <StatCard icon={<Flag className="w-4 h-4" />} label="Streak" value={`${progress.progress.streakDays}d`} delay={0.19} />
        </div>

        {/* Weekly goals + training timeline */}
        <div className="grid sm:grid-cols-2 gap-6 animate-[slideUp_0.4s_ease-out_0.2s_both]">
          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className={`${SECTION_LABEL} mb-3`}>Weekly Goals</h2>
            <div className="space-y-3">
              {progress.progress.weeklyGoals.map(goal => (
                <div key={goal.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-secondary">{goal.label}</span>
                    <span className="text-primary font-medium tabular-nums">{goal.current}/{goal.target}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-alt overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((goal.current / goal.target) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className={`${SECTION_LABEL} mb-3`}>Training Timeline</h2>
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

        {/* Estimated completion + upcoming deadlines */}
        <div className="grid sm:grid-cols-2 gap-6 animate-[slideUp_0.4s_ease-out_0.25s_both]">
          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className={`${SECTION_LABEL} mb-3`}>Estimated Completion</h2>
            <div className="flex items-center gap-2 text-secondary">
              <Calendar className="w-4 h-4" />
              <p className="text-sm">
                {progress.progress.estimatedCompletion
                  ? new Date(progress.progress.estimatedCompletion).toLocaleDateString()
                  : 'Not yet estimated'}
              </p>
            </div>
          </div>

          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className={`${SECTION_LABEL} mb-3`}>Upcoming Deadlines</h2>
            {progress.progress.upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-secondary">Nothing due yet.</p>
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
        </div>

        {/* Recent activity */}
        <div className="bg-surface border border-line rounded-xl overflow-hidden animate-[slideUp_0.4s_ease-out_0.3s_both]">
          <div className="px-5 py-3 border-b border-line bg-surface-alt">
            <h2 className={SECTION_LABEL}>Recent Activity</h2>
          </div>
          <EmptyState icon={<MessageSquare className="w-4 h-4" />} title="No activity yet" description="Your learning updates will appear here." />
        </div>
      </div>

      <div className="space-y-6">
        {/* Learning path preview */}
        <div className="bg-surface border border-line rounded-xl p-5 animate-[slideUp_0.4s_ease-out_0.1s_both]">
          <div className="flex items-center justify-between mb-4">
            <h2 className={SECTION_LABEL}>Your Learning Path</h2>
            <Link to="/training/path" className="flex items-center gap-1 text-xs font-medium text-accent hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              View full path
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div>
            {pathStages.map((s, i) => {
              const completed = s.total > 0 && s.done === s.total;
              const Icon = s.locked ? Lock : completed ? CheckCircle : BookOpen;
              const statusLabel = s.locked ? 'Locked' : completed ? 'Completed' : 'Continue learning';
              return (
                <div key={s.stage.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.locked ? 'bg-surface-alt text-secondary' : 'bg-accent/10 text-accent'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {i < pathStages.length - 1 && <div className="w-px flex-1 bg-line my-1" />}
                  </div>
                  <div className="flex-1 min-w-0 pb-5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-primary truncate">{s.stage.title}</p>
                      <p className="text-xs text-secondary">{statusLabel}</p>
                    </div>
                    <span className="text-xs text-secondary tabular-nums shrink-0">{s.done}/{s.total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mentor */}
        <div className="bg-surface border border-line rounded-xl p-5 animate-[slideUp_0.4s_ease-out_0.15s_both]">
          <h2 className={`${SECTION_LABEL} mb-3`}>Mentor</h2>
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {MOCK_MENTOR.avatarInitial}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-primary truncate">{MOCK_MENTOR.name}</p>
              <p className="text-xs text-secondary truncate">{MOCK_MENTOR.role}</p>
            </div>
          </div>
          <Link to="/training/mentor" className="mt-3 flex items-center gap-1 text-xs font-medium text-accent hover:underline w-fit rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <Users className="w-3.5 h-3.5" />
            View mentor section
          </Link>
        </div>

        {/* Achievements teaser */}
        <div className="bg-surface border border-line rounded-xl p-5 animate-[slideUp_0.4s_ease-out_0.2s_both]">
          <div className="flex items-center justify-between mb-1">
            <h2 className={SECTION_LABEL}>Achievements</h2>
            <Link to="/training/achievements" className="text-xs font-medium text-accent hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">View all</Link>
          </div>
          {earnedAchievements.length === 0 ? (
            <EmptyState icon={<Award className="w-4 h-4" />} title="No achievements yet" description="Complete tasks to earn badges and level up." />
          ) : (
            <div className="flex flex-wrap gap-2 mt-3">
              {earnedAchievements.map(a => (
                <span key={a.id} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                  <Award className="w-3.5 h-3.5" />
                  {a.title}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Resources teaser */}
        <div className="bg-surface border border-line rounded-xl p-5 animate-[slideUp_0.4s_ease-out_0.25s_both]">
          <div className="flex items-center justify-between mb-1">
            <h2 className={SECTION_LABEL}>Resources</h2>
            <Link to="/training/resources" className="text-xs font-medium text-accent hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">View all</Link>
          </div>
          {MOCK_RESOURCES.length === 0 ? (
            <EmptyState icon={<FileText className="w-4 h-4" />} title="No resources added yet" description="Helpful materials will appear here." />
          ) : (
            <div className="space-y-2 mt-3">
              {MOCK_RESOURCES.slice(0, 3).map(r => (
                <Link
                  key={r.id}
                  to="/training/resources"
                  className="flex items-center gap-2.5 text-sm text-primary hover:text-accent transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <FileText className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span className="truncate">{r.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
