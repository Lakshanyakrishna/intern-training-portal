import NoApplicationStage from '../stages/NoApplicationStage';
import ApplicationSubmittedStage from '../stages/ApplicationSubmittedStage';
import ResumeScreeningStage from '../stages/ResumeScreeningStage';
import InterviewSchedulingStage from '../stages/InterviewSchedulingStage';
import InterviewScheduledStage from '../stages/InterviewScheduledStage';
import InterviewCompletedStage from '../stages/InterviewCompletedStage';
import SelectedStage from '../stages/SelectedStage';
import RejectedStage from '../stages/RejectedStage';
import type { ApplicationSummary, InterviewSlot, JourneyActions, Opportunity, ScheduledInterview, Stage } from '../types';

// The only place that knows "which Stage maps to which component." Every
// stage component below is pure (props in, callbacks out) -- this switch is
// the sole piece of routing logic, so a real API integration later only
// needs to change what feeds these props, never the components themselves.
export default function StageContent({
  stage,
  opportunities,
  application,
  slotGroups,
  interview,
  selectedInfo,
  actions,
  isLive,
  offerAccepted,
}: {
  stage: Stage;
  opportunities: Opportunity[];
  application: ApplicationSummary;
  slotGroups: { day: string; date: string; slots: InterviewSlot[] }[];
  interview: ScheduledInterview;
  selectedInfo: { mentor: string; startDate: string; trainingDuration: string };
  actions: JourneyActions;
  // True once this page is showing the applicant's genuine current status
  // (not the dev "Preview stage" override). Stage components use it to
  // hide/replace interactive controls that don't have a real backend yet
  // (self-serve interview scheduling, reschedule/cancel) rather than
  // silently faking success for a real applicant.
  isLive?: boolean;
  offerAccepted?: boolean;
}) {
  switch (stage) {
    case 'no_application':
      return <NoApplicationStage opportunities={opportunities} onApply={actions.onApply} />;
    case 'application_submitted':
      return (
        <ApplicationSubmittedStage
          application={application}
          onEditApplication={actions.onEditApplication}
          onWithdrawApplication={actions.onWithdrawApplication}
          isLive={isLive}
        />
      );
    case 'resume_screening':
      return <ResumeScreeningStage application={application} />;
    case 'interview_scheduling':
      return <InterviewSchedulingStage slotGroups={slotGroups} onConfirmSlot={actions.onScheduleInterview} isLive={isLive} />;
    case 'interview_scheduled':
      return (
        <InterviewScheduledStage
          interview={interview}
          onRescheduleInterview={actions.onRescheduleInterview}
          onCancelInterview={actions.onCancelInterview}
          isLive={isLive}
        />
      );
    case 'interview_completed':
      return <InterviewCompletedStage />;
    case 'selected':
      return (
        <SelectedStage
          mentor={selectedInfo.mentor}
          startDate={selectedInfo.startDate}
          trainingDuration={selectedInfo.trainingDuration}
          onAcceptOffer={actions.onAcceptOffer}
          onBeginTraining={actions.onBeginTraining}
          initiallyAccepted={offerAccepted}
        />
      );
    case 'rejected':
      return (
        <RejectedStage
          recommended={opportunities.slice(0, 2)}
          onApply={actions.onApply}
          onUpdateProfile={actions.onUpdateProfile}
        />
      );
  }
}
