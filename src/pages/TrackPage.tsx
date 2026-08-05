import { useParams, Link } from 'react-router-dom';
import { modules } from '../data/modules';
import { tracks, getModulesForTrack, getTrackProgress } from '../data/tracks';
import { useProgress } from '../hooks/useProgress';
import { Lock, Layers, Code, Briefcase, Flag, CheckCircle } from '../components/Icons';

const trackIcons: Record<string, React.ReactNode> = {
  foundation: <Layers className="w-5 h-5" />,
  development: <Code className="w-5 h-5" />,
  project: <Briefcase className="w-5 h-5" />,
  final: <Flag className="w-5 h-5" />,
};

function isPreviousModuleComplete(moduleIndex: number, trackModules: { id: string }[], getModuleProgress: (id: string) => { percent: number }): boolean {
  if (moduleIndex === 0) return true;
  const prev = trackModules[moduleIndex - 1];
  return getModuleProgress(prev.id).percent >= 80;
}

export default function TrackPage() {
  const { trackId } = useParams<{ trackId: string }>();
  const track = tracks.find(t => t.id === trackId);
  const { getModuleProgress } = useProgress();

  if (!track) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-lg font-bold text-primary">Track not found</h2>
        <Link to="/" className="mt-3 inline-block text-sm text-neutral-600 hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  const trackModules = getModulesForTrack(track.id, modules);
  const trackProg = getTrackProgress(track.id, getModuleProgress);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Track Header */}
      <div className="border border-line rounded-lg p-6 bg-surface">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-secondary">
            {trackIcons[track.id]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">{track.name}</h1>
            <p className="text-sm text-secondary mt-0.5">{track.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-secondary">{trackProg.completed}/{trackProg.total} Modules Completed</span>
          <span className="text-secondary">{trackProg.percent}%</span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-accent h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${trackProg.percent}%` }}
          />
        </div>
      </div>

      {/* Progression Timeline */}
      <div className="relative">
        {/* Vertical connecting line */}
        {trackModules.length > 1 && (
          <div className="absolute left-[23px] top-[52px] bottom-[52px] w-0.5 bg-gray-200 dark:bg-gray-700" />
        )}

        <div className="space-y-6">
          {trackModules.map((m, i) => {
            const mp = getModuleProgress(m.id);
            const done = mp.percent >= 80;
            const unlocked = isPreviousModuleComplete(i, trackModules, getModuleProgress);
            const active = unlocked && !done;
            const status = done ? 'completed' : active ? 'active' : 'locked';

            return (
              <div key={m.id} className="relative flex gap-5">
                {/* Timeline node */}
                <div className="flex flex-col items-center shrink-0 pt-1">
                  <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center border-2 z-10 bg-surface ${
                    status === 'completed'
                      ? 'border-green-500'
                      : status === 'active'
                      ? 'border-neutral-500'
                      : 'border-line'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : status === 'active' ? (
                      <div className="w-3 h-3 rounded-full bg-neutral-500" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    )}
                  </div>
                </div>

                {/* Module card */}
                <div className={`flex-1 min-w-0 border rounded-lg p-5 ${
                  status === 'completed'
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : status === 'active'
                    ? 'border-line bg-surface'
                    : 'border-line bg-surface-alt'
                }`}>
                  <div className="flex items-start gap-4">
                    <span className={`text-2xl font-bold leading-none pt-0.5 ${
                      status === 'completed'
                        ? 'text-green-300 dark:text-green-700'
                        : status === 'active'
                        ? 'text-gray-200 dark:text-gray-700'
                        : 'text-gray-200 dark:text-gray-700'
                    }`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-base font-semibold ${
                          status === 'locked' ? 'text-gray-400 dark:text-gray-500' : 'text-primary'
                        }`}>{m.title}</h3>
                        {status === 'completed' && (
                          <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded">Completed</span>
                        )}
                        {status === 'active' && (
                          <span className="text-xs font-medium text-accent bg-neutral-100 dark:bg-neutral-900/30 px-2 py-0.5 rounded">In Progress</span>
                        )}
                        {status === 'locked' && (
                          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">Locked</span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${
                        status === 'locked' ? 'text-gray-400 dark:text-gray-500' : 'text-secondary'
                      }`}>{m.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 dark:text-gray-500">
                        <span>{m.lessons.length} Lessons</span>
                      </div>
                      {status !== 'locked' && (
                        <div className="mt-4">
                          <Link
                            to={`/module/${m.id}`}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              status === 'completed'
                                ? 'bg-surface text-gray-700 dark:text-gray-300 border border-line hover:bg-gray-50 dark:hover:bg-gray-600'
                                : 'bg-accent text-white hover:bg-accent-hover'
                            }`}
                          >
                            {status === 'completed' ? 'View Module' : 'Continue'}
                            <svg className="w-4 h-4 ml-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </Link>
                        </div>
                      )}
                      {status === 'locked' && (
                        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">Complete previous module to continue</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
