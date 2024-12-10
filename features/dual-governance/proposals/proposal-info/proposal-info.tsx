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
import { useProposalTimelocks } from 'features/dual-governance/hooks/use-proposal-timelock';
import { useCountdown } from 'shared/hooks/use-countdown';

type Props = {
  id: number;
};

const useTargetTime = (
  proposal: ReturnType<typeof useProposal>['data'],
  afterSubmitDelay: number | undefined,
  afterScheduleDelay: number | undefined,
  isDelayDataLoading: boolean,
): number | null => {
  if (
    !proposal ||
    !afterSubmitDelay ||
    !afterScheduleDelay ||
    isDelayDataLoading
  )
    return null;

  const { status, submittedAt, scheduledAt } = proposal.proposalInfo[0];

  if (status === ProposalStatus.Submitted) {
    return submittedAt + afterSubmitDelay;
  }
  if (status === ProposalStatus.Scheduled) {
    return scheduledAt + afterScheduleDelay;
  }

  return null;
};

export const ProposalInfo = ({ id }: Props) => {
  const { data: proposal } = useProposal({ id });

  const {
    isLoading: isDelayDataLoading,
    afterSubmitDelay,
    afterScheduleDelay,
  } = useProposalTimelocks();

  const targetTime = useTargetTime(
    proposal,
    afterSubmitDelay,
    afterScheduleDelay,
    isDelayDataLoading,
  );

  const { isFinished: isCountdownFinished } = useCountdown(targetTime ?? 0);

  const calls = proposal?.event.args.calls;

  if (!proposal) {
    return (
      <>
        <ProposalContainer>
          <ProposalName>Proposal #{id}</ProposalName>
          <InlineLoaderStyled />
        </ProposalContainer>
      </>
    );
  }

  const { status, scheduledAt, submittedAt } = proposal.proposalInfo[0];

  return (
    <ProposalContainer>
      <ProposalHeader>
        {status && (
          <StatusBadge proposalStatus={proposal?.proposalInfo[0].status} />
        )}
        <ProposalTimelock
          status={status}
          scheduledAt={scheduledAt}
          submittedAt={submittedAt}
        />
      </ProposalHeader>
      <ProposalName>Proposal #{id}</ProposalName>
      {proposal?.proposalInfo[0].submittedAt && (
        <SubmitDate>
          {`Submitted ${getDateFromTimestamp(proposal.proposalInfo[0].submittedAt)}`}
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

      {status === ProposalStatus.Scheduled && isCountdownFinished && (
        <ActionsWrapper>
          <Button size="md">Enact</Button>
        </ActionsWrapper>
      )}
    </ProposalContainer>
  );
};
