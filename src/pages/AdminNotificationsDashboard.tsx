import { useState, useEffect, useCallback } from 'react';
import {
  getEmailLogs,
  getEmailLogsSummary,
  getAllNotificationTemplates,
  getNotificationsSummary,
  upsertNotificationTemplate,
  updateEmailLogStatus,
} from '../lib/db';
import { sendEmail } from '../lib/notifications';
import type { DbEmailLog, DbNotificationTemplate } from '../lib/db';

type Tab = 'logs' | 'templates';

export default function AdminNotificationsDashboard() {
  const [tab, setTab] = useState<Tab>('logs');
  const [notifSummary, setNotifSummary] = useState<{ total: number; unread: number }>({ total: 0, unread: 0 });
  const [emailSummary, setEmailSummary] = useState<{ total: number; sent: number; failed: number; pending: number }>({ total: 0, sent: 0, failed: 0, pending: 0 });
  const [emailLogs, setEmailLogs] = useState<DbEmailLog[]>([]);
  const [templates, setTemplates] = useState<DbNotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ subject: '', emailBody: '', inAppTemplate: '' });
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ns, es, logs, tmpls] = await Promise.all([
        getNotificationsSummary(),
        getEmailLogsSummary(),
        getEmailLogs({ limit: 50 }),
        getAllNotificationTemplates(),
      ]);
      setNotifSummary({ total: ns.total, unread: ns.unread });
      setEmailSummary(es);
      setEmailLogs(logs);
      setTemplates(tmpls);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function startEdit(t: DbNotificationTemplate) {
    setEditingTemplateId(t.id);
    setEditForm({ subject: t.subject, emailBody: t.emailBody, inAppTemplate: t.inAppTemplate });
    setMessage(null);
  }

  function cancelEdit() {
    setEditingTemplateId(null);
    setEditForm({ subject: '', emailBody: '', inAppTemplate: '' });
  }

  async function saveTemplate(t: DbNotificationTemplate) {
    setSavingTemplate(true);
    setMessage(null);
    try {
      await upsertNotificationTemplate({
        eventType: t.eventType,
        subject: editForm.subject,
        emailBody: editForm.emailBody,
        inAppTemplate: editForm.inAppTemplate,
      });
      setTemplates(prev =>
        prev.map(item =>
          item.id === t.id
            ? { ...item, subject: editForm.subject, emailBody: editForm.emailBody, inAppTemplate: editForm.inAppTemplate }
            : item
        )
      );
      setEditingTemplateId(null);
      setMessage({ type: 'success', text: 'Template saved.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save template.' });
    } finally {
      setSavingTemplate(false);
    }
  }

  async function handleRetry(log: DbEmailLog) {
    try {
      await updateEmailLogStatus(log.id, 'pending');
      setEmailLogs(prev =>
        prev.map(item => (item.id === log.id ? { ...item, status: 'pending' as const } : item))
      );
      await sendEmail(log.id);
      setEmailLogs(prev =>
        prev.map(item => (item.id === log.id ? { ...item, status: 'sent' as const } : item))
      );
    } catch {
      setEmailLogs(prev =>
        prev.map(item => (item.id === log.id ? { ...item, status: 'failed' as const } : item))
      );
    }
  }

  const successRate = emailSummary.total > 0
    ? Math.round((emailSummary.sent / emailSummary.total) * 100)
    : 0;

  function statCard(label: string, value: string | number, colorClass: string) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4">
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor notifications, email delivery, and templates.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCard('Total Notifications', notifSummary.total, 'text-blue-600 dark:text-blue-400')}
        {statCard('Unread', notifSummary.unread, 'text-amber-600 dark:text-amber-400')}
        {statCard('Emails Sent', emailSummary.sent, 'text-green-600 dark:text-green-400')}
        {statCard('Delivery Rate', `${successRate}%`, 'text-indigo-600 dark:text-indigo-400')}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {statCard('Emails Failed', emailSummary.failed, 'text-red-600 dark:text-red-400')}
        {statCard('Emails Pending', emailSummary.pending, 'text-gray-600 dark:text-gray-400')}
        {statCard('Total Emails', emailSummary.total, 'text-gray-900 dark:text-white')}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setTab('logs')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'logs'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Email Logs
        </button>
        <button
          onClick={() => setTab('templates')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'templates'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Templates
        </button>
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

      {/* Email Logs Tab */}
      {tab === 'logs' && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Email Logs</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Last 50 emails</p>
          </div>
          {emailLogs.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">No email logs found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Recipient</th>
                    <th className="px-4 py-3 font-medium">Event</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Sent At</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {emailLogs.map(log => (
                    <tr key={log.id} className="text-gray-700 dark:text-gray-300">
                      <td className="px-4 py-3 max-w-[200px] truncate">{log.recipientEmail}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
                          {log.eventType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                          log.status === 'sent'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : log.status === 'failed'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : log.status === 'bounced'
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                        {log.sentAt ? new Date(log.sentAt).toLocaleString() : '-'}
                      </td>
                      <td className="px-4 py-3">
                        {(log.status === 'failed' || log.status === 'bounced') && (
                          <button
                            onClick={() => handleRetry(log)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {tab === 'templates' && (
        <div className="space-y-4">
          {templates.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">No templates found.</div>
          ) : (
            templates.map(t => (
              <div key={t.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.eventType}</h3>
                  {editingTemplateId === t.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveTemplate(t)}
                        disabled={savingTemplate}
                        className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {savingTemplate ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(t)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>
                {editingTemplateId === t.id ? (
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Subject</label>
                      <input
                        type="text"
                        value={editForm.subject}
                        onChange={e => setEditForm(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email Body</label>
                      <textarea
                        rows={3}
                        value={editForm.emailBody}
                        onChange={e => setEditForm(prev => ({ ...prev, emailBody: e.target.value }))}
                        className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">In-App Template</label>
                      <textarea
                        rows={3}
                        value={editForm.inAppTemplate}
                        onChange={e => setEditForm(prev => ({ ...prev, inAppTemplate: e.target.value }))}
                        className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-2 text-sm">
                    <p><span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Subject:</span> <span className="text-gray-700 dark:text-gray-300">{t.subject}</span></p>
                    <p><span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email Body:</span> <span className="text-gray-700 dark:text-gray-300 line-clamp-2 font-mono text-xs">{t.emailBody}</span></p>
                    <p><span className="text-xs text-gray-500 dark:text-gray-400 font-medium">In-App Template:</span> <span className="text-gray-700 dark:text-gray-300 line-clamp-2 font-mono text-xs">{t.inAppTemplate}</span></p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
