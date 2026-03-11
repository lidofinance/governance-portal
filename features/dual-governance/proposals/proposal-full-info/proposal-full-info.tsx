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
import { useConfig } from 'config';
import { isTestnet as getIsTestnet } from 'shared/blockchain/utils/is-testnet';
import { ArrowRight } from 'shared/components/icons';
import { useProposalStatus } from 'features/dual-governance/hooks/use-proposal-status';
import { Badge } from '../shared-components/vote-status-badge/style';
import { Box, Link } from '@lidofinance/lido-ui';
import { useAccount } from 'wagmi';
import { ConnectWalletButton } from 'shared/wallet';
import { useLidoSDK } from 'providers/lido-sdk';
import { useIsEmergencyModeActive } from '../../hooks/use-is-emergency-mode-active';
import { useProposalEvents } from '../../hooks/use-proposal-events';
import { DGTooltip } from '../../tooltips';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useDynamicDualGovernance } from '../../hooks';
import { ProposalStatus } from '../types';
import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';
import { useProposals } from '../../hooks/use-proposals';
import { isAragonProposal } from 'utils/proposals/is-aragon-proposal';
import { getEtherscanTxLink } from 'utils/etherscan';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  replaceAddressAndCIDInMD,
  replaceImagesInMD,
  replaceLinksInMD,
} from 'utils/replace-custom-elements-in-MD';
import { MarkdownWrap } from '../proposals-list/style';
import { BaseCall, decodeCalls } from 'utils/decode-evm-script-calls';
import { GOVERNANCE_PATH, votePage } from 'constants/urls';

type Props = {
  id: number;
};

export const ProposalFullInfo = ({ id }: Props) => {
  const [proposal, setProposal] = useState<ProposalCombinedData | null>(null);
  const [voteId, setVoteId] = useState<number | null>(null);

  const { isConnected, address } = useAccount();
  const isSupportedChain = useIsSupportedChain();
  const { chainId, rpcProvider } = useLidoSDK();

  const { isEmergencyModeActive } = useIsEmergencyModeActive();

  const { userConfig } = useConfig();
  const { readDynamicContract } = useDynamicDualGovernance();
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  const isInTestMode =
    userConfig.savedUserConfig.useTestContracts && getIsTestnet(chainId);

  const {
    getProposalById,
    isLoading: isProposalsLoading,
    refetchProposals,
  } = useDualGovernanceProposalsContext();

  const cachedProposal = getProposalById(id);

  const { data: fetchedProposal, isLoading: isFetchLoading } = useProposals({
    id,
    enabled: !cachedProposal && !isProposalsLoading,
  }) as UseQueryResult<ProposalCombinedData>;

  const isLoading = isProposalsLoading || isFetchLoading;

  const resolvedProposalDetails =
    cachedProposal?.proposalDetails ?? fetchedProposal?.proposalDetails;

  const { data: proposalEvents } = useProposalEvents({
    proposalDetails: resolvedProposalDetails,
    fetchExecuted: true,
  });

  const { data: queryVoteId, isLoading: isVoteIdLoading } = useQuery({
    queryKey: [
      'proposal-vote-id',
      chainId,
      proposalEvents?.proposalSubmittedEvent?.transactionHash,
      isInTestMode,
    ],
    queryFn: async () => {
      if (!proposalEvents?.proposalSubmittedEvent) return null;
      return await isAragonProposal({
        client: rpcProvider,
        proposalLog: proposalEvents.proposalSubmittedEvent,
        chainId,
        isInTestMode,
      });
    },
    enabled: !!proposalEvents?.proposalSubmittedEvent,
  });

  useEffect(() => {
    if (!proposal?.voteId && !isVoteIdLoading && queryVoteId && !voteId) {
      setVoteId(Number(queryVoteId));
    } else if (proposal && proposal.voteId && !voteId) {
      setVoteId(proposal.voteId);
    }
  }, [isVoteIdLoading, proposal, queryVoteId, voteId]);

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

  const proposalExecutedAt = useMemo(() => {
    const executedEvent = proposalEvents?.proposalExecutedEvent;
    if (!executedEvent?.blockTimestamp) {
      return null;
    }
    const date = getDateFromTimestamp({
      timestamp: Number(executedEvent.blockTimestamp),
      showYear: true,
    });
    return `${date.date} ${date.tz}`;
  }, [proposalEvents?.proposalExecutedEvent]);

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

  const proposalScheduledLog = proposalEvents?.proposalScheduledEvent ?? null;

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

  const calls = (proposal.proposalDetails?.calls as BaseCall[]) || [];
  const decodedEvmScriptCalls = decodeCalls({ calls: calls, chainId });

  return (
    <ProposalContainer>
      <ProposalHeader>
        <ArrowIconWrapper target="_self" href={GOVERNANCE_PATH}>
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
                <ProposalLink href={votePage(voteId)} target="_blank">
                  Vote #{voteId}
                </ProposalLink>{' '}
                on {submittedAt}
              </SubmitDate>
            )}
            {!voteId && (
              <SubmitDate as="span">
                {proposal.DGEvent?.transactionHash ? (
                  <Link
                    href={getEtherscanTxLink(
                      chainId,
                      proposal.DGEvent.transactionHash,
                    )}
                  >
                    Submitted
                  </Link>
                ) : (
                  <span>Submitted</span>
                )}{' '}
                on {submittedAt}
              </SubmitDate>
            )}
          </>
        )}
        {scheduledAt && (
          <>
            {proposalScheduledLog && proposalScheduledLog.transactionHash ? (
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
          <SubmitDate as="span">
            {proposalEvents?.proposalExecutedEvent?.transactionHash ? (
              <Link
                href={getEtherscanTxLink(
                  chainId,
                  proposalEvents.proposalExecutedEvent.transactionHash,
                )}
              >
                Executed
              </Link>
            ) : (
              <span>Executed</span>
            )}{' '}
            on {proposalExecutedAt}
          </SubmitDate>
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
          <Script decodedCalls={decodedEvmScriptCalls} />
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
