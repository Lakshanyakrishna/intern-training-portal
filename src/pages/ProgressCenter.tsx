import { useProgress } from '../hooks/useProgress';
import ProgressBar from '../components/ProgressBar';
import { BookOpen, Edit3, Award, ClipboardCheck, Code, Grid, Zap, XCircle, ArrowRight, MessageSquare } from '../components/Icons';

const skillIconMap: Record<string, React.ReactNode> = {
  git: <Code className="w-5 h-5" />,
  deployment: <ArrowRight className="w-5 h-5" />,
  supabase: <Grid className="w-5 h-5" />,
  ai: <Zap className="w-5 h-5" />,
  debugging: <XCircle className="w-5 h-5" />,
  api: <Grid className="w-5 h-5" />,
  communication: <MessageSquare className="w-5 h-5" />,
};

export default function ProgressCenter() {
  const { progress, getSkillBreakdown } = useProgress();
  const skills = getSkillBreakdown();
  const joinDate = progress.trainingStartDate || progress.xpHistory[0]?.date || 'N/A';

  const last7Days: { date: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const total = progress.xpHistory.filter(e => e.date === dateStr).reduce((s, e) => s + e.amount, 0);
    last7Days.push({ date: dateStr, total });
  }

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const trainingDayCount = (() => {
    if (!progress.trainingStartDate) return 1;
    const diff = Math.floor((new Date().getTime() - new Date(progress.trainingStartDate).getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff + 1);
  })();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Progress Center</h1>

      {/* Profile card */}
      <div className="bg-surface border border-line rounded-xl p-5">
        <h2 className="text-lg font-semibold text-primary mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
            I
          </div>
          <div>
            <p className="font-semibold text-primary text-lg">Intern</p>
            <p className="text-sm text-secondary">intern@training.portal</p>
            {progress.mentorChecklist.githubProfile && (
              <a href={progress.mentorChecklist.githubProfile} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:underline">
                {progress.mentorChecklist.githubProfile}
              </a>
            )}
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-gray-400 dark:text-gray-500">Training start: {joinDate}</p>
              <span className="text-xs font-medium text-accent">Day {trainingDayCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* XP and level */}
      <div className="bg-surface border border-line rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-primary">Level Progress</h2>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Level {progress.level}</span>
        </div>
        <ProgressBar percent={Math.min(Math.round((progress.xp / 2000) * 100), 100)} />
        <p className="text-xs text-secondary mt-2">{progress.xp} XP earned</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Lessons Read', value: progress.completedLessons.length, icon: <BookOpen className="w-6 h-6 inline-block" /> },
          { label: 'Practices Done', value: progress.completedPractices.length, icon: <Edit3 className="w-6 h-6 inline-block" /> },
          { label: 'Challenges Done', value: progress.completedChallenges.length, icon: <Award className="w-6 h-6 inline-block" /> },
          { label: 'Quizzes Passed', value: progress.passedQuizzes.length, icon: <ClipboardCheck className="w-6 h-6 inline-block" /> },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-line rounded-xl p-4 text-center">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-xl font-bold text-primary mt-1">{s.value}</p>
            <p className="text-xs text-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Skill Breakdown */}
      <div className="bg-surface border border-line rounded-xl p-5">
        <h2 className="text-lg font-semibold text-primary mb-4">Skill Breakdown</h2>
        <div className="space-y-4">
          {Object.entries(skills).map(([name, info]) => (
            <div key={name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{skillIconMap[info.icon] || <Code className="w-5 h-5 inline-block" />}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
                </div>
                <span className="text-sm font-bold text-primary">{info.percent}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-neutral-500 to-indigo-500 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${info.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* XP History Chart */}
      <div className="bg-surface border border-line rounded-xl p-5">
        <h2 className="text-lg font-semibold text-primary mb-3">XP This Week</h2>
        <div className="space-y-2">
          {last7Days.map((day, i) => (
            <div key={day.date} className="flex items-center gap-3">
              <span className="text-xs text-secondary w-8">{dayLabels[i]}</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-neutral-500 to-indigo-500 rounded-full h-2 transition-all"
                  style={{ width: `${Math.min((day.total / 200) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-secondary w-14 text-right">{day.total} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-surface border border-line rounded-xl p-5">
        <h2 className="text-lg font-semibold text-primary mb-3">Recent Activity</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {progress.xpHistory.slice(-10).reverse().map((entry, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-line last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 dark:text-gray-500 w-20">{entry.date}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{entry.source.replace(/-/g, ' ')}</span>
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">+{entry.amount} XP</span>
            </div>
          ))}
          {progress.xpHistory.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No activity yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
