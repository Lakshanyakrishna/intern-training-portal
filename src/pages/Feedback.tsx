import { useState } from 'react';
import { MessageSquare, CheckCircle } from '../components/Icons';

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl"><MessageSquare className="w-8 h-8 inline-block" /></span>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Feedback</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Help us improve the training program.</p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
          <span className="text-4xl"><CheckCircle className="w-8 h-8 inline-block" /></span>
          <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mt-2">Thank You!</h3>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">Your feedback has been submitted.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What module are you working on?</label>
            <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
              <option>Git & GitHub</option>
              <option>API Integration</option>
              <option>AI-Assisted Dev</option>
              <option>Testing & QA</option>
              <option>Debugging</option>
              <option>Code Review</option>
              <option>Deployment</option>
              <option>Supabase</option>
              <option>Communication</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <label key={n} className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="rating" className="accent-blue-500" />
                  <span className="text-lg">{n}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What could be improved?</label>
            <textarea
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Share your thoughts..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
}
