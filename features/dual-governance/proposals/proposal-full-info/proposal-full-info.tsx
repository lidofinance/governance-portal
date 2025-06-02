import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActionsWrapper,
  ArrowIconWrapper,
  InlineLoaderStyled,
  ProposalContainer,
  ProposalHeader,
  ProposalLink,
  ProposalName,
  ProposalStateLogWrapper,
  SubmitDate,
} from './style';
import { Text } from 'shared/components/text';
import { useProposal } from 'features/dual-governance/hooks/use-proposal';

import { Script } from 'features/dual-governance/evm-script-parsed';
import { getDateFromTimestamp } from 'utils/get-date-from-timestamp';
import { Button } from 'shared/components/button';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useScheduleProposalAction } from 'features/dual-governance/write-actions/schedule-proposal';
import { useExecuteProposalAction } from 'features/dual-governance/write-actions/execute-proposal';
import { ArrowRight } from 'shared/components/icons';
import { useRouter } from 'next/router';
import { useProposalStatus } from 'features/dual-governance/hooks/use-proposal-status';
import { Badge } from '../shared-components/vote-status-badge/style';
import { config } from 'config';
import { Box } from '@lidofinance/lido-ui';
import { useAccount, usePublicClient } from 'wagmi';
import { ConnectWalletButton } from 'shared/wallet';
import { getProposalExecutedEvent } from 'features/dual-governance/events/getProposalExecutedEvent';
import { useLidoSDK } from 'providers/lido-sdk';
import { useIsEmergencyModeActive } from '../../hooks/use-is-emergency-mode-active';
import { DGTooltip } from '../../tooltips';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useDynamicDualGovernance } from '../../hooks/use-dynamic-dual-governance';
import { ProposalStatus } from '../types';

type Props = {
  id: number;
};

