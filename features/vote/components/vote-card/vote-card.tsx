import {
  BlockWrap,
  BoxVotes,
  Card,
  DescriptionWrap,
  DetailsBoxWrap,
  SectionHeading,
  VoteHeader,
  VoteTimestamps,
  VoteTitle,
} from './style';
import { Button, Link } from '@lidofinance/lido-ui';
import { VoteStatusChips } from '../vote-status-chips';
import { getVoteDetailsFormatted } from '../../utils/get-vote-details-formatted';
import { useLidoSDK } from 'providers/lido-sdk';
import { formatEther } from 'viem';
import { useVoteDualGovernanceStatus } from '../../hooks/use-vote-dual-governance-status';
import { Text } from 'shared/components/text';
import { getEtherscanTxLink } from 'utils/etherscan';
import React, { useCallback, useMemo } from 'react';
import { VoteYesNoBar } from '../vote-yes-no-bar';
import { VoteDescription } from '../vote-description';
import { VotersList } from '../voters-list';
import { VoteScript } from '../vote-script/vote-script';
import { useAccount } from 'wagmi';
import { VotePhase, VoteStatus } from 'shared/votes/types';
import { useUserConfig } from 'config/user-config';
import { useConnect } from 'reef-knot/core-react';
import { VoteInfoDelegated } from '../vote-info-delegated';
import { VotePowerInfo } from '../vote-power-info';
import { VoteActions } from '../vote-actions';
import { useVoteContext } from 'features/vote/providers/vote-context';
import { VoteProgressBar } from '../vote-progress-bar';
import { useVoteActionsContext } from 'features/vote/providers/vote-actions-context';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';

type Props = {
  voteId: string;
};

const localeDateOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'short',
};

const formatDate = (date: number) =>
  new Date(date * 1000).toLocaleDateString(
    'en-US',
    localeDateOptions as Intl.DateTimeFormatOptions,
  );

export const VoteCard = ({ voteId }: Props) => {
  const { chainId } = useLidoSDK();
  const {
    vote,
    canExecute,
    eventExecute,
    eventStart,
    voteEvents,
    voterDaoTokenBalance,
    voteTime,
    objectionPhaseTime,
  } = useVoteContext();

  const isSupportedChain = useIsSupportedChain();

  const { isConnected: isWalletConnected, address: walletAddress } =
    useAccount();

  const { isWalletConnectionAllowed } = useUserConfig();
  const { connect } = useConnect();

  const { handleEnact } = useVoteActionsContext();

  const openConnectWalletModal = useCallback(async () => {
    await connect();
  }, [connect]);

  const {
    data: voteDualGovernanceStatus,
    isLoading: voteDualGovernanceStatusLoading,
  } = useVoteDualGovernanceStatus({
    voteId,
    eventExecuteVote: eventExecute,
  });

  const isEnded =
    vote.state.status === VoteStatus.Rejected ||
    vote.state.status === VoteStatus.Executed;

  const formattedDate = useMemo(() => {
    if (!eventExecute && !vote.startDate) {
      return null;
    }

    if (!eventExecute) {
      return `Started ${formatDate(Number(vote.startDate))}`;
    }

    if (eventExecute.executedAt) {
      return `Enacted ${formatDate(Number(eventExecute.executedAt))}`;
    }
  }, [eventExecute, vote.startDate]);

  const {
    totalSupply,
    nayNum,
    yeaNum,
    nayPct,
    yeaPct,
    nayPctOfTotalSupplyFormatted,
    yeaPctOfTotalSupplyFormatted,
  } = getVoteDetailsFormatted(vote);

  return (
    <Card key={voteId}>
      <VoteHeader>
        <VoteTitle data-testid="voteTitle">Vote #{voteId}</VoteTitle>
        {!voteDualGovernanceStatusLoading && (
          <VoteStatusChips
            totalSupply={totalSupply}
            nayNum={nayNum}
            yeaNum={yeaNum}
            minAcceptQuorum={Number(formatEther(vote.minAcceptQuorum))}
            status={vote.state.status}
            executedTxHash={eventExecute?.event.transactionHash}
            votePhase={vote.phase}
            chainId={chainId}
            proposalId={voteDualGovernanceStatus?.proposalId || null}
            voteDualGovernanceStatus={
              voteDualGovernanceStatus?.proposalStatus || null
            }
          />
        )}
        <BlockWrap>
          <Text as="span" color="secondary" size={12}>
            {'Block '}
          </Text>
          <Text as="span" color="default" size={12} data-testid="blockNumber">
            {eventStart?.event.transactionHash ? (
              <Link
                href={getEtherscanTxLink(
                  chainId,
                  eventStart?.event.transactionHash,
                )}
              >
                #{vote.snapshotBlock.toString()}
              </Link>
            ) : (
              `#${vote.snapshotBlock.toString()}`
            )}
          </Text>
        </BlockWrap>
      </VoteHeader>
      <VoteTimestamps>
        <Text color="secondary" size={12} data-testid="voteDate">
          {formattedDate}
        </Text>
      </VoteTimestamps>
      <DetailsBoxWrap>
        <BoxVotes data-testid="voteDetails">
          <VoteYesNoBar
            yeaPct={yeaPct}
            nayPct={nayPct}
            yeaNum={yeaNum}
            nayNum={nayNum}
            yeaPctOfTotalSupply={yeaPctOfTotalSupplyFormatted}
            nayPctOfTotalSupply={nayPctOfTotalSupplyFormatted}
            showOnForeground
            showNumber
          />
        </BoxVotes>
      </DetailsBoxWrap>
      {(vote.phase === VotePhase.Main ||
        vote.phase === VotePhase.Objection) && (
        <>
          <VoteProgressBar
            startDate={Number(vote.startDate)}
            voteTime={voteTime}
            objectionPhaseTime={objectionPhaseTime}
            isEnded={isEnded}
            votePhase={vote.phase}
          />
        </>
      )}
      <VotersList />
      <SectionHeading>Proposal</SectionHeading>
      {eventStart?.args.metadata && (
        <DetailsBoxWrap>
          <DescriptionWrap data-testid="voteDescription">
            <VoteDescription metadata={eventStart.args.metadata} allowMD />
          </DescriptionWrap>
        </DetailsBoxWrap>
      )}
      <DetailsBoxWrap data-testid="voteScript">
        <VoteScript
          script={vote.script}
          metadata={eventStart?.args.metadata || ''}
        />
      </DetailsBoxWrap>
      {!isWalletConnected &&
        isWalletConnectionAllowed &&
        vote.phase !== VotePhase.Closed && (
          <Button fullwidth onClick={openConnectWalletModal}>
            Connect wallet
          </Button>
        )}
      {isWalletConnected && (
        <>
          <VoteInfoDelegated
            voteEvents={voteEvents}
            walletAddress={walletAddress}
          />
          {vote.phase !== VotePhase.Closed && (
            <>
              <VotePowerInfo votePowerWei={voterDaoTokenBalance} />
              <VoteActions />
            </>
          )}
          {canExecute && (
            <Button
              fullwidth
              color="success"
              onClick={handleEnact}
              disabled={!isSupportedChain}
            >
              Enact
            </Button>
          )}
        </>
      )}
    </Card>
  );
};
