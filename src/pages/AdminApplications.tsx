import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getApplications, updateApplication, getApplication,
  getResumeFiles, getResumeAnalysis, getResumeDownloadUrl,
  getAnalysisVersions, triggerAnalysis,
} from '../lib/db';
import { notifyEvent } from '../lib/notifications';
import type { DbApplication, DbResumeAnalysis, DbAnalysisVersion, DbResumeFile } from '../lib/db';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  reviewed: { label: 'Reviewed', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  shortlisted: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
};

type FilterStatus = 'all' | DbApplication['status'];

export default function AdminApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<DbApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DbApplication | null>(null);
  const [analysis, setAnalysis] = useState<DbResumeAnalysis | null | undefined>(undefined);
  const [versions, setVersions] = useState<DbAnalysisVersion[]>([]);
  const [resumeFiles, setResumeFiles] = useState<DbResumeFile[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  async function fetchApps() {
    try {
      const apps = await getApplications();
      setApplications(apps);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchApps(); }, []);

  async function handleStatusChange(id: string, status: DbApplication['status']) {
    if (!user) return;
    try {
      await updateApplication(id, { status, reviewerId: user.id, reviewerNotes: detail?.reviewerNotes });
      if (status === 'shortlisted' || status === 'rejected') {
        const app = await getApplication(id);
        if (app?.userId) {
          notifyEvent(status === 'shortlisted' ? 'application_shortlisted' : 'application_rejected', app.userId, {
            name: app.name,
            opportunity: 'the program',
          }).catch(() => {});
        }
      }
      await fetchApps();
      if (selectedId === id) {
        const updated = await getApplication(id);
        setDetail(updated);
      }
    } catch { /* ignore */ }
  }

  async function openDetail(id: string) {
    setSelectedId(id);
    setAnalysis(undefined);
    setVersions([]);
    setResumeFiles([]);
    const app = await getApplication(id);
    setDetail(app);
    getResumeFiles(id).then(setResumeFiles).catch(() => {});
    getResumeAnalysis(id).then(setAnalysis).catch(() => setAnalysis(null));
    getAnalysisVersions(id).then(setVersions).catch(() => {});
  }

  async function handleTriggerAnalysis() {
    if (!detail) return;
    setAnalyzing(true);
    try {
      await triggerAnalysis(detail.id);
      await new Promise(r => setTimeout(r, 2000));
      const updated = await getResumeAnalysis(detail.id);
      setAnalysis(updated);
      const vers = await getAnalysisVersions(detail.id);
      setVersions(vers);
    } catch { /* ignore */ } finally {
      setAnalyzing(false);
    }
  }

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const countByStatus = (status: FilterStatus) =>
    status === 'all' ? applications.length : applications.filter(a => a.status === status).length;

  const statuses: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'reviewed', label: 'Reviewed' },
    { key: 'shortlisted', label: 'Shortlisted' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'accepted', label: 'Accepted' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Application Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review, shortlist, and manage applications.</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {statuses.map(s => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === s.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {s.label} ({countByStatus(s.key)})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">No applications found.</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[70vh] overflow-y-auto">
              {filtered.map(app => {
                const si = STATUS_LABELS[app.status];
                return (
                  <button
                    key={app.id}
                    onClick={() => openDetail(app.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      selectedId === app.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{app.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.email}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${si.color}`}>{si.label}</span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {!detail ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
              <p className="text-sm text-gray-400 dark:text-gray-500">Select an application to review.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{detail.name}</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={detail.status}
                    onChange={e => handleStatusChange(detail.id, e.target.value as DbApplication['status'])}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Mark Reviewed</option>
                    <option value="shortlisted">Shortlist</option>
                    <option value="rejected">Reject</option>
                    <option value="accepted">Accept</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{detail.email}</p>
                </div>
                {detail.phone && <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{detail.phone}</p>
                </div>}
                {detail.college && <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">College</p>
                  <p className="font-medium text-gray-900 dark:text-white">{detail.college}</p>
                </div>}
                {detail.major && <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Major</p>
                  <p className="font-medium text-gray-900 dark:text-white">{detail.major}</p>
                </div>}
                {detail.yearOfStudy && <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Year of Study</p>
                  <p className="font-medium text-gray-900 dark:text-white">{detail.yearOfStudy}</p>
                </div>}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
                  <p className="font-medium text-gray-900 dark:text-white">{new Date(detail.appliedAt).toLocaleDateString()}</p>
                </div>
                {detail.heardFrom && <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Heard From</p>
                  <p className="font-medium text-gray-900 dark:text-white">{detail.heardFrom}</p>
                </div>}
              </div>

              {detail.whyJoin && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Why they want to join</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">{detail.whyJoin}</p>
                </div>
              )}

              {/* Resume + AI Analysis */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Resume & AI Screening</h3>
                  <button
                    onClick={handleTriggerAnalysis}
                    disabled={analyzing}
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {analyzing ? 'Analyzing...' : (analysis ? 'Re-analyze' : 'Analyze')}
                  </button>
                </div>

                {resumeFiles.length > 0 && (
                  <div className="text-sm">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Resume</p>
                    {resumeFiles.map(rf => (
                      <a
                        key={rf.id}
                        href={getResumeDownloadUrl(rf.filePath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900/30 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {rf.fileName} ({(rf.fileSize / 1024).toFixed(0)} KB)
                      </a>
                    ))}
                  </div>
                )}

                {analysis === undefined && (
                  <p className="text-sm text-gray-400 dark:text-gray-500">Loading analysis...</p>
                )}

                {analysis === null && resumeFiles.length > 0 && (
                  <p className="text-sm text-gray-400 dark:text-gray-500">Not yet analyzed. Click "Analyze" to run AI screening.</p>
                )}

                {analysis && (
                  <div className="space-y-4">
                    {/* Score bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Overall Score</span>
                        <span className={`text-sm font-bold ${(analysis.overallScore || 0) >= 70 ? 'text-green-600 dark:text-green-400' : (analysis.overallScore || 0) >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                          {analysis.overallScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${
                          (analysis.overallScore || 0) >= 70 ? 'bg-green-500' : (analysis.overallScore || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} style={{ width: `${analysis.overallScore || 0}%` }} />
                      </div>
                    </div>

                    {/* Recommendation badge */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        analysis.recommendation === 'strongly_recommend' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        analysis.recommendation === 'recommend' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        analysis.recommendation === 'neutral' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {analysis.recommendation?.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Confidence: {analysis.confidenceScore}%</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">v{analysis.analysisVersion}</span>
                    </div>

                    {/* Top Reasons */}
                    {analysis.topReasons && analysis.topReasons.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Top Reasons</p>
                        <ol className="list-decimal list-inside text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
                          {analysis.topReasons.map((r, i) => <li key={i}>{r}</li>)}
                        </ol>
                      </div>
                    )}

                    {/* Detailed Scores */}
                    <details className="text-sm">
                      <summary className="cursor-pointer text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">Detailed Scores</summary>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {[
                          { label: 'Technical', value: analysis.technicalScore },
                          { label: 'Projects', value: analysis.projectsScore },
                          { label: 'GitHub', value: analysis.githubScore },
                          { label: 'Portfolio', value: analysis.portfolioScore },
                          { label: 'Education', value: analysis.educationScore },
                          { label: 'Experience', value: analysis.experienceScore },
                          { label: 'Communication', value: analysis.communicationScore },
                          { label: 'Learning Potential', value: analysis.learningPotentialScore },
                          { label: 'Motivation', value: analysis.motivationScore },
                          { label: 'Resume Quality', value: analysis.resumeQualityScore },
                        ].map(s => (
                          <div key={s.label} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{s.label}</span>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{s.value ?? '-'}</span>
                          </div>
                        ))}
                      </div>
                    </details>

                    {/* Strengths / Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analysis.strengths && analysis.strengths.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Strengths</p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5 list-disc list-inside">
                            {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Weaknesses</p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5 list-disc list-inside">
                            {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Missing Skills */}
                    {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">Missing Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.missingSkills.map((s, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Version History */}
                    {versions.length > 1 && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">Analysis History ({versions.length} versions)</summary>
                        <div className="mt-2 space-y-2">
                          {versions.map(v => (
                            <div key={v.id} className="px-3 py-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg text-xs text-gray-600 dark:text-gray-400">
                              <span className="font-medium text-gray-700 dark:text-gray-300">v{v.versionNumber}</span>
                              {' '}— {v.triggerReason} — {new Date(v.createdAt).toLocaleDateString()}
                              {v.scores && ` — Score: ${v.scores.overall || '-'}`}
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reviewer Notes</p>
                <textarea
                  value={detail.reviewerNotes || ''}
                  onChange={async e => {
                    const updated = { ...detail, reviewerNotes: e.target.value };
                    setDetail(updated);
                  }}
                  onBlur={async () => {
                    if (detail.reviewerNotes !== undefined) {
                      await updateApplication(detail.id, { reviewerNotes: detail.reviewerNotes, reviewerId: user?.id });
                    }
                  }}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add reviewer notes..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
