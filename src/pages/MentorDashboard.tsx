import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMentorMentees, getReadinessEvaluations, getProjectAllocationByIntern } from '../lib/db';
import { Link } from 'react-router-dom';
import type { DbMentorAssignment } from '../lib/db';

export default function MentorDashboard() {
  const { user } = useAuth();
  const [mentees, setMentees] = useState<(DbMentorAssignment & { readiness?: string; project?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMentorMentees(user.id).then(async assignments => {
      const enriched = await Promise.all(
        assignments.map(async a => {
          const [evals, project] = await Promise.all([
            getReadinessEvaluations(a.internId),
            getProjectAllocationByIntern(a.internId),
          ]);
          const latest = evals[0];
          return {
            ...a,
            readiness: latest?.recommendation,
            project: project?.projectName,
          };
        })
      );
      setMentees(enriched);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Mentor Dashboard</h1>
        <p className="text-sm text-secondary">Welcome back, {user?.name}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Mentees', value: mentees.length, color: 'bg-neutral-50 dark:bg-neutral-900/20 text-accent' },
          { label: 'Ready for Project', value: mentees.filter(m => m.readiness === 'ready').length, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
          { label: 'Needs Improvement', value: mentees.filter(m => m.readiness === 'needs_improvement' || m.readiness === 'not_ready').length, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
          { label: 'On Project', value: mentees.filter(m => m.project).length, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl px-4 py-4`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mentees table */}
      <div className="bg-surface border border-line rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-line bg-surface-alt">
          <h2 className="text-sm font-semibold text-primary">My Mentees</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : mentees.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">
            No mentees assigned yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {mentees.map(m => (
              <div key={m.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-primary">{m.internName || 'Unknown'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {m.readiness && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        m.readiness === 'ready' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        m.readiness === 'needs_improvement' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {m.readiness === 'ready' ? 'Ready' : m.readiness === 'needs_improvement' ? 'Needs Work' : 'Not Ready'}
                      </span>
                    )}
                    {m.project && (
                      <span className="text-xs text-secondary">Project: {m.project}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/mentor/readiness?internId=${m.internId}`} className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors">
                    Evaluate
                  </Link>
                  <Link to={`/mentor/interns?internId=${m.internId}`} className="text-xs px-3 py-1.5 rounded-lg border border-line text-secondary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
