import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMentorMentees, createReadinessEvaluation, getReadinessEvaluations } from '../lib/db';
import { useSearchParams } from 'react-router-dom';
import { notifyEvent } from '../lib/notifications';
import type { DbReadinessEvaluation } from '../lib/db';

export default function ReadinessEvaluation() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedIntern = searchParams.get('internId');

  const [mentees, setMentees] = useState<{ internId: string; internName?: string }[]>([]);
  const [selectedInternId, setSelectedInternId] = useState(preselectedIntern || '');
  const [existing, setExisting] = useState<DbReadinessEvaluation[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    technicalReadiness: 3,
    communicationReadiness: 3,
    problemSolvingReadiness: 3,
    overallReadiness: 3,
    strengths: '',
    areasForImprovement: '',
    recommendation: 'needs_improvement' as DbReadinessEvaluation['recommendation'],
  });

  useEffect(() => {
    if (!user) return;
    getMentorMentees(user.id).then(assignments => {
      setMentees(assignments.map(a => ({ internId: a.internId, internName: a.internName })));
    }).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!selectedInternId) { setExisting([]); return; }
    getReadinessEvaluations(selectedInternId).then(setExisting).catch(() => {});
  }, [selectedInternId]);

  useEffect(() => {
    if (preselectedIntern) setSelectedInternId(preselectedIntern);
  }, [preselectedIntern]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !selectedInternId) return;
    setSaving(true);
    setMessage(null);
    try {
      await createReadinessEvaluation({
        internId: selectedInternId,
        evaluatorId: user.id,
        technicalReadiness: form.technicalReadiness,
        communicationReadiness: form.communicationReadiness,
        problemSolvingReadiness: form.problemSolvingReadiness,
        overallReadiness: form.overallReadiness,
        strengths: form.strengths.split('\n').filter(Boolean),
        areasForImprovement: form.areasForImprovement.split('\n').filter(Boolean),
        recommendation: form.recommendation,
      });
      setMessage({ type: 'success', text: 'Readiness evaluation saved.' });
      if (form.recommendation === 'ready') {
        notifyEvent('ready_for_projects', selectedInternId, {
          name: menteeName,
        }).catch(() => {});
      } else if (form.recommendation === 'needs_improvement') {
        notifyEvent('additional_training_required', selectedInternId, {
          name: menteeName,
        }).catch(() => {});
      }
      const evals = await getReadinessEvaluations(selectedInternId);
      setExisting(evals);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  }

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  const menteeName = mentees.find(m => m.internId === selectedInternId)?.internName || 'Unknown';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Readiness Evaluation</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Evaluate intern readiness for client project.</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm border ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5">
            <div>
              <label className={labelClass}>Intern *</label>
              <select required value={selectedInternId} onChange={e => setSelectedInternId(e.target.value)} className={inputClass}>
                <option value="">Select mentee...</option>
                {mentees.map(m => (
                  <option key={m.internId} value={m.internId}>{m.internName || 'Unknown'}</option>
                ))}
              </select>
            </div>

            {selectedInternId && (
              <>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Evaluating: {menteeName}</p>

                <div className="grid grid-cols-2 gap-4">
                  {([
                    { key: 'technicalReadiness' as const, label: 'Technical Readiness' },
                    { key: 'communicationReadiness' as const, label: 'Communication' },
                    { key: 'problemSolvingReadiness' as const, label: 'Problem Solving' },
                    { key: 'overallReadiness' as const, label: 'Overall' },
                  ]).map(f => (
                    <div key={f.key}>
                      <label className={labelClass}>{f.label} (1-5)</label>
                      <select value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: Number(e.target.value) }))} className={inputClass}>
                        {[1,2,3,4,5].map(n => (
                          <option key={n} value={n}>{n} — {n === 1 ? 'Poor' : n === 2 ? 'Below Avg' : n === 3 ? 'Average' : n === 4 ? 'Good' : 'Excellent'}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div>
                  <label className={labelClass}>Strengths (one per line)</label>
                  <textarea value={form.strengths} onChange={e => setForm(p => ({ ...p, strengths: e.target.value }))} rows={3} className={inputClass} placeholder="Strong technical foundation..." />
                </div>

                <div>
                  <label className={labelClass}>Areas for Improvement (one per line)</label>
                  <textarea value={form.areasForImprovement} onChange={e => setForm(p => ({ ...p, areasForImprovement: e.target.value }))} rows={3} className={inputClass} placeholder="Needs more practice with..." />
                </div>

                <div>
                  <label className={labelClass}>Recommendation</label>
                  <select value={form.recommendation} onChange={e => setForm(p => ({ ...p, recommendation: e.target.value as DbReadinessEvaluation['recommendation'] }))} className={inputClass}>
                    <option value="ready">Ready for Project</option>
                    <option value="needs_improvement">Needs Improvement</option>
                    <option value="not_ready">Not Ready</option>
                  </select>
                </div>

                <button type="submit" disabled={saving} className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm">
                  {saving ? 'Saving...' : 'Save Evaluation'}
                </button>
              </>
            )}
          </form>
        </div>

        {/* History */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Evaluation History</h3>
          {existing.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500">No previous evaluations.</p>
          ) : (
            <div className="space-y-3">
              {existing.map(e => (
                <div key={e.id} className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-1">
                  <p className="text-gray-500 dark:text-gray-400">{new Date(e.evaluatedAt).toLocaleDateString()}</p>
                  <p><span className="text-gray-500">Technical:</span> {e.technicalReadiness}/5</p>
                  <p><span className="text-gray-500">Communication:</span> {e.communicationReadiness}/5</p>
                  <p><span className="text-gray-500">Problem Solving:</span> {e.problemSolvingReadiness}/5</p>
                  <p><span className="text-gray-500">Overall:</span> {e.overallReadiness}/5</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full font-medium mt-1 ${
                    e.recommendation === 'ready' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    e.recommendation === 'needs_improvement' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}>{e.recommendation.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
