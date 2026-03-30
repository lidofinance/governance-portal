import { ProposalCombinedData } from '@dg/proposals/types';
import { VoteData } from 'shared/votes/types';
import { isVoteItem } from '@dg/types';
import { IconWrapper, ProposalWrapper, VoteWrapper } from '../style';
import { AragonLogo, ProposalsIcon } from 'shared/components/icons';
import { Text } from 'shared/components/text';
import Link from 'next/link';
import { DGTooltip } from '@dg/tooltips';
import { ReactNode } from 'react';
import { PROPOSALS_PATH, votePage } from 'constants/urls';
import { useProposalStatus } from '@dg/hooks/use-proposal-status';

type Props = {
  proposal: ProposalCombinedData | VoteData;
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

export const PreviewProposal = ({ proposal }: Props) => {
  const isVote = isVoteItem(proposal);

  const { status, submittedAt, scheduledAt } =
    'proposalDetails' in proposal
      ? proposal.proposalDetails
      : { status: undefined, submittedAt: undefined, scheduledAt: undefined };

  const proposalStatusInfo = useProposalStatus({
    proposalStatus: status,
    submittedAt: submittedAt,
    scheduledAt: scheduledAt,
  });

  if (isVote) {
    return (
      <VoteWrapper>
        <AragonLogo />
        <Text size={22}>
          <Link href={votePage(proposal.proposalId)}>
            {`LDO Vote #${proposal.proposalId} `}
          </Link>
          &mdash; Not submitted to Dual Governance yet
        </Text>
      </VoteWrapper>
    );
  }

  return (
    <ActiveProposalWrapper proposalId={proposal.proposalId}>
      {proposalStatusInfo && (
        <>
          {proposalStatusInfo.badge.text}{' '}
          {proposalStatusInfo.badge.text === 'Ready to execute' && (
            <DGTooltip topic="readyToExecute" />
          )}
        </>
      )}
    </ActiveProposalWrapper>
  );
};
