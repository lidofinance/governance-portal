import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  ActionsWrapper,
  ArrowIconWrapper,
  DescriptionLoaderStyled,
  EventsLoaderStyled,
  ProposalContainer,
  ProposalHeader,
  ProposalName,
  ProposalStateLogWrapper,
  SubmitDate,
} from './style';
import { Text } from 'shared/components/text';

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
import { useAccount, usePublicClient } from 'wagmi';
import { ConnectWalletButton } from 'shared/wallet';
import { useLidoSDK } from 'providers/lido-sdk';
import { useIsEmergencyModeActive } from '../../hooks/use-is-emergency-mode-active';
import { DGTooltip } from '../../tooltips';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useDynamicDualGovernance } from '../../hooks';
import { ProposalStatus } from '../types';
import { isAragonProposal } from 'utils/proposals/is-aragon-proposal';
import { decodeCalls, BaseCall } from 'utils/decode-evm-script-calls';
import { PublicClient } from 'viem';
import { getEtherscanTxLink } from 'utils/etherscan';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  replaceAddressAndCIDInMD,
  replaceImagesInMD,
  replaceLinksInMD,
} from 'utils/replace-custom-elements-in-MD';
import { MarkdownWrap } from '../proposals-list/style';
import { useProposalDetails } from '../../hooks/use-proposal-details';
import { useProposalEvents } from '../../hooks/use-proposal-events';
import { useIsEmergencyCommittee } from '../../hooks/use-is-emergency-committee';

type Props = {
  id: number;
};

