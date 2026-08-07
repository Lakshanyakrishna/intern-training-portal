import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInternTrack } from '../hooks/useInternTrack';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { findLesson } from '../config/types';
import SkeletonBlock from '../components/SkeletonBlock';
import {
  ArrowLeft, CheckCircle, Circle, FileText, Flag, Video,
} from '../../components/Icons';

// [Placeholder content renderer] Real markdown/video/code content plugs in
// per contentType here later -- for now each type gets an honest "content
// goes here" placeholder instead of fake lesson text.
function LessonContentPlaceholder({ contentType }: { contentType: string }) {
  const labels: Record<string, string> = {
    markdown: 'Written lesson content will render here.',
    video: 'A video player will render here.',
    code: 'An embedded code sample will render here.',
    image: 'Lesson images will render here.',
    download: 'Downloadable resources will be listed here.',
    reference: 'Reference material will render here.',
  };
  const Icon = contentType === 'video' ? Video : FileText;
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border-2 border-dashed border-line rounded-xl">
      <Icon className="w-6 h-6 text-secondary mb-3" />
      <p className="text-sm text-secondary max-w-sm">{labels[contentType] ?? 'Content will render here.'}</p>
    </div>
  );
}

export default function LessonViewer() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { track, loading } = useInternTrack(user?.id);
  const progress = useTrainingProgress(user?.id, track ?? { forte: 'General', trackName: '', description: '', stages: [] });
  const [bookmarked, setBookmarked] = useState(false);
  const [notes, setNotes] = useState('');

  const found = track && lessonId ? findLesson(track, lessonId) : undefined;

  useEffect(() => {
    if (!lessonId) return;
    try {
      setNotes(localStorage.getItem(`lesson-notes:${lessonId}`) ?? '');
      setBookmarked(localStorage.getItem(`lesson-bookmark:${lessonId}`) === '1');
    } catch { /* storage unavailable */ }
  }, [lessonId]);

  function saveNotes(value: string) {
    setNotes(value);
    try { localStorage.setItem(`lesson-notes:${lessonId}`, value); } catch { /* ignore */ }
  }

  function toggleBookmark() {
    const next = !bookmarked;
    setBookmarked(next);
    try { localStorage.setItem(`lesson-bookmark:${lessonId}`, next ? '1' : '0'); } catch { /* ignore */ }
  }

  if (loading || !track) return <SkeletonBlock className="h-96" />;
  if (!found) return <Navigate to="/training/path" replace />;
  const { module, lesson } = found;

  const sortedLessons = module.lessons.slice().sort((a, b) => a.order - b.order);
  const idx = sortedLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = idx > 0 ? sortedLessons[idx - 1] : undefined;
  const nextLesson = idx < sortedLessons.length - 1 ? sortedLessons[idx + 1] : undefined;
  const done = progress.getModuleProgress(module.id).completedLessonIds.includes(lesson.id);

  function handleComplete() {
    progress.markLessonComplete(module.id, lesson.id);
    if (nextLesson) navigate(`/training/lesson/${nextLesson.id}`);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_260px] gap-6 items-start">
      <div className="min-w-0 space-y-5">
        <Link to={`/training/module/${module.id}`} className="flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-primary transition-colors w-fit">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to {module.title}
        </Link>

        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-primary">{lesson.title}</h1>
          <button
            onClick={toggleBookmark}
            aria-pressed={bookmarked}
            aria-label="Bookmark this lesson"
            className={`shrink-0 p-2 rounded-lg border transition-colors ${bookmarked ? 'border-accent text-accent bg-accent/10' : 'border-line text-secondary hover:text-primary'}`}
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
        {lesson.summary && <p className="text-sm text-secondary">{lesson.summary}</p>}

        <LessonContentPlaceholder contentType={lesson.contentType} />

        <div className="bg-surface border border-line rounded-xl p-5">
          <h2 className="text-sm font-semibold text-primary mb-2">Notes</h2>
          <textarea
            value={notes}
            onChange={e => saveNotes(e.target.value)}
            placeholder="Jot down notes for yourself as you go — saved automatically."
            rows={4}
            className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-surface text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-colors resize-none"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => prevLesson && navigate(`/training/lesson/${prevLesson.id}`)}
            disabled={!prevLesson}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-line text-sm font-medium text-primary hover:bg-surface-alt transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>
          <button
            onClick={handleComplete}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              done ? 'border border-line text-secondary hover:bg-surface-alt' : 'bg-accent text-accent-text hover:opacity-90'
            }`}
          >
            {done ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            {done ? (nextLesson ? 'Next lesson' : 'Completed') : 'Mark complete & continue'}
          </button>
        </div>
      </div>

      {/* Overview sidebar */}
      <div className="bg-surface border border-line rounded-xl p-2 lg:sticky lg:top-20">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary px-3 pt-2 pb-1.5">In this module</p>
        <div className="space-y-0.5">
          {sortedLessons.map((l, i) => {
            const active = l.id === lesson.id;
            const isDone = progress.getModuleProgress(module.id).completedLessonIds.includes(l.id);
            return (
              <Link
                key={l.id}
                to={`/training/lesson/${l.id}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? 'bg-accent/10 text-accent font-medium' : 'text-secondary hover:bg-surface-alt hover:text-primary'
                }`}
              >
                {isDone ? <CheckCircle className={`w-4 h-4 shrink-0 ${active ? 'text-accent' : 'text-accent/70'}`} /> : <Circle className="w-4 h-4 shrink-0" />}
                <span className="truncate">{String(i + 1).padStart(2, '0')}. {l.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
