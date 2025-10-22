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
  SubmittedBy,
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
import { Box, Link } from '@lidofinance/lido-ui';
import { useAccount } from 'wagmi';
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
import { Log } from 'viem';
import { findAbiItem } from 'utils/find-abi-item';
import invariant from 'tiny-invariant';
import { getEtherscanTxLink } from 'utils/etherscan';
import {
  calculateAverageBlockTime,
  estimateBlockRangeFromTimestamp,
} from 'utils/estimate-block-range';
import { expandGetLogsSearchWindow } from 'utils/expand-get-logs-search-window';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  replaceAddressAndCIDInMD,
  replaceImagesInMD,
  replaceLinksInMD,
} from 'utils/replace-custom-elements-in-MD';
import { MarkdownWrap } from '../proposals-list/style';
import { getContractAddress } from 'shared/blockchain/get-contract-address';

type Props = {
  id: number;
};

export const ProposalFullInfo = ({ id }: Props) => {
  const router = useRouter();

  const [proposal, setProposal] = useState<ProposalCombinedData | null>(null);
  const [voteId, setVoteId] = useState<number | null>(null);

  const { isConnected, address } = useAccount();
  const isSupportedChain = useIsSupportedChain();
  const { chainId, rpcProvider } = useLidoSDK();

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
        client: rpcProvider,
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
      if (!proposal?.proposalId || !rpcProvider || !chainId) {
        return null;
      }

      try {
        const proposalExecutedEvent = await getProposalExecutedEvent({
          proposalId: proposal.proposalId,
          client: rpcProvider,
          chainId: chainId,
        });

        if (proposalExecutedEvent && proposalExecutedEvent.blockNumber) {
          const block = await rpcProvider.getBlock({
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
      !!rpcProvider &&
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

  const { data: proposalScheduledLog } = useQuery({
    queryKey: [
      proposal?.proposalId,
      chainId,
      proposal?.proposalDetails.submittedAt,
    ],
    queryFn: async () => {
      invariant(proposal, 'Proposal must be defined');
      invariant(rpcProvider, 'Client must be defined');

      const averageBlockTime = await calculateAverageBlockTime(rpcProvider);

      const { fromBlock, toBlock } = await estimateBlockRangeFromTimestamp(
        proposal.proposalDetails.scheduledAt,
        2499n, // Half of the RPC getLogs limit
        averageBlockTime,
        rpcProvider,
      );

      const eventAbi = findAbiItem({
        abi: EmergencyProtectedTimelock.abi,
        name: 'ProposalScheduled',
        type: 'event',
      });

      // Three ranges for log fetching to expand the search window up to ~15000 blocks
      const ranges = expandGetLogsSearchWindow({ fromBlock, toBlock });

      const emergencyProtectedTimelockAddress = getContractAddress(
        EmergencyProtectedTimelock,
        chainId,
      );

      // Fetch logs for each block range
      const logsPromises = ranges.map((range) => {
        return rpcProvider.getLogs({
          address: emergencyProtectedTimelockAddress,
          event: eventAbi,
          fromBlock: range.fromBlock,
          toBlock: range.toBlock,
          args: {
            id: BigInt(proposal.proposalId),
          },
        });
      });

      const allLogsResults = await Promise.all(logsPromises);
      const proposalScheduledLogs = allLogsResults.flat();

      return proposalScheduledLogs[0] || null;
    },
    enabled:
      !!proposal && !!rpcProvider && !!proposal.proposalDetails.scheduledAt,
  });

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
                {proposal.DGEvent?.transactionHash ? (
                  <Link
                    href={getEtherscanTxLink(
                      chainId,
                      proposal.DGEvent?.transactionHash,
                    )}
                  >
                    Submitted
                  </Link>
                ) : (
                  <span>Submitted</span>
                )}{' '}
                from{' '}
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
          <>
            {proposalScheduledLog ? (
              <SubmitDate as="span">
                <Link
                  href={getEtherscanTxLink(
                    chainId,
                    proposalScheduledLog.transactionHash,
                  )}
                >
                  Scheduled
                </Link>{' '}
                on {scheduledAt}
              </SubmitDate>
            ) : (
              <SubmitDate as="span">Scheduled on {scheduledAt}</SubmitDate>
            )}
          </>
        )}
        {proposalExecutedAt && (
          <SubmitDate as="span">Executed on {proposalExecutedAt}</SubmitDate>
        )}
      </ProposalStateLogWrapper>
      <Box marginTop={'30px'}>
        {voteId && (
          <>
            <Text weight={500} size={28}>
              Description
            </Text>
            <Box marginTop={12}>
              <Text size={15} color="secondary">
                <b>Disclaimer:</b> Description provided by the proposal author;
                may include items not under Dual Governance
              </Text>
            </Box>
            {proposal.DGEvent?.args?.metadata && (
              <Box marginTop={30}>
                <MarkdownWrap>
                  <ReactMarkdown
                    remarkPlugins={[[remarkGfm, {}]]}
                    components={{
                      a: replaceLinksInMD,
                      img: replaceImagesInMD,
                      code: replaceAddressAndCIDInMD,
                    }}
                  >
                    {proposal?.DGEvent.args?.metadata}
                  </ReactMarkdown>
                </MarkdownWrap>
              </Box>
            )}
          </>
        )}
        {!voteId && (
          <SubmittedBy>
            <Text size={22}>
              Proposal submitted by{' '}
              <Text size={22} weight={500}>
                {proposal?.DGEvent?.args.proposerAccount}
              </Text>
            </Text>
          </SubmittedBy>
        )}
      </Box>

      {calls && calls.length > 0 && (
        <Box marginTop={30}>
          <Script rawCalls={calls} />
        </Box>
      )}

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
