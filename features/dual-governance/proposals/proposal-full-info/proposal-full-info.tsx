import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

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
import { ProposalCombinedData } from 'features/dual-governance/proposals/types';

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
import { getProposalExecutedEvent } from 'features/dual-governance/events/get-proposal-executed-event';
import { useLidoSDK } from 'providers/lido-sdk';
import { useIsEmergencyModeActive } from '../../hooks/use-is-emergency-mode-active';
import { DGTooltip } from '../../tooltips';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useDynamicDualGovernance } from '../../hooks';
import { ProposalStatus } from '../types';
import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';
import { useProposals } from '../../hooks/use-proposals';
import { isAragonProposal } from 'utils/proposals/is-aragon-proposal';
import { Log, PublicClient } from 'viem';

type Props = {
  id: number;
};

export const ProposalFullInfo = ({ id }: Props) => {
  const router = useRouter();

  const [proposal, setProposal] = useState<ProposalCombinedData | null>(null);
  const [voteId, setVoteId] = useState<number | null>(null);

  const { isConnected, address } = useAccount();
  const isSupportedChain = useIsSupportedChain();
  const { chainId } = useLidoSDK();
  const client = usePublicClient();

  const { isEmergencyModeActive } = useIsEmergencyModeActive();

  const {
    getProposalById,
    isLoading: isProposalsLoading,
    refetchProposals,
  } = useDualGovernanceProposalsContext();

  const cachedProposal = getProposalById(id);

  const { data: queryVoteId, isLoading: isVoteIdLoading } = useQuery({
    queryKey: ['proposal-vote-id', chainId],
    queryFn: async () => {
      return await isAragonProposal({
        client: client as PublicClient,
        proposalLog: cachedProposal?.DGEvent as unknown as Log,
        chainId,
      });
    },
  });

  useEffect(() => {
    if (!proposal?.voteId && !isVoteIdLoading && queryVoteId && !voteId) {
      setVoteId(Number(queryVoteId));
    } else if (proposal && proposal.voteId && !voteId) {
      setVoteId(proposal.voteId);
    }
  }, [isVoteIdLoading, proposal, queryVoteId, voteId]);

  const { data: fetchedProposal, isLoading: isFetchLoading } = useProposals({
    id,
    enabled: !cachedProposal && !isProposalsLoading,
  }) as UseQueryResult<ProposalCombinedData>;

  const isLoading = isProposalsLoading || isFetchLoading;

  useEffect(() => {
    if (!cachedProposal && !fetchedProposal) {
      setProposal(null);
      return;
    }

    if (cachedProposal) {
      setProposal(cachedProposal);
      return;
    }

    if (fetchedProposal) {
      setProposal(fetchedProposal);
    }
  }, [cachedProposal, fetchedProposal, id]);

  const proposalStatusInfo = useProposalStatus({
    proposalStatus: proposal?.proposalDetails?.status || 0,
    submittedAt: proposal?.proposalDetails?.submittedAt || 0,
    scheduledAt: proposal?.proposalDetails?.scheduledAt || 0,
  });

  const { readDynamicContract } = useDynamicDualGovernance();
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  const { data: proposalExecutedAt } = useQuery({
    queryKey: ['proposal-executed-event', proposal?.proposalId, chainId],
    queryFn: async () => {
      if (!proposal?.proposalId || !client || !chainId) {
        return null;
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

            return `${date.date} ${date.tz}`;
          }
        }
        return null;
      } catch (error) {
        console.error('Error fetching proposal executed event:', error);
        return null;
      }
    },
    enabled:
      !!proposal?.proposalId &&
      !!client &&
      !!chainId &&
      proposal?.proposalDetails.status == ProposalStatus.Executed,
  });

  const updateProposalState = useCallback(async () => {
    await refetchProposals();
    setIsScheduleLoading(false);
    setIsExecuteLoading(false);
  }, [refetchProposals]);

  const scheduleProposal = useScheduleProposalAction({
    onConfirm: updateProposalState,
  });

  const executeProposal = useExecuteProposalAction({
    onConfirm: updateProposalState,
  });

  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [isExecuteLoading, setIsExecuteLoading] = useState(false);

  const { data: isEmergencyExecutionCommittee = false } = useQuery({
    queryKey: [
      'emergency-execution-committee',
      address,
      isConnected,
      isSupportedChain,
    ],
    queryFn: async () => {
      if (
        !emergencyProtectedTimelock ||
        !address ||
        !isConnected ||
        !isSupportedChain
      ) {
        return false;
      }

      try {
        const emergencyExecutionCommittee =
          await emergencyProtectedTimelock.readContract(
            'getEmergencyExecutionCommittee',
          );

        if (typeof emergencyExecutionCommittee === 'string' && address) {
          return (
            emergencyExecutionCommittee.toLowerCase() === address.toLowerCase()
          );
        } else {
          return false;
        }
      } catch (error) {
        console.error('Error fetching emergency execution committee:', error);
        return false;
      }
    },
    enabled:
      !!emergencyProtectedTimelock &&
      !!address &&
      isConnected &&
      isSupportedChain,
  });

  const {
    data: actionButtons = {
      showScheduleButton: false,
      showExecuteButton: false,
    },
  } = useQuery({
    queryKey: [
      'proposal-actions',
      id,
      proposal?.proposalDetails?.status,
      isEmergencyModeActive,
      isEmergencyExecutionCommittee,
    ],
    queryFn: async () => {
      if (
        !emergencyProtectedTimelock ||
        !readDynamicContract ||
        !id ||
        !proposal
      ) {
        return { showScheduleButton: false, showExecuteButton: false };
      }

      try {
        const canSchedule = await readDynamicContract('canScheduleProposal', [
          BigInt(id),
        ]);

        const canExecute = await emergencyProtectedTimelock.readContract(
          'canExecute',
          [BigInt(id)],
        );

        const isExecuted =
          proposal?.proposalDetails?.status === ProposalStatus.Executed;

        const showExecuteButton =
          !isExecuted &&
          (canExecute ||
            (isEmergencyModeActive && isEmergencyExecutionCommittee));

        return {
          showScheduleButton: !!canSchedule,
          showExecuteButton,
        };
      } catch (e) {
        console.error('Failed to fetch proposal actions', e);
        return { showScheduleButton: false, showExecuteButton: false };
      }
    },
    enabled:
      !!emergencyProtectedTimelock &&
      !!readDynamicContract &&
      !!id &&
      !!proposal,
  });

  const { showScheduleButton, showExecuteButton } = actionButtons;

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
      timestamp: proposal.proposalDetails?.submittedAt || 0,
      showYear: true,
    });

    return `${date.date} ${date.tz}`;
  }, [proposal]);

  const scheduledAt = useMemo(() => {
    if (!proposal || !proposal.proposalDetails?.scheduledAt) {
      return null;
    }

    const date = getDateFromTimestamp({
      timestamp: proposal.proposalDetails?.scheduledAt || 0,
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

  const calls = proposal.proposalDetails?.calls || [];

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
            {voteId && (
              <SubmitDate as="span">
                Submitted from{' '}
                <ProposalLink
                  href={`${config.voteOrigin}/vote/${voteId}`}
                  target="_blank"
                >
                  Aragon {voteId}
                </ProposalLink>{' '}
                on {submittedAt}
              </SubmitDate>
            )}
            {!voteId && (
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
        {voteId && (
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
        {!voteId && (
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