export const ProposalFullInfo = ({ id }: Props) => {
  const router = useRouter();
  const { data: proposalDetails, refetch: refetchProposalDetails } =
    useProposalDetails(id);
  const { data: proposalEvents, isLoading: isEventsLoading } =
    useProposalEvents({
      proposalDetails,
      fetchExecuted: true,
    });

  const { isConnected } = useAccount();
  const isSupportedChain = useIsSupportedChain();
  const { chainId } = useLidoSDK();
  const client = usePublicClient();
  const { isEmergencyModeActive } = useIsEmergencyModeActive();

  const { data: voteId } = useQuery({
    queryKey: ['proposal-vote-id', chainId],
    queryFn: async () => {
      if (!proposalEvents?.proposalSubmittedEvent) {
        return null;
      }
      return await isAragonProposal({
        client: client as PublicClient,
        proposalLog: proposalEvents?.proposalSubmittedEvent,
        chainId,
      });
    },
    enabled: !!proposalEvents?.proposalSubmittedEvent,
  });

  const proposalStatusInfo = useProposalStatus({
    proposalStatus: proposalDetails?.status || 0,
    submittedAt: proposalDetails?.submittedAt || 0,
    scheduledAt: proposalDetails?.scheduledAt || 0,
  });

  const { readDynamicContract } = useDynamicDualGovernance();
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  const updateProposalState = useCallback(async () => {
    await refetchProposalDetails();
    setIsScheduleLoading(false);
    setIsExecuteLoading(false);
  }, [refetchProposalDetails]);

  const scheduleProposal = useScheduleProposalAction({
    onConfirm: updateProposalState,
  });

  const executeProposal = useExecuteProposalAction({
    onConfirm: updateProposalState,
  });

  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [isExecuteLoading, setIsExecuteLoading] = useState(false);

  const { data: isEmergencyExecutionCommittee = false } =
    useIsEmergencyCommittee();

  const {
    data: actionButtons = {
      showScheduleButton: false,
      showExecuteButton: false,
    },
  } = useQuery({
    queryKey: [
      'proposal-actions',
      id,
      proposalDetails?.status,
      isEmergencyModeActive,
      isEmergencyExecutionCommittee,
    ],
    queryFn: async () => {
      if (
        !emergencyProtectedTimelock ||
        !readDynamicContract ||
        !id ||
        !proposalDetails
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

        const isExecuted = proposalDetails?.status === ProposalStatus.Executed;

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
      !!proposalDetails,
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
    if (!proposalDetails) {
      return null;
    }

    const date = getDateFromTimestamp({
      timestamp: proposalDetails?.submittedAt || 0,
      showYear: true,
    });

    return `${date.date} ${date.tz}`;
  }, [proposalDetails]);
  const scheduledAt = useMemo(() => {
    if (!proposalDetails?.scheduledAt) {
      return null;
    }

    const date = getDateFromTimestamp({
      timestamp: proposalDetails?.scheduledAt || 0,
      showYear: true,
    });

    return `${date.date} ${date.tz}`;
  }, [proposalDetails]);

  const decodedCalls = useMemo(
    () =>
      proposalDetails?.calls
        ? decodeCalls({ calls: proposalDetails.calls as BaseCall[], chainId })
        : [],
    [proposalDetails?.calls, chainId],
  );

  const executedAt = useMemo(() => {
    if (!proposalEvents?.proposalExecutedEvent) {
      return null;
    }

    const date = getDateFromTimestamp({
      timestamp: Number(
        proposalEvents?.proposalExecutedEvent.blockTimestamp || 0,
      ),
      showYear: true,
    });

    return `${date.date} ${date.tz}`;
  }, [proposalEvents?.proposalExecutedEvent]);

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
        {isEventsLoading && <EventsLoaderStyled />}
        {submittedAt && !isEventsLoading && (
          <>
            {voteId && (
              <SubmitDate as="span">
                {proposalEvents?.proposalSubmittedEvent &&
                proposalEvents?.proposalSubmittedEvent.transactionHash ? (
                  <Link
                    href={getEtherscanTxLink(
                      chainId,
                      proposalEvents?.proposalSubmittedEvent.transactionHash,
                    )}
                  >
                    Submitted
                  </Link>
                ) : (
                  <span>Submitted</span>
                )}{' '}
                from{' '}
                <Link
                  href={`${config.voteOrigin}/vote/${voteId}`}
                  target="_blank"
                >
                  Vote #{Number(voteId)}
                </Link>{' '}
                on {submittedAt}
              </SubmitDate>
            )}
            {!voteId && (
              <SubmitDate as="span">Submitted on {submittedAt}</SubmitDate>
            )}
          </>
        )}
        {isEventsLoading && <EventsLoaderStyled />}
        {scheduledAt && !isEventsLoading && (
          <>
            {proposalEvents?.proposalScheduledEvent &&
            proposalEvents?.proposalScheduledEvent.transactionHash ? (
              <SubmitDate as="span">
                <Link
                  href={getEtherscanTxLink(
                    chainId,
                    proposalEvents?.proposalScheduledEvent.transactionHash,
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
        {isEventsLoading && <EventsLoaderStyled />}
        {executedAt && !isEventsLoading && (
          <>
            {proposalEvents?.proposalExecutedEvent?.transactionHash ? (
              <SubmitDate as="span">
                <Link
                  href={getEtherscanTxLink(
                    chainId,
                    proposalEvents?.proposalExecutedEvent.transactionHash,
                  )}
                >
                  Executed
                </Link>{' '}
                {executedAt && `on ${executedAt}`}
              </SubmitDate>
            ) : (
              <SubmitDate as="span">
                Executed {executedAt && `on ${executedAt}`}
              </SubmitDate>
            )}
          </>
        )}
      </ProposalStateLogWrapper>
      <Box marginTop={'30px'}>
        <Text weight={500} size={28}>
          Description
        </Text>
        <Box marginTop={12}>
          <Text size={15} color="secondary">
            <b>Disclaimer:</b> Description provided by proposer.
          </Text>
        </Box>
        {isEventsLoading && <DescriptionLoaderStyled />}

        {voteId && !isEventsLoading && (
          <>
            {proposalEvents?.proposalSubmittedEvent?.args.metadata && (
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
                    {proposalEvents?.proposalSubmittedEvent.args?.metadata}
                  </ReactMarkdown>
                </MarkdownWrap>
              </Box>
            )}
          </>
        )}
      </Box>

      {proposalDetails?.calls && proposalDetails.calls.length > 0 && (
        <Box marginTop={30}>
          <Script decodedCalls={decodedCalls} />
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
