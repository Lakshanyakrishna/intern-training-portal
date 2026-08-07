import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getInternTrackAssignment, getTrainingModules, getInternModuleCompletions,
} from '../lib/db';
import type { DbInternTrackAssignment, DbTrainingModule } from '../lib/db';
import { BookOpen, CheckCircle, Circle, Clock, Lock } from '../components/Icons';

export default function Training() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<DbInternTrackAssignment | null>(null);
  const [modules, setModules] = useState<DbTrainingModule[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const a = await getInternTrackAssignment(user.id).catch(() => null);
      if (cancelled) return;
      setAssignment(a);
      if (a?.trackId) {
        const [mods, done] = await Promise.all([
          getTrainingModules(a.trackId).catch(() => []),
          getInternModuleCompletions(user.id).catch(() => new Set<string>()),
        ]);
        if (cancelled) return;
        setModules(mods);
        setCompleted(done);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-line border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!assignment?.trackId) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-surface-alt text-secondary">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-semibold text-primary mb-2">No track assigned yet</h1>
        <p className="text-sm text-secondary">
          Your mentor or admin hasn't assigned you a training track yet. Check back soon — you'll see your modules here the moment you are.
        </p>
      </div>
    );
  }

  const doneCount = modules.filter(m => completed.has(m.id)).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-accent uppercase tracking-wider mb-1">Your training track</p>
        <h1 className="text-2xl font-bold text-primary">{assignment.trackName}</h1>
        {modules.length > 0 && (
          <p className="text-sm text-secondary mt-1">{doneCount} of {modules.length} modules complete</p>
        )}
      </div>

      {modules.length === 0 ? (
        <div className="bg-surface border border-line rounded-xl text-center py-16 px-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-alt text-secondary">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-primary mb-1.5">Curriculum is on its way</h2>
          <p className="text-sm text-secondary max-w-sm mx-auto">
            {assignment.trackName} doesn't have any modules yet — they're being built. Nothing to do here for now.
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-line rounded-xl divide-y divide-line overflow-hidden">
          {modules.map((m, i) => {
            const isDone = completed.has(m.id);
            return (
              <Link
                key={m.id}
                to={`/training/${m.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-surface-alt transition-colors"
              >
                {isDone ? (
                  <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-secondary shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-primary">
                    <span className="text-secondary tabular-nums mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                    {m.title}
                  </p>
                  {m.description && <p className="text-xs text-secondary mt-0.5 truncate">{m.description}</p>}
                </div>
                {m.estimatedMinutes && (
                  <div className="flex items-center gap-1 text-xs text-secondary shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {m.estimatedMinutes} min
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
