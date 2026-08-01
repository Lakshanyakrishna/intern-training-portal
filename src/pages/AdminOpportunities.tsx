import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunityQuestions,
  createOpportunityQuestion,
  deleteOpportunityQuestion,
} from '../lib/db';
import { OPPORTUNITY_FORTES } from '../lib/db';
import type { DbOpportunity, DbOpportunityQuestion } from '../lib/db';

const CATEGORIES: DbOpportunity['category'][] = ['internship', 'training', 'fellowship', 'project'];
const STATUSES: DbOpportunity['status'][] = ['draft', 'active', 'closed'];
const QUESTION_TYPES: DbOpportunityQuestion['type'][] = ['text', 'textarea', 'select'];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  active: { label: 'Active', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  closed: { label: 'Closed', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
};

const CATEGORY_LABELS: Record<string, string> = {
  internship: 'Internship',
  training: 'Training',
  fellowship: 'Fellowship',
  project: 'Project',
};

const QUESTION_TYPE_LABELS: Record<string, string> = {
  text: 'Text',
  textarea: 'Textarea',
  select: 'Select',
};

const emptyForm = {
  title: '',
  description: '',
  category: 'internship' as DbOpportunity['category'],
  status: 'draft' as DbOpportunity['status'],
  forte: '' as DbOpportunity['forte'] | '',
  startDate: '',
  endDate: '',
  slots: 0,
};

const emptyQuestionForm = {
  question: '',
  type: 'text' as DbOpportunityQuestion['type'],
  required: true,
  options: '',
  sortOrder: 0,
};

export default function AdminOpportunities() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<DbOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Record<string, DbOpportunityQuestion[]>>({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionForm, setQuestionForm] = useState(emptyQuestionForm);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchOpportunities = useCallback(async () => {
    setError(null);
    try {
      const data = await getOpportunities();
      setOpportunities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load opportunities.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOpportunities(); }, [fetchOpportunities]);

  const fetchQuestions = useCallback(async (opportunityId: string) => {
    try {
      const data = await getOpportunityQuestions(opportunityId);
      setQuestions(prev => ({ ...prev, [opportunityId]: data }));
    } catch { /* ignore */ }
  }, []);

  async function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!questions[id]) {
      setLoadingQuestions(true);
      await fetchQuestions(id);
      setLoadingQuestions(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      await createOpportunity({
        title: form.title,
        description: form.description,
        category: form.category,
        status: form.status,
        forte: form.forte || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        slots: form.slots || undefined,
        createdBy: user.id,
      });
      setShowCreateModal(false);
      setForm(emptyForm);
      await fetchOpportunities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create opportunity.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, status: DbOpportunity['status']) {
    try {
      await updateOpportunity(id, { status });
      setOpportunities(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch { /* ignore */ }
  }

  async function handleDelete(id: string) {
    try {
      await deleteOpportunity(id);
      setOpportunities(prev => prev.filter(o => o.id !== id));
      if (expandedId === id) setExpandedId(null);
      setDeleteConfirmId(null);
    } catch { /* ignore */ }
  }

  async function handleAddQuestion(opportunityId: string) {
    if (!questionForm.question.trim()) return;
    setAddingQuestion(true);
    try {
      await createOpportunityQuestion({
        opportunityId,
        question: questionForm.question,
        type: questionForm.type,
        required: questionForm.required,
        options: questionForm.type === 'select' ? questionForm.options.split('\n').filter(Boolean) : undefined,
        sortOrder: questionForm.sortOrder,
      });
      setQuestionForm(emptyQuestionForm);
      await fetchQuestions(opportunityId);
    } catch { /* ignore */ } finally {
      setAddingQuestion(false);
    }
  }

  async function handleDeleteQuestion(opportunityId: string, questionId: string) {
    try {
      await deleteOpportunityQuestion(questionId);
      setQuestions(prev => ({
        ...prev,
        [opportunityId]: (prev[opportunityId] || []).filter(q => q.id !== questionId),
      }));
    } catch { /* ignore */ }
  }

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-line bg-surface text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';
  const selectClass = inputClass;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Opportunities</h1>
          <p className="text-sm text-secondary mt-1">Manage internship, training, fellowship, and project opportunities.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
        >
          Create Opportunity
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-5 h-5 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-surface border border-line rounded-xl p-8 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">No opportunities yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {opportunities.map(opp => (
              <div key={opp.id}>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => toggleExpand(opp.id)}
                      className="text-left w-full"
                    >
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-primary truncate">{opp.title}</p>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_LABELS[opp.status].color}`}>
                          {STATUS_LABELS[opp.status].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-secondary">{CATEGORY_LABELS[opp.category]}</span>
                        {opp.forte && (
                          <span className="text-xs text-secondary">{opp.forte}</span>
                        )}
                        {opp.slots !== undefined && opp.slots !== null && (
                          <span className="text-xs text-secondary">{opp.slots} slot{opp.slots !== 1 ? 's' : ''}</span>
                        )}
                        <span className="text-xs text-secondary">{new Date(opp.createdAt).toLocaleDateString()}</span>
                      </div>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <select
                      value={opp.status}
                      onChange={e => handleStatusChange(opp.id, e.target.value as DbOpportunity['status'])}
                      className="text-xs px-2 py-1.5 rounded-lg border border-line bg-surface text-primary"
                      onClick={e => e.stopPropagation()}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
                      ))}
                    </select>
                    {deleteConfirmId === opp.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(opp.id); }}
                          className="text-xs px-2 py-1.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setDeleteConfirmId(null); }}
                          className="text-xs px-2 py-1.5 rounded-lg border border-line text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteConfirmId(opp.id); }}
                        className="text-xs px-2 py-1.5 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                {expandedId === opp.id && (
                  <div className="px-4 pb-4 pl-8 border-t border-line pt-3">
                    <div className="mb-3">
                      <p className="text-xs text-secondary mb-1">Description</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{opp.description}</p>
                    </div>
                    {(opp.startDate || opp.endDate) && (
                      <div className="flex items-center gap-4 mb-3 text-xs text-secondary">
                        {opp.startDate && <span>Start: {new Date(opp.startDate).toLocaleDateString()}</span>}
                        {opp.endDate && <span>End: {new Date(opp.endDate).toLocaleDateString()}</span>}
                      </div>
                    )}
                    <div className="border-t border-line pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">Application Questions</h3>
                      </div>
                      {loadingQuestions ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(questions[opp.id] || []).map(q => (
                            <div key={q.id} className="flex items-start justify-between gap-2 bg-surface-alt rounded-lg px-3 py-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-primary">{q.question}</p>
                                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-secondary">
                                    {QUESTION_TYPE_LABELS[q.type]}
                                  </span>
                                  {q.required && (
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900/30 text-accent">Required</span>
                                  )}
                                </div>
                                {q.type === 'select' && q.options && q.options.length > 0 && (
                                  <p className="text-xs text-secondary mt-0.5">Options: {q.options.join(', ')}</p>
                                )}
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Order: {q.sortOrder}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteQuestion(opp.id, q.id)}
                                className="text-xs px-2 py-1 rounded border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                          {(questions[opp.id] || []).length === 0 && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 py-1">No questions added yet.</p>
                          )}
                        </div>
                      )}
                      <div className="mt-3 pt-3 border-t border-line">
                        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Add Question</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-2">
                            <input
                              value={questionForm.question}
                              onChange={e => setQuestionForm(p => ({ ...p, question: e.target.value }))}
                              placeholder="Question text"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <select
                              value={questionForm.type}
                              onChange={e => setQuestionForm(p => ({ ...p, type: e.target.value as DbOpportunityQuestion['type'] }))}
                              className={selectClass}
                            >
                              {QUESTION_TYPES.map(t => (
                                <option key={t} value={t}>{QUESTION_TYPE_LABELS[t]}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <input
                                type="checkbox"
                                checked={questionForm.required}
                                onChange={e => setQuestionForm(p => ({ ...p, required: e.target.checked }))}
                                className="rounded border-line text-neutral-600 focus:ring-accent"
                              />
                              Required
                            </label>
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-secondary">Order:</label>
                              <input
                                type="number"
                                value={questionForm.sortOrder}
                                onChange={e => setQuestionForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
                                className="w-16 px-2 py-1.5 rounded-lg border border-line bg-surface text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                              />
                            </div>
                          </div>
                          {questionForm.type === 'select' && (
                            <div className="sm:col-span-2">
                              <textarea
                                value={questionForm.options}
                                onChange={e => setQuestionForm(p => ({ ...p, options: e.target.value }))}
                                placeholder="Options (one per line)"
                                rows={3}
                                className={inputClass}
                              />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddQuestion(opp.id)}
                          disabled={addingQuestion || !questionForm.question.trim()}
                          className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {addingQuestion ? 'Adding...' : 'Add Question'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-line rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-primary">Create Opportunity</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={labelClass}>Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className={inputClass}
                  placeholder="Opportunity title"
                />
              </div>
              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  required
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className={inputClass}
                  placeholder="Describe the opportunity..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value as DbOpportunity['category'] }))}
                    className={selectClass}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value as DbOpportunity['status'] }))}
                    className={selectClass}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Forte (optional)</label>
                <select
                  value={form.forte}
                  onChange={e => setForm(p => ({ ...p, forte: e.target.value as DbOpportunity['forte'] | '' }))}
                  className={selectClass}
                >
                  <option value="">— None —</option>
                  {OPPORTUNITY_FORTES.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Slots</label>
                <input
                  type="number"
                  min={0}
                  value={form.slots}
                  onChange={e => setForm(p => ({ ...p, slots: parseInt(e.target.value) || 0 }))}
                  className={inputClass}
                  placeholder="Number of available slots"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {submitting ? 'Creating...' : 'Create Opportunity'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 border border-line text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
