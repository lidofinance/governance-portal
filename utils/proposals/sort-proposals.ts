import { ProposalCombinedData } from '../../features/dual-governance/proposals/types';
import { getProposalSortPriority } from './get-proposal-sort-priority';

type Props = {
  proposals: ProposalCombinedData[];
  afterSubmitDelay: number; // in seconds
  afterScheduleDelay: number; // in seconds
};

// Lower priority number comes first
export const sortProposals = ({
  proposals,
  afterSubmitDelay,
  afterScheduleDelay,
}: Props) => {
  const currentTime = new Date().getTime() / 1000; // seconds

  return proposals.sort((a, b) => {
    const prioritizedA = getProposalSortPriority({
      proposal: a,
      currentTime,
      afterSubmitDelay,
      afterScheduleDelay,
    });

    const prioritizedB = getProposalSortPriority({
      proposal: b,
      currentTime,
      afterSubmitDelay,
      afterScheduleDelay,
    });

    if (prioritizedA !== prioritizedB) {
      return prioritizedA - prioritizedB;
    }

    try {
      const detailsA = a.proposalDetails;
      const detailsB = b.proposalDetails;
      const submittedAtA = Number(detailsA.submittedAt);
      const submittedAtB = Number(detailsB.submittedAt);
      const scheduledAtA = Number(detailsA.scheduledAt);
      const scheduledAtB = Number(detailsB.scheduledAt);

      if (
        isNaN(submittedAtA) ||
        isNaN(submittedAtB) ||
        isNaN(scheduledAtA) ||
        isNaN(scheduledAtB)
      ) {
        // Fallback sort by ID if getting timestamp fails
        try {
          const idA = BigInt(detailsA.id);
          const idB = BigInt(detailsB.id);
          if (idA < idB) return 1;
          if (idA > idB) return -1;
          return 0;
        } catch {
          return 0;
        }
      }

      /**
       * 1) Ready to execute
       * 2) Scheduled
       * 3) Ready to schedule
       * 4) Submitted
       * 5) Aragon items
       * 6) Executed
       * 7) Cancelled
       * 8) Default
       */

      switch (prioritizedA) {
        case 1: {
          const readyTimeA = scheduledAtA + afterScheduleDelay;
          const readyTimeB = scheduledAtB + afterScheduleDelay;
          return readyTimeA - readyTimeB;
        }

        case 2: {
          const scheduleEndTimeA = scheduledAtA + afterScheduleDelay;
          const scheduleEndTimeB = scheduledAtB + afterScheduleDelay;
          return scheduleEndTimeA - scheduleEndTimeB;
        }

        case 3: {
          const readyToScheduleTimeA = submittedAtA + afterSubmitDelay;
          const readyToScheduleTimeB = submittedAtB + afterSubmitDelay;
          return readyToScheduleTimeA - readyToScheduleTimeB;
        }

        case 4: {
          const submissionEndTimeA = submittedAtA + afterSubmitDelay;
          const submissionEndTimeB = submittedAtB + afterSubmitDelay;
          return submissionEndTimeA - submissionEndTimeB;
        }

        case 6: {
          return submittedAtB - submittedAtA;
        }

        default:
          return submittedAtB - submittedAtA;
      }
    } catch (e) {
      console.error('Error during proposals sorting:', e, a, b);
      return 0;
    }
  });
};
