import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../contexts/AuthContext';
import { modules } from '../data/modules';
import { levels } from '../data/levels';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { getMockSubmissionFeedback } from '../data/reviews';
import {
  BookOpen,
  Zap,
  Grid,
  Target,
  CheckCircle,
  ClipboardCheck,
  ArrowRight,
  Code,
  Flag,
  User,
  MessageSquare,
} from '../components/Icons';

function hashSeed(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const MOCK_NAMES = [
  'Alex Chen', 'Jordan Lee', 'Taylor Kim', 'Morgan Patel',
  'Casey Rivera', 'Riley Thompson', 'Avery Davis', 'Quinn Brown',
  'Sage Wilson', 'Drew Martinez', 'Blake Anderson', 'Reese Jackson',
  'Skyler White', 'Phoenix Garcia',
];

interface TaskCard {
  type: 'Lesson' | 'Checkpoint' | 'Hands-On Task' | 'Challenge' | 'Assessment' | 'Mentor Review';
  moduleId: string;
  moduleTitle: string;
  label: string;
  link: string;
}

function statCard(label: string, value: string | number, icon: React.ReactNode) {
  return (
    <div className="flex items-center gap-3 bg-surface-alt rounded-xl px-4 py-3">
      <div className="w-9 h-9 rounded-lg bg-surface border border-line flex items-center justify-center text-secondary shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-lg font-semibold text-primary">{value}</p>
        <p className="text-xs text-secondary">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { progress, getModuleProgress } = useProgress();
  const { user } = useAuth();

  const hasStarted = progress.completedLessons.length > 0 || progress.completedPractices.length > 0 || progress.completedChallenges.length > 0 || progress.passedQuizzes.length > 0;

  const currentLevel = levels.find(l => l.level === progress.level) || levels[0];
  const nextLevel = levels.find(l => l.level === progress.level + 1);
  const levelProgress = nextLevel
    ? Math.round(((progress.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100)
    : 100;

  const moduleProgressMap = useMemo(() => {
    const map: Record<string, { percent: number; completed: number; total: number }> = {};
    for (const m of modules) {
      map[m.id] = getModuleProgress(m.id);
    }
    return map;
  }, [getModuleProgress]);

  const continueInfo = useMemo(() => {
    for (const m of modules) {
      const mp = moduleProgressMap[m.id];
      if (mp.percent > 0 && mp.percent < 100) {
        const modProg = progress.moduleProgress[m.id];
        const lessonsDone = modProg?.lessons.length || 0;
        const nextLesson = m.lessons[lessonsDone];
        return {
          module: m.title,
          moduleId: m.id,
          link: `/module/${m.id}`,
          topic: nextLesson?.title || 'Next Activity',
          remaining: mp.total - mp.completed,
        };
      }
    }
    if (!hasStarted) return null;
    return {
      module: modules[modules.length - 1]?.title || '',
      moduleId: modules[modules.length - 1]?.id || '',
      link: `/module/${modules[modules.length - 1]?.id || ''}`,
      topic: 'Review module',
      remaining: 0,
    };
  }, [moduleProgressMap, hasStarted, progress]);

  const firstModuleWithActivity = useMemo(() => {
    for (const m of modules) {
      const mp = moduleProgressMap[m.id];
      if (mp.percent < 100) return m;
    }
    return modules[0];
  }, [moduleProgressMap]);

  const currentTask = useMemo((): TaskCard | null => {
    for (const m of modules) {
      const modProg = progress.moduleProgress[m.id];
      const lessons = modProg?.lessons || [];
      const practices = modProg?.practices || [];
      const challenges = modProg?.challenges || [];
      const checkpoints = modProg?.checkpoints || {};
      const quizPassed = modProg?.quizPassed || false;

      const nextLesson = m.lessons.find(l => !lessons.includes(l.id));
      if (nextLesson) {
        return { type: 'Lesson', moduleId: m.id, moduleTitle: m.title, label: nextLesson.title, link: `/module/${m.id}` };
      }

      const nextCp = m.checkpointQuizzes.find(cp => !checkpoints[cp.id]);
      if (nextCp) {
        return { type: 'Checkpoint', moduleId: m.id, moduleTitle: m.title, label: nextCp.title, link: `/module/${m.id}` };
      }

      const nextPractice = m.practices.find(p => !practices.includes(p.id));
      if (nextPractice) {
        return { type: 'Hands-On Task', moduleId: m.id, moduleTitle: m.title, label: nextPractice.title, link: `/module/${m.id}` };
      }

      const lessonsAllDone = m.lessons.every(l => lessons.includes(l.id));
      const practicesAllDone = m.practices.every(p => practices.includes(p.id));
      const checkpointsAllDone = m.checkpointQuizzes.every(cp => checkpoints[cp.id] !== undefined);

      if (m.challenges.length > 0 && lessonsAllDone && practicesAllDone && checkpointsAllDone) {
        const nextCh = m.challenges.find(c => !challenges.includes(c.id));
        if (nextCh) {
          return { type: 'Challenge', moduleId: m.id, moduleTitle: m.title, label: nextCh.title, link: `/module/${m.id}` };
        }
      }

      if (m.challenges.length > 0 && challenges.length >= m.challenges.length && !quizPassed) {
        return { type: 'Assessment', moduleId: m.id, moduleTitle: m.title, label: `${m.title} Assessment`, link: `/module/${m.id}` };
      }

      if (!quizPassed && lessonsAllDone && practicesAllDone && m.challenges.every(c => challenges.includes(c.id))) {
        return { type: 'Assessment', moduleId: m.id, moduleTitle: m.title, label: `${m.title} Assessment`, link: `/module/${m.id}` };
      }
    }

    if (!progress.mentorChecklist.submitted) {
      return { type: 'Mentor Review', moduleId: '', moduleTitle: '', label: 'Submit Mentor Checklist', link: '/progress-center' };
    }

    return null;
  }, [progress]);

  const allCompleted = !currentTask && hasStarted;

  const overallStats = useMemo(() => {
    let totalLessons = 0;
    let totalPractices = 0;
    let totalChallenges = 0;
    let totalCheckpoints = 0;
    let totalAssessments = modules.length;
    let doneLessons = 0;
    let donePractices = 0;
    let doneChallenges = 0;
    let doneCheckpoints = 0;
    let doneAssessments = 0;

    for (const m of modules) {
      totalLessons += m.lessons.length;
      totalPractices += m.practices.length;
      totalChallenges += m.challenges.length;
      totalCheckpoints += m.checkpointQuizzes.length;

      const mp = progress.moduleProgress[m.id];
      if (mp) {
        doneLessons += mp.lessons.length;
        donePractices += mp.practices.length;
        doneChallenges += mp.challenges.length;
        if (mp.checkpoints) {
          doneCheckpoints += Object.values(mp.checkpoints).length;
        }
        if (mp.quizPassed) doneAssessments++;
      }
    }

    const totalItems = totalLessons + totalPractices + totalChallenges + totalCheckpoints + totalAssessments;
    const doneItems = doneLessons + donePractices + doneChallenges + doneCheckpoints + doneAssessments;

    return {
      totalLessons, doneLessons, totalPractices, donePractices,
      totalChallenges, doneChallenges, totalCheckpoints, doneCheckpoints,
      totalAssessments, doneAssessments,
      totalItems, doneItems,
      percent: totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0,
    };
  }, [progress]);

  const dailyGoals = useMemo(() => {
    const goals: { text: string; done: boolean }[] = [];
    const todayXp = progress.xpHistory.filter(e => e.date === new Date().toISOString().split('T')[0]).reduce((s, e) => s + e.amount, 0);

    if (!hasStarted) {
      goals.push({ text: 'Complete your first lesson — What is Git?', done: false });
      goals.push({ text: 'Complete the first practice exercise', done: false });
    } else if (allCompleted) {
      goals.push({ text: 'Review a completed module', done: false });
      goals.push({ text: 'Practice with debug simulator', done: progress.completedDebugScenarios.length > 0 });
    } else {
      const added = new Set<string>();
      for (const m of modules) {
        if (added.size >= 4) break;
        const mp = progress.moduleProgress[m.id];
        const lessons = mp?.lessons || [];
        const practices = mp?.practices || [];
        const challenges = mp?.challenges || [];
        const checkpoints = mp?.checkpoints || {};

        if (m.lessons.some(l => !lessons.includes(l.id)) && !added.has('lesson')) {
          goals.push({ text: `Complete a lesson in ${m.title}`, done: false });
          added.add('lesson');
        }
        if (m.checkpointQuizzes.some(cp => !checkpoints[cp.id]) && !added.has('checkpoint')) {
          goals.push({ text: `Pass a checkpoint in ${m.title}`, done: false });
          added.add('checkpoint');
        }
        if (m.practices.some(p => !practices.includes(p.id)) && !added.has('practice')) {
          goals.push({ text: `Submit a hands-on task in ${m.title}`, done: false });
          added.add('practice');
        }
        if (m.challenges.some(c => !challenges.includes(c.id)) && !added.has('challenge')) {
          goals.push({ text: `Complete a challenge in ${m.title}`, done: false });
          added.add('challenge');
        }
      }
    }

    goals.push({ text: 'Earn 50 XP today', done: todayXp >= 50 });
    return goals;
  }, [hasStarted, allCompleted, progress]);

  const leaderboardEntries = useMemo(() => {
    const totalCompleted = overallStats.doneItems;
    const quizAccuracy = overallStats.totalCheckpoints > 0
      ? Math.round((overallStats.doneCheckpoints / overallStats.totalCheckpoints) * 100)
      : 0;
    const userScore = progress.xp + totalCompleted * 10 + quizAccuracy * 2 + overallStats.doneChallenges * 50;

    const you = { name: 'You', xp: progress.xp, level: progress.level, score: userScore, isCurrentUser: true };
    const others = MOCK_NAMES.map(name => {
      const seed = hashSeed(name);
      const baseXp = Math.max(50, progress.xp - 200 + (seed % 1600));
      const level = 1 + Math.floor(baseXp / 600);
      const activities = Math.max(0, totalCompleted - 5 + (seed % 20));
      const accuracy = Math.min(100, Math.max(30, quizAccuracy - 15 + (seed % 25)));
      const challenges = Math.max(0, overallStats.doneChallenges - 1 + (seed % 4));
      return {
        name, xp: baseXp, level: Math.min(level, 10),
        score: baseXp + activities * 10 + accuracy * 2 + challenges * 50,
        isCurrentUser: false,
      };
    });
    return [...others, you].sort((a, b) => b.score - a.score).slice(0, 5);
  }, [progress, overallStats]);

  const isBlocked = useMemo(() => {
    if (!hasStarted) return false;
    const lastActive = progress.lastActive;
    if (!lastActive) return false;
    const last = new Date(lastActive);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);
    if (diffDays >= 3) return true;
    return false;
  }, [hasStarted, progress.lastActive]);

  const blockedInfo = useMemo(() => {
    if (!isBlocked) return null;
    const task = currentTask;
    if (!task) return { blocker: 'You have completed all available activities.', suggestion: 'Review completed modules or try the debug simulator.', mentorRecommendation: false };
    return {
      blocker: task.type === 'Lesson' ? `Pending lesson: ${task.label}` :
               task.type === 'Checkpoint' ? `Pending checkpoint: ${task.label}` :
               task.type === 'Hands-On Task' ? `Pending task: ${task.label}` :
               task.type === 'Challenge' ? `Challenge ready: ${task.label}` :
               `Assessment ready in ${task.moduleTitle}`,
      suggestion: `Continue with ${task.label} in ${task.moduleTitle}.`,
      mentorRecommendation: task.type === 'Mentor Review',
    };
  }, [isBlocked, currentTask]);

  const mentorUpdates = useMemo(() => {
    const feedback = getMockSubmissionFeedback(progress);
    if (feedback.length === 0) return null;
    const waiting = feedback.filter(f => f.status === 'waiting-review').length;
    const reviewed = feedback.filter(f => f.status === 'reviewed' || f.status === 'approved').length;
    const revisions = feedback.filter(f => f.status === 'revision-requested').length;
    if (revisions > 0) return { label: `${revisions} Revision${revisions > 1 ? 's' : ''} Requested`, urgent: true };
    if (waiting > 0) return { label: `${waiting} Submission${waiting > 1 ? 's' : ''} Waiting for Review`, urgent: false };
    if (reviewed > 0) return { label: `${reviewed} Feedback Available`, urgent: false };
    return null;
  }, [progress]);

  return (
    <div className="space-y-10">

      {/* 1. Welcome Section */}
      {!hasStarted ? (
        <div className="bg-gray-900 rounded-xl p-8 md:p-10">
          <h1 className="text-[32px] font-bold text-white leading-tight tracking-tight">Welcome</h1>
          <p className="mt-2 text-gray-400 text-base max-w-2xl">
            Start your internship readiness journey.
          </p>
          <p className="mt-1 text-gray-500 text-sm max-w-2xl">
            First task: Complete Git &amp; GitHub.
          </p>
          <Link
            to="/module/git"
            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors text-sm"
          >
            Start Learning
            <ArrowRight />
          </Link>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl p-8 md:p-10">
          <p className="text-sm font-medium text-gray-400 mb-1">Welcome Back{user ? `, ${user.name}` : ''}</p>
          <h1 className="text-[32px] font-bold text-white leading-tight tracking-tight">Resume your learning journey</h1>
          {continueInfo && (
            <div className="mt-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <BookOpen className="w-10 h-10 text-neutral-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Current module</p>
                  <p className="text-base font-semibold text-white">{continueInfo.module}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Current topic</p>
                  <p className="text-sm font-medium text-gray-200 mt-0.5">{continueInfo.topic}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Progress</p>
                  <p className="text-sm font-medium text-gray-200 mt-0.5">{moduleProgressMap[continueInfo.moduleId]?.percent || 0}% complete</p>
                </div>
              </div>
            </div>
          )}
          <Link
            to={continueInfo?.link || `/module/${firstModuleWithActivity.id}`}
            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors text-sm"
          >
            Continue Learning
            <ArrowRight />
          </Link>
        </div>
      )}

      {/* 1b. Mentor Updates */}
      {mentorUpdates && (
        <section>
          <h2 className="text-lg font-semibold text-primary mb-4">Mentor Updates</h2>
          <Link
            to="/readiness-reviews"
            className={`block rounded-xl p-5 border transition-colors ${
              mentorUpdates.urgent
                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                : 'bg-neutral-50 dark:bg-neutral-900/20 border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className={`w-5 h-5 shrink-0 ${mentorUpdates.urgent ? 'text-orange-500' : 'text-neutral-500'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${mentorUpdates.urgent ? 'text-orange-800 dark:text-orange-200' : 'text-neutral-800 dark:text-neutral-200'}`}>
                  {mentorUpdates.label}
                </p>
                <p className="text-xs text-secondary mt-0.5">View details in Mentor Feedback</p>
              </div>
              <ArrowRight className={`w-5 h-5 shrink-0 ${mentorUpdates.urgent ? 'text-orange-400' : 'text-neutral-400'}`} />
            </div>
          </Link>
        </section>
      )}

      {/* 2. Current Task Card */}
      {currentTask && (
        <section>
          <h2 className="text-lg font-semibold text-primary mb-4">Current Task</h2>
          <Link
            to={currentTask.link}
            className="block bg-surface border border-line rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                currentTask.type === 'Lesson' ? 'bg-neutral-50 dark:bg-neutral-900/30 text-accent' :
                currentTask.type === 'Checkpoint' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                currentTask.type === 'Hands-On Task' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                currentTask.type === 'Challenge' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                currentTask.type === 'Assessment' ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' :
                'bg-surface-alt text-secondary'
              }`}>
                {currentTask.type === 'Lesson' ? <BookOpen className="w-5 h-5" /> :
                 currentTask.type === 'Checkpoint' ? <ClipboardCheck className="w-5 h-5" /> :
                 currentTask.type === 'Hands-On Task' ? <Code className="w-5 h-5" /> :
                 currentTask.type === 'Challenge' ? <Flag className="w-5 h-5" /> :
                 currentTask.type === 'Assessment' ? <Grid className="w-5 h-5" /> :
                 <User className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-secondary uppercase tracking-wider">
                  {currentTask.type} &middot; {currentTask.moduleTitle}
                </p>
                <p className="text-sm font-semibold text-primary truncate">{currentTask.type === 'Assessment' ? currentTask.label : currentTask.label}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0" />
            </div>
          </Link>
        </section>
      )}

      {allCompleted && (
        <section>
          <h2 className="text-lg font-semibold text-primary mb-4">Status</h2>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
              <p className="text-sm font-medium text-green-800 dark:text-green-200">All training activities completed. You are ready for project allocation!</p>
            </div>
          </div>
        </section>
      )}

      {/* 3. Blocked State */}
      {blockedInfo && (
        <section>
          <h2 className="text-lg font-semibold text-primary mb-4">Heads up</h2>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <Flag className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">You haven't progressed in a few days</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">{blockedInfo.blocker}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary bg-surface rounded-lg px-3 py-2 border border-amber-100 dark:border-amber-700/50">
              <ArrowRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{blockedInfo.suggestion}</span>
            </div>
            {blockedInfo.mentorRecommendation && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                💡 Consider reaching out to your mentor for guidance.
              </p>
            )}
          </div>
        </section>
      )}

      {/* 4. Today's Goals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">Today's goals</h2>
          <span className="text-sm text-gray-400 dark:text-gray-500">{dailyGoals.filter(g => g.done).length}/{dailyGoals.length} done</span>
        </div>
        <div className="space-y-2">
          {dailyGoals.map((goal, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                goal.done
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-surface border-line'
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                goal.done
                  ? 'bg-green-500 text-white'
                  : 'border-2 border-line'
              }`}>
                {goal.done && <CheckCircle className="w-4 h-4" />}
              </div>
              <span className={`text-sm flex-1 ${
                goal.done
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>{goal.text}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(dailyGoals.filter(g => g.done).length / dailyGoals.length) * 100}%` }}
          />
        </div>
      </section>

      {/* 5. Progress */}
      <section>
        <h2 className="text-lg font-semibold text-primary mb-4">Progress</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCard('Total XP', progress.xp, <Zap />)}
          {statCard('Completion', `${overallStats.percent}%`, <Grid />)}
          {statCard('Challenges completed', overallStats.doneChallenges, <Target />)}
          {statCard('Assessments passed', overallStats.doneAssessments, <ClipboardCheck />)}
        </div>
        <div className="mt-4 space-y-3">
          <div className="bg-surface border border-line rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-secondary">
                Level {currentLevel.level} &mdash; {currentLevel.title}
              </span>
              <span className="text-sm text-secondary">{progress.xp} XP</span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-accent h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            {nextLevel && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{nextLevel.xpRequired - progress.xp} XP to level {nextLevel.level}</p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="bg-surface border border-line rounded-lg px-3 py-2.5 text-center">
              <p className="text-lg font-semibold text-primary">{overallStats.doneLessons}/{overallStats.totalLessons}</p>
              <p className="text-xs text-secondary">Lessons</p>
            </div>
            <div className="bg-surface border border-line rounded-lg px-3 py-2.5 text-center">
              <p className="text-lg font-semibold text-primary">{overallStats.doneCheckpoints}/{overallStats.totalCheckpoints}</p>
              <p className="text-xs text-secondary">Checkpoints</p>
            </div>
            <div className="bg-surface border border-line rounded-lg px-3 py-2.5 text-center">
              <p className="text-lg font-semibold text-primary">{overallStats.donePractices}/{overallStats.totalPractices}</p>
              <p className="text-xs text-secondary">Hands-On Tasks</p>
            </div>
            <div className="bg-surface border border-line rounded-lg px-3 py-2.5 text-center">
              <p className="text-lg font-semibold text-primary">{overallStats.doneChallenges}/{overallStats.totalChallenges}</p>
              <p className="text-xs text-secondary">Challenges</p>
            </div>
            <div className="bg-surface border border-line rounded-lg px-3 py-2.5 text-center">
              <p className="text-lg font-semibold text-primary">{overallStats.doneAssessments}/{overallStats.totalAssessments}</p>
              <p className="text-xs text-secondary">Assessments</p>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallStats.percent}%` }}
            />
          </div>
        </div>
      </section>

      {/* 6. Leaderboard */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">Leaderboard</h2>
          <Link to="/leaderboard" className="text-sm text-accent hover:underline">Full rankings</Link>
        </div>
        <div className="bg-surface border border-line rounded-lg overflow-hidden">
          <div className="grid grid-cols-[32px_1fr_48px_96px] gap-2 px-4 py-2.5 text-xs font-medium text-secondary uppercase tracking-wider border-b border-line">
            <span>#</span>
            <span>Name</span>
            <span>Level</span>
            <span className="text-right">XP</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {leaderboardEntries.map((entry, i) => (
              <div
                key={entry.name}
                className={`grid grid-cols-[32px_1fr_48px_96px] gap-2 px-4 py-2.5 items-center ${
                  entry.isCurrentUser ? 'bg-neutral-50 dark:bg-neutral-900/20' : ''
                }`}
              >
                <span className="text-sm font-medium text-secondary">{i + 1}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">{entry.name}</span>
                <span className="text-sm text-secondary">{entry.level}</span>
                <span className="text-sm font-semibold text-primary text-right tabular-nums">{entry.xp.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
