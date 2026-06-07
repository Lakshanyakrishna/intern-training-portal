import { useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import { modules } from '../data/modules';
import { CheckCircle, Circle, BookOpen, Edit3, Award, ClipboardCheck } from '../components/Icons';

export default function MentorReview() {
  const { progress, updateMentorChecklist } = useProgress();
  const [form, setForm] = useState(progress.mentorChecklist);
  const [saved, setSaved] = useState(false);

  const checklist = progress.mentorChecklist;

  const allChallenges = modules.flatMap(m => m.challenges.map(c => ({ moduleId: m.id, ...c })));
  const completedChallengesList = modules.flatMap(m =>
    (progress.moduleProgress[m.id]?.challenges || []).map(cId => {
      const ch = m.challenges.find(c => c.id === cId);
      return ch ? { ...ch, moduleTitle: m.title, moduleId: m.id } : null;
    }).filter(Boolean)
  );

  const handleSave = () => {
    updateMentorChecklist({ ...form, challengesCompleted: completedChallengesList.map(c => c!.id), submitted: true });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl"><CheckCircle className="w-8 h-8 inline-block" /></span>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mentor Review Checklist</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Submit your work for mentor review before starting client projects.</p>
        </div>
      </div>

      {checklist.submitted && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">Checklist Submitted!</h3>
              <p className="text-sm text-green-600 dark:text-green-400">Your mentor will review your submission.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-gray-800 dark:text-white">Your Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub Profile URL</label>
            <input
              type="url"
              value={form.githubProfile}
              onChange={e => setForm(p => ({ ...p, githubProfile: e.target.value }))}
              placeholder="https://github.com/your-username"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deployed Project Link</label>
            <input
              type="url"
              value={form.deployedProjectLink}
              onChange={e => setForm(p => ({ ...p, deployedProjectLink: e.target.value }))}
              placeholder="https://your-project.vercel.app"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Repository Link</label>
            <input
              type="url"
              value={form.repositoryLink}
              onChange={e => setForm(p => ({ ...p, repositoryLink: e.target.value }))}
              placeholder="https://github.com/your-username/your-repo"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 dark:text-white">Challenge Completion Status</h2>
        <div className="space-y-2">
          {allChallenges.map(ch => {
            const done = (progress.moduleProgress[ch.moduleId]?.challenges || []).includes(ch.id);
            return (
              <div key={ch.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <span className={done ? 'text-green-500' : 'text-gray-300'}>{done ? <CheckCircle className="w-5 h-5 inline-block" /> : <Circle className="w-5 h-5 inline-block" />}</span>
                <span className={`text-sm flex-1 ${done ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}>
                  {ch.title}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${done ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                  {done ? 'Done' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 dark:text-white">Progress Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Lessons Read', value: progress.completedLessons.length, icon: <BookOpen className="w-6 h-6 inline-block" /> },
            { label: 'Practices Done', value: progress.completedPractices.length, icon: <Edit3 className="w-6 h-6 inline-block" /> },
            { label: 'Challenges Done', value: progress.completedChallenges.length, icon: <Award className="w-6 h-6 inline-block" /> },
            { label: 'Quizzes Passed', value: progress.passedQuizzes.length, icon: <ClipboardCheck className="w-6 h-6 inline-block" /> },
          ].map(s => (
            <div key={s.label} className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <span className="text-2xl">{s.icon}</span>
              <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!form.githubProfile || !form.deployedProjectLink || !form.repositoryLink}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-40 hover:from-blue-700 hover:to-indigo-700 transition-all"
      >
        {saved ? '✓ Submitted!' : 'Submit for Mentor Review'}
      </button>
    </div>
  );
}
