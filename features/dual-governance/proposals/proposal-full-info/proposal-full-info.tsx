import { useCallback, useEffect, useState } from 'react';

import {
  ActionsWrapper,
  InlineLoaderStyled,
  ProposalContainer,
  ProposalDescription,
  ProposalHeader,
  ProposalLink,
  ProposalName,
  SubmitDate,
  ArrowIconWrapper,
  AuthorDescription,
} from 'features/dual-governance/proposals/proposal-full-info/style';
import { useProposal } from 'features/dual-governance/hooks/use-proposal';

import { Script } from 'features/dual-governance/evm-script-parsed/full';
import { getDateFromTimestamp } from 'utils/get-date-from-timestamp';
import { Button } from 'shared/components/button';
import {
  DualGovernance,
  EmergencyProtectedTimelock,
} from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useScheduleProposalAction } from 'features/dual-governance/write-actions/schedule-proposal';
import { useExecuteProposalAction } from 'features/dual-governance/write-actions/execute-proposal';
import invariant from 'tiny-invariant';
import { ArrowRight } from 'shared/components/icons';
import { useRouter } from 'next/router';
import { useProposalStatus } from 'features/dual-governance/hooks/use-proposal-status';
import { Badge } from '../shared-components/vote-status-badge/style';

type Props = {
  id: number;
};

export const ProposalFullInfo = ({ id }: Props) => {
  const router = useRouter();

  const {
    data: proposal,
    isLoading,
    refetch: refetchProposal,
  } = useProposal({ id });

  const proposalStatusInfo = useProposalStatus({
    proposalStatus: proposal?.proposalDetails.status,
    submittedAt: proposal?.proposalDetails.submittedAt,
    scheduledAt: proposal?.proposalDetails.scheduledAt,
  });

  const dualGovernance = useReadContract(DualGovernance);
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  const updateProposalState = useCallback(async () => {
    await refetchProposal();
    setIsScheduleLoading(false);
    setShowExecuteButton(false);
  }, [refetchProposal]);

  const scheduleProposal = useScheduleProposalAction({
    onConfirm: updateProposalState,
  });

  const executeProposal = useExecuteProposalAction({
    onConfirm: updateProposalState,
  });

  const [showScheduleButton, setShowScheduleButton] = useState(false);
  const [showExecuteButton, setShowExecuteButton] = useState(false);

  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [isExecuteLoading, setIsExecuteLoading] = useState(false);

  /**
   *  Check if we can schedule | execute proposals
   **/

  useEffect(() => {
    const fetchActions = async () => {
      invariant(dualGovernance, 'Contract not found');
      invariant(emergencyProtectedTimelock, 'Contract not found');
      invariant(id, 'ID must be provided');

      try {
        const [canSchedule, canExecute] = await Promise.all([
          dualGovernance.readContract('canScheduleProposal', [BigInt(id)]),
          emergencyProtectedTimelock.readContract('canExecute', [BigInt(id)]),
        ]);
        setShowScheduleButton(canSchedule);
        setShowExecuteButton(canExecute);
      } catch (e) {
        console.error('Failed to fetch proposal actions', e);
      }
    };
    fetchActions();
  }, [id, proposal]);

  const handleSchedule = async () => {
    setIsScheduleLoading(true);
    await scheduleProposal(id);
  };

  const handleExecute = async () => {
    setIsExecuteLoading(true);
    await executeProposal(id);
  };

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
        <ArrowIconWrapper onClick={router.back}>
          <ArrowRight />
        </ArrowIconWrapper>
        {proposalStatusInfo && proposalStatusInfo.badge && (
          <Badge $variant={proposalStatusInfo.badge.variant}>
            {proposalStatusInfo.badge.text}
          </Badge>
        )}
        {proposalStatusInfo?.info && proposalStatusInfo.info}
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
        {proposal?.proposalDualGovernanceDetails?.metadata && (
          <AuthorDescription>
            {proposal?.proposalDualGovernanceDetails?.metadata}
          </AuthorDescription>
        )}
      </ProposalDescription>

      {calls && calls.length > 0 && <Script rawCalls={calls} />}

      {showScheduleButton && (
        <ActionsWrapper>
          <Button
            size="md"
            onClick={handleSchedule}
            loading={isScheduleLoading}
          >
            Schedule
          </Button>
        </ActionsWrapper>
      )}

      {showExecuteButton && (
        <ActionsWrapper>
          <Button size="md" onClick={handleExecute} loading={isExecuteLoading}>
            Execute
          </Button>
        </ActionsWrapper>
      )}
    </ProposalContainer>
  );
};