export const ProposalFullInfo = ({ id }: Props) => {
  const router = useRouter();

  const { isConnected, address } = useAccount();
  const isSupportedChain = useIsSupportedChain();

  const { chainId } = useLidoSDK();

  const client = usePublicClient();

  const [proposalExecutedAt, setProposalExecutedAt] = useState<string | null>(
    null,
  );

  const { isEmergencyModeActive } = useIsEmergencyModeActive();

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

  const { readDynamicContract } = useDynamicDualGovernance();
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  useEffect(() => {
    const fetchEvent = async () => {
      if (!proposal?.proposalId || !client || !chainId) {
        return;
      }

      try {
        const proposalExecutedEvent = await getProposalExecutedEvent({
          proposalId: proposal.proposalId,
          client,
          chainId: chainId,
        });

        if (proposalExecutedEvent && proposalExecutedEvent.blockNumber) {
          const block = await client.getBlock({
            blockNumber: proposalExecutedEvent.blockNumber,
          });
          if (block) {
            const date = getDateFromTimestamp({
              timestamp: Number(block.timestamp),
              showYear: true,
            });

            setProposalExecutedAt(`${date.date} ${date.tz}`);
          }
        }
      } catch (error) {
        console.error('Error fetching proposal executed event:', error);
      } finally {
        // setLogsLoading(false);
      }
    };

    void fetchEvent();
  }, [chainId, client, proposal?.proposalId]);

  const updateProposalState = useCallback(async () => {
    await refetchProposal();
    setIsScheduleLoading(false);
    setIsExecuteLoading(false);
    setShowExecuteButton(false);
  }, [refetchProposal]);

  const scheduleProposal = useScheduleProposalAction({
    onConfirm: updateProposalState,
  });

  const executeProposal = useExecuteProposalAction({
    onConfirm: updateProposalState,
    isEmergencyMode: isEmergencyModeActive,
  });

  const [showScheduleButton, setShowScheduleButton] = useState(false);
  const [showExecuteButton, setShowExecuteButton] = useState(false);
  const [isEmergencyExecutionCommittee, setIsEmergencyExecutionCommittee] =
    useState(false);

  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [isExecuteLoading, setIsExecuteLoading] = useState(false);

  /**
   *  Check if we can schedule | execute proposals
   **/

  useEffect(() => {
    const fetchEmergencyExecutionCommittee = async () => {
      if (
        !emergencyProtectedTimelock ||
        !address ||
        !isConnected ||
        !isSupportedChain
      ) {
        setIsEmergencyExecutionCommittee(false);
        return;
      }

      try {
        const emergencyExecutionCommittee =
          await emergencyProtectedTimelock.readContract(
            'getEmergencyExecutionCommittee',
          );

        if (typeof emergencyExecutionCommittee === 'string' && address) {
          setIsEmergencyExecutionCommittee(
            emergencyExecutionCommittee.toLowerCase() === address.toLowerCase(),
          );
        } else {
          setIsEmergencyExecutionCommittee(false);
        }
      } catch (error) {
        console.error('Error fetching emergency execution committee:', error);
        setIsEmergencyExecutionCommittee(false);
      }
    };

    void fetchEmergencyExecutionCommittee();
  }, [emergencyProtectedTimelock, address, isConnected, isSupportedChain]);

  useEffect(() => {
    const fetchActions = async () => {
      if (
        !emergencyProtectedTimelock ||
        !readDynamicContract ||
        !id ||
        !proposal
      ) {
        return;
      }

      try {
        const canSchedule = await readDynamicContract('canScheduleProposal', [
          BigInt(id),
        ]);

        const canExecute = await emergencyProtectedTimelock.readContract(
          'canExecute',
          [BigInt(id)],
        );

        setShowScheduleButton(!!canSchedule);

        const isExecuted =
          proposal?.proposalDetails.status === ProposalStatus.Executed;

        if (
          !isExecuted &&
          (canExecute ||
            (isEmergencyModeActive && isEmergencyExecutionCommittee))
        ) {
          setShowExecuteButton(true);
        } else {
          setShowExecuteButton(false);
        }
      } catch (e) {
        console.error('Failed to fetch proposal actions', e);
      }
    };

    void fetchActions();
  }, [
    readDynamicContract,
    emergencyProtectedTimelock,
    id,
    proposal,
    isEmergencyModeActive,
    isEmergencyExecutionCommittee,
  ]);

  const handleSchedule = async () => {
    setIsScheduleLoading(true);
    const success = await scheduleProposal(id);

    if (!success) {
      setIsScheduleLoading(false);
    }
  };

  const handleExecute = async () => {
    setIsExecuteLoading(true);
    const success = await executeProposal(id);

    if (!success) {
      setIsExecuteLoading(false);
    }
  };

  const submittedAt = useMemo(() => {
    if (!proposal) {
      return null;
    }

    const date = getDateFromTimestamp({
      timestamp: proposal.proposalDetails.submittedAt,
      showYear: true,
    });

    return `${date.date} ${date.tz}`;
  }, [proposal]);

  const scheduledAt = useMemo(() => {
    if (!proposal || !proposal.proposalDetails.scheduledAt) {
      return null;
    }

    const date = getDateFromTimestamp({
      timestamp: proposal.proposalDetails.scheduledAt,
      showYear: true,
    });

    return `${date.date} ${date.tz}`;
  }, [proposal]);

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

  const calls = proposal.EPTEvent?.args.calls;

  return (
    <ProposalContainer>
      <ProposalHeader>
        <ArrowIconWrapper onClick={router.back}>
          <ArrowRight />
        </ArrowIconWrapper>
        {proposalStatusInfo && proposalStatusInfo.badge && (
          <Badge $variant={proposalStatusInfo.badge.variant}>
            {proposalStatusInfo.badge.text}{' '}
            {proposalStatusInfo.badge.text === 'Ready to execute' && (
              <DGTooltip topic="readyToExecute" />
            )}
          </Badge>
        )}
        {proposalStatusInfo?.info && proposalStatusInfo.info}
      </ProposalHeader>
      <ProposalName>Proposal #{id}</ProposalName>
      <ProposalStateLogWrapper>
        {submittedAt && (
          <>
            {proposal.voteId && (
              <SubmitDate as="span">
                Submitted from{' '}
                <ProposalLink
                  href={`${config.voteOrigin}/vote/${proposal.voteId}`}
                  target="_blank"
                >
                  Aragon {proposal.voteId}
                </ProposalLink>{' '}
                on {submittedAt}
              </SubmitDate>
            )}
            {!proposal.voteId && (
              <SubmitDate as="span">Submitted on {submittedAt}</SubmitDate>
            )}
          </>
        )}
        {scheduledAt && (
          <SubmitDate as="span">Scheduled on {scheduledAt}</SubmitDate>
        )}
        {proposalExecutedAt && (
          <SubmitDate as="span">Executed on {proposalExecutedAt}</SubmitDate>
        )}
      </ProposalStateLogWrapper>
      <Box margin={'30px 0'}>
        {proposal.voteId && (
          <>
            <Text weight={500} size={28}>
              Description
            </Text>
            <Box marginTop={12}>
              <Text size={15} color="secondary">
                <b>Disclaimer:</b> Description provided by the Aragon proposal
                author; may include items not under Dual Governance
              </Text>
            </Box>
            {proposal.DGEvent?.args?.metadata && (
              <Box marginTop={30}>
                <Text size={22}>{proposal?.DGEvent.args?.metadata}</Text>
              </Box>
            )}
          </>
        )}
        {!proposal.voteId && (
          <Text weight={500} size={22}>
            Proposal submitted by {proposal?.DGEvent?.args.proposerAccount}
          </Text>
        )}
      </Box>

      {calls && calls.length > 0 && <Script rawCalls={calls} />}

      {showScheduleButton && (
        <ActionsWrapper>
          {isConnected ? (
            <Button
              size="md"
              onClick={handleSchedule}
              loading={isScheduleLoading}
              disabled={!isSupportedChain}
            >
              Schedule
            </Button>
          ) : (
            <ConnectWalletButton />
          )}
        </ActionsWrapper>
      )}

      {showExecuteButton && (
        <ActionsWrapper>
          {isConnected ? (
            <Button
              size="md"
              onClick={handleExecute}
              loading={isExecuteLoading}
              disabled={!isSupportedChain}
            >
              {isEmergencyModeActive ? 'Emergency Execute' : 'Execute'}
            </Button>
          ) : (
            <ConnectWalletButton />
          )}
        </ActionsWrapper>
      )}
    </ProposalContainer>
  );
};
