import { useState } from 'react';
import { Sparkles, Users, Calendar, Clock } from '../../components/Icons';
import ClickSpark from '../components/ClickSpark';

export default function SelectedStage({
  mentor,
  startDate,
  trainingDuration,
  onAcceptOffer,
  onBeginTraining,
}: {
  mentor: string;
  startDate: string;
  trainingDuration: string;
  onAcceptOffer: () => void;
  onBeginTraining: () => void;
}) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-1">Congratulations</h2>
      <p className="text-sm text-secondary mb-6">You've been selected — welcome to the program.</p>

      <div className="rounded-2xl border border-line bg-sidebar-bg text-sidebar-text p-5 shadow-lg shadow-black/10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold">You're in</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-sidebar-text-secondary shrink-0" />
            <div>
              <p className="font-medium">{mentor}</p>
              <p className="text-sidebar-text-secondary text-xs">Mentor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sidebar-text-secondary shrink-0" />
            <div>
              <p className="font-medium">{startDate}</p>
              <p className="text-sidebar-text-secondary text-xs">Start date</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sidebar-text-secondary shrink-0" />
            <div>
              <p className="font-medium">{trainingDuration}</p>
              <p className="text-sidebar-text-secondary text-xs">Training duration</p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-sidebar-line">
          {/* One persistent ClickSpark wrapping both button states, not just
              the "not accepted" branch -- the button itself swaps to "Begin
              Training" on the very click that triggers the spark, so if the
              canvas were scoped to just the first branch it would unmount
              (and cut the animation short) at the exact moment it fires. */}
          <ClickSpark sparkColor="#F1F2EE" sparkCount={10} sparkRadius={20} duration={450} className="w-full sm:w-auto">
            {!accepted ? (
              <button
                onClick={() => { setAccepted(true); onAcceptOffer(); }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-sidebar-accent text-sidebar-bg text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-bg"
              >
                Accept Internship Offer
              </button>
            ) : (
              <button
                onClick={onBeginTraining}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-sidebar-accent text-sidebar-bg text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-bg"
              >
                Begin Training
              </button>
            )}
          </ClickSpark>
        </div>
      </div>
    </div>
  );
}
