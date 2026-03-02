import { IconWrapper, ProposalWrapper, VoteWrapper } from '../style';
import { AragonLogo, ProposalsIcon } from 'shared/components/icons';
import { Text } from 'shared/components/text';
import Link from 'next/link';
import { config } from 'config';
import { DGTooltip } from 'features/dual-governance/tooltips';
import { ReactNode } from 'react';
import { PROPOSALS_PATH } from 'constants/urls';
import { useProposalStatus } from 'features/dual-governance/hooks/use-proposal-status';
import { useProposalDetails } from '../../hooks/use-proposal-details';
import { ProposalStatus } from '../../proposals/types';

type Props = {
  proposalId: number;
  isVote?: boolean;
};

const ActiveProposalWrapper = ({
  proposalId,
  children,
}: {
  proposalId: number;
  children: ReactNode;
}) => {
  return (
    <ProposalWrapper>
      <IconWrapper>
        <ProposalsIcon />
      </IconWrapper>
      <Text size={22}>
        <Link href={`${PROPOSALS_PATH}/${proposalId}`}>
          {`Proposal #${proposalId} `}
        </Link>
        &mdash;
      </Text>
      <Text as="div" size={22}>
        {children}
      </Text>
    </ProposalWrapper>
  );
};

export const PreviewProposal = ({ proposalId, isVote }: Props) => {
  const { data: proposalDetails, isLoading } = useProposalDetails(
    proposalId,
    !isVote,
  );

  const proposalStatusInfo = useProposalStatus({
    proposalStatus: proposalDetails?.status,
    submittedAt: proposalDetails?.submittedAt,
    scheduledAt: proposalDetails?.scheduledAt,
  });

  if (isLoading && !isVote) {
    return null;
  }

  if (
    !isVote &&
    proposalDetails &&
    (proposalDetails.status === ProposalStatus.Executed ||
      proposalDetails.status === ProposalStatus.Cancelled)
  ) {
    return null;
  }

  if (isVote) {
    return (
      <VoteWrapper>
        <AragonLogo />
        <Text size={22}>
          <Link href={`${config.voteOrigin}/vote/${proposalId}`}>
            {`LDO Vote #${proposalId} `}
          </Link>
          &mdash; Not submitted to Dual Governance yet
        </Text>
      </VoteWrapper>
    );
  }

  if (!proposalDetails || !proposalStatusInfo) {
    return null;
  }

  return (
    <ActiveProposalWrapper proposalId={proposalId}>
      {proposalStatusInfo.badge.text}{' '}
      {proposalStatusInfo.badge.text === 'Ready to execute' && (
        <DGTooltip topic="readyToExecute" />
      )}
    </ActiveProposalWrapper>
  );
};
