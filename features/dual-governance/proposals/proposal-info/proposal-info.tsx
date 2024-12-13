import {
  ActionsWrapper,
  InlineLoaderStyled,
  ProposalContainer,
  ProposalDescription,
  ProposalHeader,
  ProposalLink,
  ProposalName,
  SubmitDate,
} from 'features/dual-governance/proposals/proposal-info/style';
import { Button } from 'shared/components/button';
import { useProposal } from 'features/dual-governance/hooks/use-proposal';

import { Script } from 'features/dual-governance/evm-script-parsed/full';
import { StatusBadge } from 'features/dual-governance/proposals/shared-components/status-badge';
import { getDateFromTimestamp } from 'utils/get-date-from-timestamp';
import { ProposalStatus } from 'features/dual-governance/proposals/types';
import { ProposalTimelock } from 'features/dual-governance//proposals/shared-components/proposal-timelock';
import { useProposalTimelock } from 'features/dual-governance/hooks/use-proposal-timelock';
import { useCountdown } from 'shared/hooks/use-countdown';
import { useEffect, useState } from 'react';

type Props = {
  id: number;
};

export const ProposalInfo = ({ id }: Props) => {
  const { data: proposal, isLoading } = useProposal({ id });

  if (!proposal || isLoading) {
    return (
      <>
        <ProposalContainer>
          <ProposalName>Proposal #{id}</ProposalName>
          <InlineLoaderStyled />
        </ProposalContainer>
      </>
    );
  }

  const { calls, status, submittedAt, scheduledAt } = proposal.proposalDetails;

  return (
    <ProposalContainer>
      <ProposalHeader>
        {status && <StatusBadge proposalStatus={status} />}
        <ProposalTimelock
          proposalStatus={status}
          submittedAt={submittedAt}
          scheduledAt={scheduledAt}
        />
      </ProposalHeader>
      <ProposalName>Proposal #{id}</ProposalName>
      {proposal.proposalDetails.submittedAt && (
        <SubmitDate>
          {`Submitted ${getDateFromTimestamp({ timestamp: proposal.proposalDetails.submittedAt, showYear: true }).date}`}
        </SubmitDate>
      )}
      <ProposalDescription>
        {proposal?.voteId ? (
          <>
            This proposal is a part of{' '}
            <ProposalLink href="#">Aragon {proposal?.voteId}</ProposalLink>
          </>
        ) : (
          <span>Proposal #{proposal?.id}</span>
        )}
        <br />
        {proposal?.event.args.metadata}
      </ProposalDescription>

      {calls && calls.length > 0 && <Script rawCalls={calls} />}

      {/*{status === ProposalStatus.Scheduled && isCountdownFinished && (*/}
      {/*  <ActionsWrapper>*/}
      {/*    <Button size="md">Enact</Button>*/}
      {/*  </ActionsWrapper>*/}
      {/*)}*/}
    </ProposalContainer>
  );
};
