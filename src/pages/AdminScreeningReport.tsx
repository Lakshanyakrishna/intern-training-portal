import { useState, useEffect } from 'react';
import { getApplications, getResumeAnalysis } from '../lib/db';
import type { DbApplication, DbResumeAnalysis } from '../lib/db';

interface AnalysisWithApp {
  app: DbApplication;
  analysis: DbResumeAnalysis;
}

export default function AdminScreeningReport() {
  const [data, setData] = useState<AnalysisWithApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const apps = await getApplications();
        const results: AnalysisWithApp[] = [];
        for (const app of apps) {
          const analysis = await getResumeAnalysis(app.id);
          if (analysis) {
            results.push({ app, analysis });
          }
        }
        setData(results);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = data.length;
  const avgScore = data.length > 0
    ? Math.round(data.reduce((s, d) => s + (d.analysis.overallScore || 0), 0) / data.length)
    : 0;
  const recommended = data.filter(d =>
    d.analysis.recommendation === 'strongly_recommend' || d.analysis.recommendation === 'recommend'
  ).length;
  const weak = data.filter(d =>
    d.analysis.recommendation === 'weak' || d.analysis.recommendation === 'reject'
  ).length;
  const neutral = data.filter(d => d.analysis.recommendation === 'neutral').length;

  const byRecommendation: Record<string, AnalysisWithApp[]> = {};
  for (const d of data) {
    const rec = d.analysis.recommendation || 'unknown';
    if (!byRecommendation[rec]) byRecommendation[rec] = [];
    byRecommendation[rec].push(d);
  }

  const allSkills = new Map<string, number>();
  const allWeaknesses = new Map<string, number>();
  for (const d of data) {
    for (const s of d.analysis.missingSkills || []) {
      allSkills.set(s, (allSkills.get(s) || 0) + 1);
    }
    for (const w of d.analysis.weaknesses || []) {
      allWeaknesses.set(w, (allWeaknesses.get(w) || 0) + 1);
    }
  }
  const topMissingSkills = [...allSkills.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const topWeaknesses = [...allWeaknesses.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">AI Screening Report</h1>
        <p className="text-sm text-secondary mt-1">Cross-opportunity analysis of AI-screened applications.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-surface border border-line rounded-xl p-8 text-center">
          <p className="text-sm text-secondary">No analyzed applications found. Run AI screening on applications first.</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-surface border border-line rounded-xl p-4">
              <p className="text-2xl font-bold text-primary">{total}</p>
              <p className="text-xs text-secondary">Analyzed</p>
            </div>
            <div className="bg-surface border border-line rounded-xl p-4">
              <p className="text-2xl font-bold text-primary">{avgScore}</p>
              <p className="text-xs text-secondary">Avg Score</p>
            </div>
            <div className="bg-surface border border-line rounded-xl p-4">
              <p className="text-2xl font-bold text-green-600">{recommended}</p>
              <p className="text-xs text-secondary">Recommended</p>
            </div>
            <div className="bg-surface border border-line rounded-xl p-4">
              <p className="text-2xl font-bold text-yellow-600">{neutral}</p>
              <p className="text-xs text-secondary">Neutral</p>
            </div>
            <div className="bg-surface border border-line rounded-xl p-4">
              <p className="text-2xl font-bold text-red-600">{weak}</p>
              <p className="text-xs text-secondary">Weak/Reject</p>
            </div>
          </div>

          {/* By recommendation */}
          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-3">Applications by Recommendation</h2>
            <div className="space-y-2">
              {Object.entries(byRecommendation).map(([rec, items]) => (
                <div key={rec} className="flex items-center gap-3 text-sm">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-28 text-center ${
                    rec === 'strongly_recommend' || rec === 'recommend' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    rec === 'neutral' ? 'bg-surface-alt text-secondary' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}>{rec.replace('_', ' ')}</span>
                  <span className="text-secondary">{items.length} applications</span>
                  <div className="flex-1 bg-surface-alt rounded-full h-2">
                    <div className="h-2 rounded-full bg-accent" style={{ width: `${(items.length / data.length) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topMissingSkills.length > 0 && (
              <div className="bg-surface border border-line rounded-xl p-5">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-3">Most Common Missing Skills</h2>
                <div className="space-y-2">
                  {topMissingSkills.map(([skill, count]) => (
                    <div key={skill} className="flex items-center gap-3 text-sm">
                      <span className="flex-1 text-primary">{skill}</span>
                      <span className="text-xs text-secondary">{count}</span>
                      <div className="w-24 bg-surface-alt rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-orange-500" style={{ width: `${(count / data.length) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {topWeaknesses.length > 0 && (
              <div className="bg-surface border border-line rounded-xl p-5">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-3">Most Common Weaknesses</h2>
                <div className="space-y-2">
                  {topWeaknesses.map(([weakness, count]) => (
                    <div key={weakness} className="flex items-center gap-3 text-sm">
                      <span className="flex-1 text-primary">{weakness}</span>
                      <span className="text-xs text-secondary">{count}</span>
                      <div className="w-24 bg-surface-alt rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-red-500" style={{ width: `${(count / data.length) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
