import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApplications, getInterviews, createInterview, getInterviewEvaluation, upsertInterviewEvaluation, updateInterview } from '../lib/db';
import { notifyEvent } from '../lib/notifications';
import type { DbApplication, DbInterview, DbInterviewEvaluation } from '../lib/db';

type Tab = 'schedule' | 'evaluate' | 'list';

export default function AdminInterviews() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<DbApplication[]>([]);
  const [interviews, setInterviews] = useState<DbInterview[]>([]);
  const [tab, setTab] = useState<Tab>('list');
  const [loading, setLoading] = useState(true);

  // Schedule form
  const [selectedAppId, setSelectedAppId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState(45);
  const [interviewers, setInterviewers] = useState('');
  const [meetLink, setMeetLink] = useState('');

  // Evaluation
  const [evalInterviewId, setEvalInterviewId] = useState('');
  const [evalData, setEvalData] = useState({
    technicalScore: 5,
    communicationScore: 5,
    problemSolvingScore: 5,
    overallScore: 5,
    strengths: '',
    weaknesses: '',
    notes: '',
    recommendation: 'maybe' as DbInterviewEvaluation['recommendation'],
  });

  async function refresh() {
    setLoading(true);
    try {
      const [apps, ints] = await Promise.all([getApplications(), getInterviews()]);
      setApplications(apps.filter(a => a.status === 'shortlisted' || a.status === 'accepted'));
      setInterviews(ints);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    const app = applications.find(a => a.id === selectedAppId);
    if (!app || !user) return;

    try {
      await createInterview({
        applicationId: selectedAppId,
        applicantId: app.userId!,
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: duration,
        interviewers: interviewers.split(',').map(s => s.trim()).filter(Boolean),
        meetLink: meetLink || undefined,
      });
      setScheduledAt('');
      setMeetLink('');
      setInterviewers('');
      await refresh();
      if (app.userId) {
        notifyEvent('interview_scheduled', app.userId, {
          name: app.name,
          date: new Date(scheduledAt).toLocaleDateString(),
          time: new Date(scheduledAt).toLocaleTimeString(),
          meet_link: meetLink || '',
          opportunity: 'the program',
        }).catch(() => {});
      }
      setTab('list');
    } catch { /* ignore */ }
  }

  async function handleEvaluate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    try {
      await upsertInterviewEvaluation({
        interviewId: evalInterviewId,
        evaluatorId: user.id,
        technicalScore: evalData.technicalScore,
        communicationScore: evalData.communicationScore,
        problemSolvingScore: evalData.problemSolvingScore,
        overallScore: evalData.overallScore,
        strengths: evalData.strengths.split('\n').filter(Boolean),
        weaknesses: evalData.weaknesses.split('\n').filter(Boolean),
        notes: evalData.notes,
        recommendation: evalData.recommendation,
      });
      await refresh();
      setTab('list');
    } catch { /* ignore */ }
  }

  function startEvaluation(iv: DbInterview) {
    setEvalInterviewId(iv.id);
    getInterviewEvaluation(iv.id).then(existing => {
      if (existing) {
        setEvalData({
          technicalScore: existing.technicalScore ?? 5,
          communicationScore: existing.communicationScore ?? 5,
          problemSolvingScore: existing.problemSolvingScore ?? 5,
          overallScore: existing.overallScore ?? 5,
          strengths: existing.strengths.join('\n'),
          weaknesses: existing.weaknesses.join('\n'),
          notes: existing.notes || '',
          recommendation: existing.recommendation || 'maybe',
        });
      } else {
        setEvalData({ technicalScore: 5, communicationScore: 5, problemSolvingScore: 5, overallScore: 5, strengths: '', weaknesses: '', notes: '', recommendation: 'maybe' });
      }
    }).catch(() => {});
    setTab('evaluate');
  }

  const shortlistedApps = applications.filter(a => a.status === 'shortlisted' && a.userId);

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interviews</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Schedule and evaluate interviews.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setTab('list'); refresh(); }} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${tab === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>All Interviews</button>
          <button onClick={() => setTab('schedule')} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${tab === 'schedule' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>Schedule New</button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* List tab */}
          {tab === 'list' && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              {interviews.length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">No interviews scheduled yet.</div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {interviews.map(iv => (
                    <div key={iv.id} className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(iv.scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          {' at '}
                          {new Date(iv.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {iv.durationMinutes} min
                          {iv.interviewers.length > 0 && ` \u2022 ${iv.interviewers.join(', ')}`}
                          {iv.meetLink && ` \u2022 ${iv.meetLink}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                          iv.status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                          iv.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>{iv.status}</span>
                        {iv.status === 'scheduled' && (
                          <>
                            <button onClick={() => startEvaluation(iv)} className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Evaluate</button>
                            <button onClick={async () => {
                              await updateInterview(iv.id, { status: 'completed' });
                              const evaluation = await getInterviewEvaluation(iv.id);
                              if (evaluation?.recommendation === 'strong_accept' || evaluation?.recommendation === 'accept') {
                                notifyEvent('interview_passed', iv.applicantId, {
                                  name: applications.find(a => a.id === iv.applicationId)?.name || 'Applicant',
                                  date: new Date(iv.scheduledAt).toLocaleDateString(),
                                  time: new Date(iv.scheduledAt).toLocaleTimeString(),
                                  meet_link: iv.meetLink || '',
                                  opportunity: 'the program',
                                }).catch(() => {});
                              } else if (evaluation?.recommendation === 'reject') {
                                notifyEvent('interview_rejected', iv.applicantId, {
                                  name: applications.find(a => a.id === iv.applicationId)?.name || 'Applicant',
                                  date: new Date(iv.scheduledAt).toLocaleDateString(),
                                  time: new Date(iv.scheduledAt).toLocaleTimeString(),
                                  meet_link: iv.meetLink || '',
                                  opportunity: 'the program',
                                }).catch(() => {});
                              }
                              refresh();
                            }} className="text-xs px-2.5 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">Complete</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Schedule tab */}
          {tab === 'schedule' && (
            <form onSubmit={handleSchedule} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-xl space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule Interview</h2>

              <div>
                <label className={labelClass}>Applicant *</label>
                <select required value={selectedAppId} onChange={e => setSelectedAppId(e.target.value)} className={inputClass}>
                  <option value="">Select shortlisted applicant...</option>
                  {shortlistedApps.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Date & Time *</label>
                <input type="datetime-local" required value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Duration (min)</label>
                  <input type="number" min={15} max={180} value={duration} onChange={e => setDuration(Number(e.target.value))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Meet Link</label>
                  <input type="url" value={meetLink} onChange={e => setMeetLink(e.target.value)} className={inputClass} placeholder="https://meet.google.com/..." />
                </div>
              </div>

              <div>
                <label className={labelClass}>Interviewers (comma-separated names)</label>
                <input type="text" value={interviewers} onChange={e => setInterviewers(e.target.value)} className={inputClass} placeholder="John, Jane" />
              </div>

              <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Schedule Interview
              </button>
            </form>
          )}

          {/* Evaluate tab */}
          {tab === 'evaluate' && (
            <form onSubmit={handleEvaluate} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-xl space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Interview Evaluation</h2>

              <div className="grid grid-cols-2 gap-4">
                {(['technicalScore', 'communicationScore', 'problemSolvingScore', 'overallScore'] as const).map(field => (
                  <div key={field}>
                    <label className={labelClass}>
                      {field === 'technicalScore' ? 'Technical' : field === 'communicationScore' ? 'Communication' : field === 'problemSolvingScore' ? 'Problem Solving' : 'Overall'} (1-10)
                    </label>
                    <select value={evalData[field]} onChange={e => setEvalData(p => ({ ...p, [field]: Number(e.target.value) }))} className={inputClass}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div>
                <label className={labelClass}>Strengths (one per line)</label>
                <textarea value={evalData.strengths} onChange={e => setEvalData(p => ({ ...p, strengths: e.target.value }))} rows={3} className={inputClass} placeholder="Strong problem-solving skills..." />
              </div>

              <div>
                <label className={labelClass}>Weaknesses (one per line)</label>
                <textarea value={evalData.weaknesses} onChange={e => setEvalData(p => ({ ...p, weaknesses: e.target.value }))} rows={3} className={inputClass} placeholder="Needs improvement in..." />
              </div>

              <div>
                <label className={labelClass}>Notes</label>
                <textarea value={evalData.notes} onChange={e => setEvalData(p => ({ ...p, notes: e.target.value }))} rows={3} className={inputClass} placeholder="Additional comments..." />
              </div>

              <div>
                <label className={labelClass}>Recommendation</label>
                <select value={evalData.recommendation} onChange={e => setEvalData(p => ({ ...p, recommendation: e.target.value as DbInterviewEvaluation['recommendation'] }))} className={inputClass}>
                  <option value="strong_accept">Strong Accept</option>
                  <option value="accept">Accept</option>
                  <option value="maybe">Maybe</option>
                  <option value="reject">Reject</option>
                </select>
              </div>

              <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Save Evaluation
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
