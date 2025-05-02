import {
  ProposalCombinedData,
  ProposalStatus,
} from 'features/dual-governance/proposals/types';
import { isVoteItem } from 'features/dual-governance/types';
import { VoteData } from 'shared/votes/types';

type Props = {
  proposal: ProposalCombinedData | VoteData;
  currentTime: number; // in seconds
  afterSubmitDelay: number; // in seconds
  afterScheduleDelay: number;
};

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
export const getProposalSortPriority = ({
  proposal,
  currentTime,
  afterSubmitDelay,
  afterScheduleDelay,
}: Props) => {
  if (!isVoteItem(proposal)) {
    const details = proposal.proposalDetails;
    const status = details.status;
    const submittedAt = Number(details.submittedAt);
    const scheduledAt = Number(details.scheduledAt);

    switch (status) {
      case ProposalStatus.Executed:
        return 6;

      case ProposalStatus.Scheduled:
        if (
          scheduledAt > 0 &&
          currentTime >= scheduledAt + afterScheduleDelay
        ) {
          return 1;
        }
        return 2;

      case ProposalStatus.Submitted:
        if (submittedAt > 0 && currentTime >= submittedAt + afterSubmitDelay) {
          return 3;
        }
        return 4;

      case ProposalStatus.Cancelled:
        return 7;

      default:
        return 8;
    }
  } else {
    return 5;
  }
};
