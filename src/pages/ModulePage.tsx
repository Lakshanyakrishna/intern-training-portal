import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { modules } from '../data/modules';
import { useProgress } from '../hooks/useProgress';
import QuizEngine from '../components/QuizEngine';
import PracticeCard from '../components/PracticeCard';
import ChallengeCard from '../components/ChallengeCard';
import CheckpointQuizComponent from '../components/CheckpointQuiz';
import { CheckCircle, Lock } from '../components/Icons';

type FlowItem =
  | { type: 'module-overview' }
  | { type: 'lesson'; id: string }
  | { type: 'practice'; id: string }
  | { type: 'checkpoint'; id: string }
  | { type: 'challenge' }
  | { type: 'assessment' };

function buildFlow(moduleId: string): FlowItem[] {
  const mod = modules.find(m => m.id === moduleId);
  if (!mod) return [];
  const flow: FlowItem[] = [];
  flow.push({ type: 'module-overview' });
  const { lessons, practices, checkpointQuizzes } = mod;

  const groupSize = Math.max(2, Math.min(3, lessons.length <= 6 ? 2 : 3));
  let cpIdx = 0;

  if (practices.length === 0) {
    lessons.forEach((lesson, i) => {
      flow.push({ type: 'lesson', id: lesson.id });
      if ((i + 1) % groupSize === 0 && cpIdx < checkpointQuizzes.length) {
        flow.push({ type: 'checkpoint', id: checkpointQuizzes[cpIdx].id });
        cpIdx++;
      }
    });
  } else {
    const positions = new Set<number>();
    for (let i = 1; i <= practices.length; i++) {
      positions.add(Math.round((i * lessons.length) / (practices.length + 1)));
    }
    lessons.forEach((lesson, i) => {
      flow.push({ type: 'lesson', id: lesson.id });
      const practiceIdx = [...positions].indexOf(i + 1);
      if (practiceIdx >= 0 && mod.practices[practiceIdx]) {
        flow.push({ type: 'practice', id: mod.practices[practiceIdx].id });
      }
      if ((i + 1) % groupSize === 0 && cpIdx < checkpointQuizzes.length) {
        flow.push({ type: 'checkpoint', id: checkpointQuizzes[cpIdx].id });
        cpIdx++;
      }
    });
  }

  flow.push({ type: 'challenge' });
  flow.push({ type: 'assessment' });
  return flow;
}

function getLessonPractice(moduleId: string, lessonId: string) {
  const mod = modules.find(m => m.id === moduleId);
  if (!mod) return null;
  const flow = buildFlow(moduleId);
  const idx = flow.findIndex(f => f.type === 'lesson' && f.id === lessonId);
  if (idx >= 0 && idx + 1 < flow.length) {
    const next = flow[idx + 1];
    if (next.type === 'practice') return mod.practices.find(p => p.id === next.id) || null;
  }
  return null;
}

const companyTickets: Record<string, { id: string; title: string; requirements: string[]; acceptance: string[] }> = {
  git: { id: 'TASK-101', title: 'Set Up Version Control for New Feature', requirements: ['Create a feature branch from main', 'Commit changes with clear messages', 'Push branch and open a pull request'], acceptance: ['Branch follows naming convention feature/*', 'At least 3 meaningful commits', 'PR description explains the changes'] },
  api: { id: 'TASK-203', title: 'Fix Login Validation', requirements: ['Validate all user inputs', 'Display clear error messages', 'Prevent invalid form submissions'], acceptance: ['Validation works for all fields', 'Error messages are user-friendly', 'User can proceed when form is valid'] },
  debugging: { id: 'TASK-156', title: 'Investigate and Fix API 500 Error', requirements: ['Reproduce the bug consistently', 'Use Network tab to trace the request', 'Find root cause and fix'], acceptance: ['Bug is reproducible before fix', 'Root cause is identified in comments', 'API returns 200 after fix'] },
  testing: { id: 'TASK-312', title: 'Add Test Coverage for Checkout Flow', requirements: ['Write manual test cases', 'Test edge cases (empty cart, invalid payment)', 'Document all test results'], acceptance: ['All test cases documented', 'Edge cases covered', 'Bugs discovered are reported'] },
  deployment: { id: 'TASK-445', title: 'Deploy Latest Release to Production', requirements: ['Build passes locally', 'Environment variables configured', 'Deployment verified with smoke tests'], acceptance: ['Vercel deployment is live', 'No console errors on production', 'Correct env vars set'] },
};

