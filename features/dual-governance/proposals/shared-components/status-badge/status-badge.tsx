import { StatusBadgeWrapper } from 'features/dual-governance/proposals/shared-components/status-badge/style';
import { VoteStatus } from 'shared/votes/types';
import {
  statusBadgeContent,
  votePhaseContent,
} from 'features/dual-governance/proposals/shared-components/status-badge/helpers';
import { ProposalStatus } from 'features/dual-governance/types';

type Props = {
  isAragon?: boolean;
  voteState?: {
    isQuorumReached: boolean;
    status: VoteStatus;
  };
  proposalStatus?: ProposalStatus;
};

export const StatusBadge = ({ isAragon, voteState, proposalStatus }: Props) => {
  if (isAragon && voteState) {
    return (
      <StatusBadgeWrapper $variant="default">
        {votePhaseContent[voteState?.status]}
        {voteState.isQuorumReached ? ': Quorum reached' : ': No quorum'}
      </StatusBadgeWrapper>
    );
  }

  if (!voteState && proposalStatus) {
    return (
      <StatusBadgeWrapper $variant="success">
        {statusBadgeContent[proposalStatus]}
      </StatusBadgeWrapper>
    );
  }
  return null;
};
