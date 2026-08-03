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
}: {
  stage: Stage;
  opportunities: Opportunity[];
  application: ApplicationSummary;
  slotGroups: { day: string; date: string; slots: InterviewSlot[] }[];
  interview: ScheduledInterview;
  selectedInfo: { mentor: string; startDate: string; trainingDuration: string };
  actions: JourneyActions;
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
        />
      );
    case 'resume_screening':
      return <ResumeScreeningStage application={application} />;
    case 'interview_scheduling':
      return <InterviewSchedulingStage slotGroups={slotGroups} onConfirmSlot={actions.onScheduleInterview} />;
    case 'interview_scheduled':
      return (
        <InterviewScheduledStage
          interview={interview}
          onRescheduleInterview={actions.onRescheduleInterview}
          onCancelInterview={actions.onCancelInterview}
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