const navLabels: Record<string, string> = {
  'module-overview': 'Overview',
  lesson: 'Lesson',
  practice: 'Hands-On Task',
  checkpoint: 'Checkpoint',
  challenge: 'Challenge',
  assessment: 'Assessment',
};

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = modules.find(m => m.id === moduleId);
  const { completeLesson, completeCheckpoint, passQuiz, progress, completeJourneyStage, savePracticeSubmission, saveChallengeWorkspace, submitChallenge } = useProgress();
  const [searchParams] = useSearchParams();
  const flow = useMemo(() => moduleId ? buildFlow(moduleId) : [], [moduleId]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!module) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-lg font-bold text-primary">Module not found</h2>
          <Link to="/" className="mt-3 inline-block text-sm text-neutral-500 hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  const modProg = progress.moduleProgress[module.id] || { lessons: [], practices: [], challenges: [], quizPassed: false, xp: 0, checkpoints: {} };
  const ticket = companyTickets[module.id];

  const isItemCompleted = useCallback((item: FlowItem): boolean => {
    switch (item.type) {
      case 'module-overview': return true;
      case 'lesson': return modProg.lessons.includes(item.id);
      case 'practice': return modProg.practices.includes(item.id);
      case 'checkpoint': return modProg.checkpoints?.[item.id] !== undefined;
      case 'challenge': return module.challenges.every(c => modProg.challenges.includes(c.id));
      case 'assessment': return modProg.quizPassed;
    }
  }, [modProg, module]);

  const isItemLocked = useCallback((index: number): boolean => {
    if (index === 0) return false;
    return !isItemCompleted(flow[index - 1]);
  }, [flow, isItemCompleted]);

  const getItemStatus = useCallback((index: number): 'completed' | 'current' | 'locked' | 'available' => {
    const item = flow[index];
    if (!item) return 'locked';
    if (isItemCompleted(item)) return 'completed';
    if (isItemLocked(index)) return 'locked';
    if (index === selectedIndex) return 'current';
    return 'available';
  }, [flow, isItemCompleted, isItemLocked, selectedIndex]);

  const getItemTitle = useCallback((item: FlowItem, index: number): string => {
    if (item.type === 'module-overview') return 'Overview';
    if (item.type === 'assessment') return 'Module Assessment';
    if (item.type === 'challenge') return 'Challenge';
    if (item.type === 'checkpoint') {
      const cp = module.checkpointQuizzes.find(q => q.id === item.id);
      return cp ? cp.title : 'Checkpoint Quiz';
    }
    if (item.type === 'practice') {
      const p = module.practices.find(pr => pr.id === item.id);
      return p ? p.title : 'Hands-On Task';
    }
    const lesson = module.lessons.find(l => l.id === item.id);
    return lesson ? lesson.title : `Lesson ${flow.slice(0, index + 1).filter(f => f.type === 'lesson').length}`;
  }, [module, flow]);

  const getItemNumber = useCallback((item: FlowItem, index: number): number => {
    if (item.type === 'module-overview') return 0;
    if (item.type === 'assessment') return flow.filter(f => f.type !== 'assessment' && f.type !== 'module-overview').length + 1;
    if (item.type === 'challenge') return flow.filter(f => f.type === 'lesson' || f.type === 'practice').length + 1;
    return flow.slice(0, index + 1).filter(f => f.type === item.type).length;
  }, [flow]);

  const progressPercent = Math.round(
    (flow.filter(f => f.type !== 'module-overview' && isItemCompleted(f)).length / flow.filter(f => f.type !== 'module-overview').length) * 100
  );

  const allChallengesDone = module.challenges.every(c => modProg.challenges.includes(c.id));
  const assessmentUnlocked = allChallengesDone && module.challenges.length > 0;

  const handleLessonComplete = (lessonId: string) => completeLesson(module.id, lessonId);
  const handleQuizPass = (score?: number, total?: number) => {
    passQuiz(module.id, score !== undefined ? { score, total: total ?? 0 } : undefined);
    completeJourneyStage(module.id);
  };

  const defaultIndex = (() => {
    if (!flow.length) return 0;
    const hasProgress = flow.some((item, i) => i > 0 && isItemCompleted(item));
    if (!hasProgress) return 0;
    const firstIncomplete = flow.findIndex((item, i) => i > 0 && !isItemCompleted(item));
    return firstIncomplete > 0 ? firstIncomplete : 0;
  })();

  useEffect(() => {
    setSelectedIndex(defaultIndex);
  }, [defaultIndex]);

  useEffect(() => {
    const lessonId = searchParams.get('lesson');
    if (lessonId) {
      const idx = flow.findIndex(f => f.type === 'lesson' && f.id === lessonId);
      if (idx >= 0) setSelectedIndex(idx);
    }
  }, [searchParams, flow]);

  const selectedItem = flow[selectedIndex];

  return (
    <div className="-m-4 md:-m-6 lg:-m-8 max-w-none">
      {/* Module header bar */}
      <div className="px-4 md:px-6 lg:px-8 h-14 border-b border-line bg-surface flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setSidebarOpen(p => !p)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 shrink-0 transition-colors"
            title="Toggle navigation"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <Link to="/" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors whitespace-nowrap">
            Dashboard
          </Link>
          <span className="text-xs text-gray-300 dark:text-gray-600">/</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{module.title}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-secondary shrink-0">
          <span className="hidden sm:inline font-medium text-gray-700 dark:text-gray-300">{progressPercent}%</span>
          <div className="w-20 sm:w-28 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="hidden md:inline text-gray-400">{module.lessons.length} lessons</span>
          <span className="hidden lg:inline text-gray-400">{module.challenges.length} challenge{module.challenges.length !== 1 ? 's' : ''}</span>
          <span className="hidden lg:inline text-gray-400">1 assessment</span>
        </div>
      </div>

      {/* Two-panel body */}
      <div className="flex" style={{ height: 'calc(100vh - 56px - 56px)' }}>
        {/* Lesson navigation sidebar */}
        <aside className={`${sidebarOpen ? 'w-52' : 'w-0'} shrink-0 border-r border-line bg-surface-alt transition-all duration-200 ease-in-out overflow-hidden`}>
          <nav className="p-2 space-y-0.5 w-52">
            {flow.map((item, index) => {
              const status = getItemStatus(index);
              const locked = status === 'locked';
              const title = getItemTitle(item, index);
              const num = getItemNumber(item, index);
              const isSelected = index === selectedIndex && !locked;

              let leftIcon;
              if (item.type === 'module-overview') leftIcon = <span className="w-6 text-center text-xs text-neutral-400 dark:text-neutral-500 font-bold">i</span>;
              else if (status === 'completed') leftIcon = <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />;
              else if (locked) leftIcon = <Lock className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" />;
              else if (item.type === 'lesson') leftIcon = <span className="w-6 text-center text-xs font-mono font-medium text-gray-400 dark:text-gray-500">{String(num).padStart(2, '0')}</span>;
              else if (item.type === 'practice') leftIcon = <span className="w-5 text-center text-xs text-gray-300 dark:text-gray-500">○</span>;
              else if (item.type === 'checkpoint') leftIcon = <span className="w-5 text-center text-xs text-neutral-400 dark:text-neutral-500">?</span>;
              else if (item.type === 'challenge') leftIcon = <span className="w-5 text-center text-xs text-gray-300 dark:text-gray-500">◆</span>;
              else leftIcon = <span className="w-5 text-center text-xs text-gray-300 dark:text-gray-500">■</span>;

              return (
                <button
                  key={`${item.type}-${'id' in item ? item.id : ''}-${index}`}
                  onClick={() => !locked && setSelectedIndex(index)}
                  disabled={locked}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-sm transition-all duration-150 ${
                    isSelected
                      ? 'bg-neutral-50 dark:bg-neutral-900/20 text-neutral-600 dark:text-neutral-300 font-medium'
                      : status === 'completed'
                      ? 'text-green-600 dark:text-green-400/80 hover:bg-green-50/50 dark:hover:bg-green-900/10'
                      : locked
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-secondary hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {leftIcon}
                  <span className="truncate">{title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-surface">
          {selectedItem && (
            <div className="p-4 md:p-5 lg:p-6 xl:p-8">
              {/* Section label */}
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-4">
                <span className="font-medium">{navLabels[selectedItem.type]}</span>
                {selectedItem.type === 'lesson' && (
                  <span className="text-gray-300 dark:text-gray-600">
                    {flow.slice(0, selectedIndex + 1).filter(f => f.type === 'lesson').length} of {flow.filter(f => f.type === 'lesson').length}
                  </span>
                )}
              </div>

              {/* Module Overview */}
              {selectedItem.type === 'module-overview' && (
                <div className="max-w-none space-y-8">
                  <div>
                    <h1 className="text-2xl font-bold text-primary">{module.title}</h1>
                    <p className="text-sm text-secondary mt-1.5">{module.description}</p>
                  </div>

                  <section>
                    <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Why This Module Matters</h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{module.whyModuleMatters}</p>
                  </section>

                  <section>
                    <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Module Learning Objectives</h2>
                    <ul className="space-y-2">
                      {module.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-neutral-500 mt-1 shrink-0">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Skills Gained</h2>
                    <ul className="space-y-2">
                      {module.skillsGained.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-green-500 mt-1 shrink-0">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { label: 'Lessons', value: module.lessons.length },
                      { label: 'Checkpoint Quizzes', value: module.checkpointQuizzes.length },
                      { label: 'Challenges', value: module.challenges.length },
                      { label: 'Final Assessment', value: 1 },
                      { label: 'Est. Time', value: `${module.estimatedMinutes} min` },
                    ].map(stat => (
                      <div key={stat.label} className="bg-surface-alt border border-line rounded-xl px-4 py-3 text-center">
                        <p className="text-lg font-semibold text-primary">{stat.value}</p>
                        <p className="text-xs text-secondary mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </section>

                  <div className="pt-4">
                    <button
                      onClick={() => setSelectedIndex(1)}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl bg-neutral-500 text-white hover:bg-accent transition-colors"
                    >
                      Start Module →
                    </button>
                  </div>
                </div>
              )}

              {/* Lesson content */}
              {selectedItem.type === 'lesson' && (() => {
                const lesson = module.lessons.find(l => l.id === selectedItem.id);
                if (!lesson) return null;
                const practice = getLessonPractice(module.id, selectedItem.id);
                const completed = modProg.lessons.includes(selectedItem.id);
                const submission = practice ? (progress.practiceSubmissions || []).find(s => s.taskId === practice.id) : undefined;

                return (
                  <div className="max-w-none space-y-8">
                    <div>
                      <h1 className="text-2xl font-bold text-primary">{lesson.title}</h1>
                      {completed && (
                        <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-green-600 dark:text-green-400">
                          <CheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </div>

                    {lesson.why && (
                      <section>
                        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Why This Matters</h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{lesson.why}</p>
                      </section>
                    )}

                    {lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
                      <section>
                        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Key Concepts</h2>
                        <ul className="space-y-2">
                          {lesson.keyConcepts.map((c, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                              <span className="text-neutral-500 mt-1 shrink-0">•</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {lesson.commandSpotlight && lesson.commandSpotlight.length > 0 && (
                      <section>
                        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Command Spotlight</h2>
                        <div className="space-y-4">
                          {lesson.commandSpotlight.map((cs, i) => (
                            <div key={i} className="border border-line rounded-xl overflow-hidden">
                              <div className="bg-surface-alt px-5 py-3 border-b border-line">
                                <code className="text-sm font-mono font-semibold text-accent">{cs.command}</code>
                              </div>
                              <div className="px-5 py-3 space-y-3 text-sm">
                                <div>
                                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Purpose</span>
                                  <p className="text-gray-700 dark:text-gray-300 mt-0.5">{cs.purpose}</p>
                                </div>
                                <div>
                                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Syntax</span>
                                  <code className="block text-sm font-mono text-primary mt-0.5 bg-surface-alt px-3 py-1.5 rounded-lg">{cs.syntax}</code>
                                </div>
                                <div>
                                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Example</span>
                                  <code className="block text-sm font-mono text-primary mt-0.5 bg-surface-alt px-3 py-1.5 rounded-lg">{cs.example}</code>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {lesson.tryItYourself && (
                      <section>
                        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Try It Yourself</h2>
                        <div className="bg-surface-alt border border-line rounded-xl p-5">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{lesson.tryItYourself}</p>
                        </div>
                      </section>
                    )}

                    {lesson.scenario && (
                      <section>
                        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Real Project Scenario</h2>
                        <div className="bg-surface-alt border border-line rounded-xl p-5">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{lesson.scenario}</p>
                        </div>
                      </section>
                    )}

                    {lesson.commands && lesson.commands.length > 0 && (
                      <section>
                        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Commands You Need To Know</h2>
                        <div className="space-y-2">
                          {lesson.commands.map((cmd, i) => (
                            <div key={i} className="flex items-center gap-3 bg-surface-alt rounded-lg px-4 py-2.5">
                              <code className="text-sm font-mono font-semibold text-accent shrink-0">{cmd.cmd}</code>
                              <span className="text-xs text-secondary">{cmd.desc}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {practice && (
                      <section className="border-t border-line pt-8">
                        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Hands-On Task</h2>
                        <div className="space-y-4">
                          <p className="text-sm text-secondary">{practice.description}</p>
                          <div className="bg-surface-alt rounded-xl p-5">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{practice.task}</p>
                          </div>
                          {practice.hints && practice.hints.length > 0 && (
                            <details className="group">
                              <summary className="text-xs text-secondary cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors select-none">
                                Need a hint? ({practice.hints.length} available)
                              </summary>
                              <div className="mt-2 space-y-1.5">
                                {practice.hints.map((h, i) => (
                                  <p key={i} className="text-xs text-secondary bg-surface-alt px-3 py-2 rounded-lg">Hint {i + 1}: {h}</p>
                                ))}
                              </div>
                            </details>
                          )}
                          <PracticeCard
                            practice={practice}
                            completed={modProg.practices.includes(practice.id)}
                            existingSubmission={submission}
                            onSaveSubmission={(text) => savePracticeSubmission(module.id, practice.id, text)}
                          />
                        </div>
                      </section>
                    )}

                    {!completed && (
                      <div className="flex items-center justify-between pt-4">
                        <button
                          onClick={() => handleLessonComplete(lesson.id)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-neutral-500 text-white hover:bg-accent transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" /> Mark Lesson Complete
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-line">
                      <button
                        onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
                        disabled={selectedIndex === 0}
                        className="text-sm text-secondary hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={() => setSelectedIndex(Math.min(flow.length - 1, selectedIndex + 1))}
                        disabled={selectedIndex >= flow.length - 1 || isItemLocked(selectedIndex + 1)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        Next {navLabels[flow[selectedIndex + 1]?.type] || ''} →
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Practice content */}
              {selectedItem.type === 'practice' && (() => {
                const practice = module.practices.find(p => p.id === selectedItem.id);
                if (!practice) return null;
                const completed = modProg.practices.includes(selectedItem.id);
                const submission = (progress.practiceSubmissions || []).find(s => s.taskId === selectedItem.id);

                return (
                  <div className="max-w-none space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold text-primary">{practice.title}</h1>
                      {completed && <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-green-600 dark:text-green-400"><CheckCircle className="w-3.5 h-3.5" /> Completed</span>}
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{practice.description}</p>
                    <div className="bg-surface-alt rounded-xl p-5">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Task</p>
                      <p className="text-sm text-secondary">{practice.task}</p>
                    </div>
                    <PracticeCard
                      practice={practice}
                      completed={completed}
                      existingSubmission={submission}
                      onSaveSubmission={(text) => savePracticeSubmission(module.id, practice.id, text)}
                    />
                    <div className="flex items-center justify-between pt-6 border-t border-line">
                      <button onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))} disabled={selectedIndex === 0} className="text-sm text-secondary hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">← Previous</button>
                      <button onClick={() => setSelectedIndex(Math.min(flow.length - 1, selectedIndex + 1))} disabled={selectedIndex >= flow.length - 1 || isItemLocked(selectedIndex + 1)} className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next {navLabels[flow[selectedIndex + 1]?.type] || ''} →</button>
                    </div>
                  </div>
                );
              })()}

              {/* Checkpoint Quiz content */}
              {selectedItem.type === 'checkpoint' && (() => {
                const cp = module.checkpointQuizzes.find(q => q.id === selectedItem.id);
                if (!cp) return <p className="text-sm text-gray-400">Checkpoint not found.</p>;
                const existingResult = modProg.checkpoints?.[cp.id];

                return (
                  <div className="max-w-none space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold text-primary">{cp.title}</h1>
                      {existingResult?.passed && (
                        <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-green-600 dark:text-green-400">
                          <CheckCircle className="w-3.5 h-3.5" /> Passed
                        </span>
                      )}
                    </div>
                    <CheckpointQuizComponent
                      quiz={cp}
                      existingResult={existingResult}
                      onComplete={(result) => completeCheckpoint(module.id, cp.id, result)}
                      onContinue={() => setSelectedIndex(Math.min(flow.length - 1, selectedIndex + 1))}
                    />
                  </div>
                );
              })()}

              {/* Challenge content */}
              {selectedItem.type === 'challenge' && (() => {
                const lessonsReq = module.lessons.every(l => modProg.lessons.includes(l.id));
                const practicesReq = module.practices.every(p => modProg.practices.includes(p.id));
                const checkpointsReq = module.checkpointQuizzes.every(cp => modProg.checkpoints?.[cp.id] !== undefined);
                const allReqMet = lessonsReq && practicesReq && checkpointsReq;

                return (
                  <div className="max-w-none space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold text-primary">Challenge</h1>
                      {allChallengesDone && <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-green-600 dark:text-green-400"><CheckCircle className="w-3.5 h-3.5" /> Completed all challenges</span>}
                    </div>

                    {!allReqMet && (
                      <div className="border border-line rounded-xl p-6 bg-surface-alt">
                        <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Challenge Requirements</h3>
                        <div className="space-y-2">
                          <div className={`flex items-center gap-2 text-sm ${lessonsReq ? 'text-green-600 dark:text-green-400' : 'text-secondary'}`}>
                            <span>{lessonsReq ? '✓' : '✗'}</span>
                            <span>Complete {module.lessons.length} Lessons</span>
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${practicesReq ? 'text-green-600 dark:text-green-400' : 'text-secondary'}`}>
                            <span>{practicesReq ? '✓' : '✗'}</span>
                            <span>Complete {module.practices.length} Hands-On Task{module.practices.length !== 1 ? 's' : ''}</span>
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${checkpointsReq ? 'text-green-600 dark:text-green-400' : 'text-secondary'}`}>
                            <span>{checkpointsReq ? '✓' : '✗'}</span>
                            <span>Complete {module.checkpointQuizzes.length} Checkpoint{module.checkpointQuizzes.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {allReqMet && !allChallengesDone && (
                      <div className="border border-green-200 dark:border-green-800 rounded-xl p-5 bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">Challenge Unlocked</p>
                        </div>
                      </div>
                    )}

                    {allReqMet && (
                      <div className="space-y-6">
                        {ticket && (
                          <div className="bg-surface-alt border border-line rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono font-semibold text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">{ticket.id}</span>
                              <span className="text-xs text-gray-400 dark:text-gray-500">Company Task</span>
                            </div>
                            <h3 className="text-sm font-semibold text-primary mb-3">{ticket.title}</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1.5">Requirements</p>
                                <ul className="space-y-1">
                                  {ticket.requirements.map((r, i) => (
                                    <li key={i} className="text-xs text-secondary flex items-start gap-1.5"><span className="text-gray-400 mt-0.5">•</span>{r}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1.5">Acceptance Criteria</p>
                                <ul className="space-y-1">
                                  {ticket.acceptance.map((a, i) => (
                                    <li key={i} className="text-xs text-secondary flex items-start gap-1.5"><span className="text-green-500 mt-0.5">✓</span>{a}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                        {module.challenges.map(challenge => {
                          const ws = (progress.challengeWorkspaces || []).find(w => w.challengeId === challenge.id);
                          return (
                            <ChallengeCard
                              key={challenge.id}
                              challenge={challenge}
                              completed={modProg.challenges.includes(challenge.id)}
                              workspace={ws}
                              onSaveWorkspace={(data) => saveChallengeWorkspace(module.id, challenge.id, data)}
                              onSubmitChallenge={(submission) => submitChallenge(module.id, challenge.id, submission)}
                            />
                          );
                        })}
                        <div className="flex items-center justify-between pt-6 border-t border-line">
                          <button onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))} disabled={selectedIndex === 0} className="text-sm text-secondary hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">← Previous</button>
                          <button onClick={() => setSelectedIndex(Math.min(flow.length - 1, selectedIndex + 1))} disabled={selectedIndex >= flow.length - 1 || isItemLocked(selectedIndex + 1)} className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next {navLabels[flow[selectedIndex + 1]?.type] || ''} →</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Assessment content */}
              {selectedItem.type === 'assessment' && (() => {
                const locked = !assessmentUnlocked;
                return (
                  <div className="max-w-none space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold text-primary">Module Assessment</h1>
                      {modProg.quizPassed && <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-green-600 dark:text-green-400"><CheckCircle className="w-3.5 h-3.5" /> Passed</span>}
                    </div>
                    {locked && !modProg.quizPassed ? (
                      <div className="border border-line rounded-xl p-6 bg-surface-alt">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                          <div>
                            <p className="text-sm font-medium text-secondary">Assessment locked</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Complete the challenge first to unlock the assessment.</p>
                          </div>
                        </div>
                      </div>
                    ) : modProg.quizPassed ? (
                      <div className="border border-green-200 dark:border-green-800 rounded-xl p-6 bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">Assessment passed</p>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Module completed.</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <QuizEngine questions={module.quizzes} onPass={handleQuizPass} moduleTitle={module.title} lessons={module.lessons} existingResult={modProg.assessmentResult} />
                    )}
                    <div className="flex items-center justify-between pt-6 border-t border-line">
                      <button onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))} disabled={selectedIndex === 0} className="text-sm text-secondary hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">← Previous</button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
