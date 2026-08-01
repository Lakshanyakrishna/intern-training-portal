import { useState, useEffect } from 'react';
import { getCompletionStats, getAllInternshipOutcomes, getAllTrainingCertificates, getAllInternshipCertificates } from '../lib/db';
import type { DbInternshipOutcome, DbTrainingCertificate, DbInternshipCertificate } from '../lib/db';

function Checkmark({ ok }: { ok: boolean }) {
  return ok
    ? <span className="text-green-600 dark:text-green-400 font-bold">&#10003;</span>
    : <span className="text-gray-300 dark:text-gray-600">&#8212;</span>;
}

export default function AdminCompletionReport() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getCompletionStats>> | null>(null);
  const [outcomes, setOutcomes] = useState<DbInternshipOutcome[]>([]);
  const [trainingCerts, setTrainingCerts] = useState<DbTrainingCertificate[]>([]);
  const [internshipCerts, setInternshipCerts] = useState<DbInternshipCertificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, o, tc, ic] = await Promise.all([
          getCompletionStats(),
          getAllInternshipOutcomes(),
          getAllTrainingCertificates(),
          getAllInternshipCertificates(),
        ]);
        setStats(s);
        setOutcomes(o);
        setTrainingCerts(tc);
        setInternshipCerts(ic);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-5 h-5 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const noData = !stats || stats.totalApplications === 0;

  const funnelCards = [
    { label: 'Applications', value: stats?.totalApplications ?? 0, color: 'text-neutral-600' },
    { label: 'Interviews', value: stats?.totalInterviews ?? 0, color: 'text-indigo-600' },
    { label: 'Accepted', value: stats?.totalAccepted ?? 0, color: 'text-purple-600' },
    { label: 'Training Completed', value: stats?.trainingCompleted ?? 0, color: 'text-teal-600' },
    { label: 'Readiness Approved', value: stats?.readinessApproved ?? 0, color: 'text-cyan-600' },
    { label: 'Projects Assigned', value: stats?.projectsAssigned ?? 0, color: 'text-orange-600' },
    { label: 'Projects Completed', value: stats?.projectsCompleted ?? 0, color: 'text-green-600' },
    { label: 'Training Certs Issued', value: stats?.trainingCertificatesIssued ?? 0, color: 'text-emerald-600' },
    { label: 'Internship Certs Issued', value: stats?.internshipCertificatesIssued ?? 0, color: 'text-amber-600' },
  ];

  const conversionCards = [
    { label: 'Training Completion Rate', value: `${stats?.trainingCompletionRate ?? 0}%` },
    { label: 'Readiness Pass Rate', value: `${stats?.readinessPassRate ?? 0}%` },
    { label: 'Project Completion Rate', value: `${stats?.projectCompletionRate ?? 0}%` },
    { label: 'Average Readiness Score', value: `${(stats?.avgReadinessScore ?? 0) / 10}` },
  ];

  const recentCerts = [
    ...trainingCerts.map(c => ({ ...c, type: 'Training' as const })),
    ...internshipCerts.map(c => ({ ...c, type: 'Internship' as const })),
  ]
    .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
    .slice(0, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Completion & Success Metrics</h1>
        <p className="text-sm text-secondary mt-1">Funnel summary, conversion rates, outcomes, and certificates.</p>
      </div>

      {noData ? (
        <div className="bg-surface border border-line rounded-xl p-8 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">No completion data available yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {funnelCards.map(card => (
              <div key={card.label} className="bg-surface border border-line rounded-xl p-4">
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-xs text-secondary mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {conversionCards.map(card => (
              <div key={card.label} className="bg-surface border border-line rounded-xl p-4">
                <p className="text-xl font-bold text-primary">{card.value}</p>
                <p className="text-xs text-secondary mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-line rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-line bg-surface-alt">
              <h2 className="text-sm font-semibold text-primary">Internship Outcomes</h2>
              <p className="text-xs text-secondary">{outcomes.length} record{outcomes.length !== 1 ? 's' : ''}</p>
            </div>
            {outcomes.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">No outcomes recorded.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-secondary uppercase border-b border-line">
                      <th className="text-left px-4 py-2 font-medium">User</th>
                      <th className="text-center px-2 py-2 font-medium">Training</th>
                      <th className="text-center px-2 py-2 font-medium">Project</th>
                      <th className="text-center px-2 py-2 font-medium">Mentor</th>
                      <th className="text-center px-2 py-2 font-medium">Internship</th>
                      <th className="text-center px-2 py-2 font-medium">Rating</th>
                      <th className="text-center px-2 py-2 font-medium">Completed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {outcomes.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-2">
                          <p className="font-medium text-primary">{o.userName ?? o.userId.slice(0, 8)}</p>
                          {o.userEmail && <p className="text-xs text-gray-400">{o.userEmail}</p>}
                        </td>
                        <td className="px-2 py-2 text-center"><Checkmark ok={o.trainingCompleted} /></td>
                        <td className="px-2 py-2 text-center"><Checkmark ok={o.projectCompleted} /></td>
                        <td className="px-2 py-2 text-center"><Checkmark ok={o.mentorApproved} /></td>
                        <td className="px-2 py-2 text-center"><Checkmark ok={o.internshipCompleted} /></td>
                        <td className="px-2 py-2 text-center">
                          {o.finalRating != null
                            ? <span className="text-sm font-semibold text-primary">{o.finalRating}</span>
                            : <span className="text-gray-300 dark:text-gray-600">&mdash;</span>
                          }
                        </td>
                        <td className="px-2 py-2 text-center text-xs text-secondary">
                          {o.completedAt ? new Date(o.completedAt).toLocaleDateString() : <span className="text-gray-300 dark:text-gray-600">&mdash;</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-surface border border-line rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-line bg-surface-alt">
              <h2 className="text-sm font-semibold text-primary">Recent Certificates</h2>
              <p className="text-xs text-secondary">Last 20 issued certificates</p>
            </div>
            {recentCerts.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">No certificates issued yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-secondary uppercase border-b border-line">
                      <th className="text-left px-4 py-2 font-medium">User</th>
                      <th className="text-left px-3 py-2 font-medium">Type</th>
                      <th className="text-left px-3 py-2 font-medium">Certificate #</th>
                      <th className="text-left px-3 py-2 font-medium">Issued</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {recentCerts.map(c => (
                      <tr key={`${c.type}-${c.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-2 font-medium text-primary">{c.userName ?? c.userId.slice(0, 8)}</td>
                        <td className="px-3 py-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            c.type === 'Training'
                              ? 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          }`}>{c.type}</span>
                        </td>
                        <td className="px-3 py-2 text-xs text-secondary font-mono">{c.certificateNumber}</td>
                        <td className="px-3 py-2 text-xs text-secondary">{new Date(c.issuedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
