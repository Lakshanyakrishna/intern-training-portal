import { HelpCircle, MessageSquare, Send } from '../../components/Icons';

const FAQS = [
  { q: 'How do I mark a lesson complete?', a: 'Open the lesson and use "Mark complete & continue" at the bottom.' },
  { q: 'What happens when I finish a module?', a: 'Once every required lesson, practice item, and assessment is done, you can mark the module complete from its page.' },
  { q: 'Who reviews my submissions?', a: 'Your assigned mentor reviews assignment submissions from the Mentor section.' },
];

export default function Help() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Help</h1>
        <p className="text-sm text-secondary mt-1">Common questions about training.</p>
      </div>

      <div className="bg-surface border border-line rounded-xl divide-y divide-line">
        {FAQS.map(item => (
          <div key={item.q} className="p-5">
            <p className="text-sm font-medium text-primary flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-secondary shrink-0" />
              {item.q}
            </p>
            <p className="text-sm text-secondary mt-1.5 ml-6">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-line rounded-xl p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-secondary" />
          <p className="text-sm text-primary">Still stuck?</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-line text-sm font-medium text-primary hover:bg-surface-alt transition-colors">
          <Send className="w-3.5 h-3.5" />
          Contact mentor
        </button>
      </div>
    </div>
  );
}
