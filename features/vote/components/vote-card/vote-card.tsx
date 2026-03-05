import {
  BlockWrap,
  BoxVotes,
  Card,
  DescriptionWrap,
  DetailsBoxWrap,
  EnactButtonWrap,
  SectionHeading,
  VoteHeader,
  VoteTimestamp,
  VoteTitle,
} from './style';
import { Button, Link } from '@lidofinance/lido-ui';
import { VoteStatusChips } from '../vote-status-chips';
import { getVoteDetailsFormatted } from '../../utils/get-vote-details-formatted';
import { useLidoSDK } from 'providers/lido-sdk';
import { formatEther } from 'viem';
import { Text } from 'shared/components/text';
import { getEtherscanTxLink } from 'utils/etherscan';
import React, { useCallback, useMemo } from 'react';
import { VoteYesNoBar } from '../vote-yes-no-bar';
import { VoteDescription } from '../vote-description';
import { VotersList } from '../voters-list';
import { VoteScript } from '../vote-script/vote-script';
import { useAccount } from 'wagmi';
import { VotePhase, VoteStatus } from 'shared/votes/types';
import { useConnect } from 'reef-knot/core-react';
import { VoteInfo } from '../vote-info';
import { VotePowerInfo } from '../vote-power-info';
import { VoteActions } from '../vote-actions';
import { useVoteContext } from 'features/vote/providers/vote-context';
import { VoteProgressBar } from '../vote-progress-bar';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useEnactVoteAction } from 'features/vote/write-actions/enact-vote/action';

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
    voteTime,
    objectionPhaseTime,
    dgProposal,
  } = useVoteContext();

  const isSupportedChain = useIsSupportedChain();

  const { isConnected: isWalletConnected, address: walletAddress } =
    useAccount();

  const { connect } = useConnect();

  const processEnact = useEnactVoteAction();

  const openConnectWalletModal = useCallback(async () => {
    await connect();
  }, [connect]);

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
    <Card key={voteId} data-testid="voteCard">
      <VoteHeader>
        <VoteTitle data-testid="voteTitle">Vote #{voteId}</VoteTitle>
        <VoteStatusChips
          totalSupply={totalSupply}
          nayNum={nayNum}
          yeaNum={yeaNum}
          minAcceptQuorum={Number(formatEther(vote.minAcceptQuorum))}
          status={vote.state.status}
          executedTxHash={eventExecute?.event.transactionHash}
          votePhase={vote.phase}
          chainId={chainId}
          proposalId={dgProposal?.proposalId}
          proposalStatus={dgProposal?.proposalStatus}
        />
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
      <VoteTimestamp color="secondary" size={12} data-testid="voteDate">
        {formattedDate}
      </VoteTimestamp>
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
      {(vote.phase === VotePhase.Main ||
        vote.phase === VotePhase.Objection) && (
        <VoteProgressBar
          startDate={Number(vote.startDate)}
          voteTime={voteTime}
          objectionPhaseTime={objectionPhaseTime}
          isEnded={isEnded}
          votePhase={vote.phase}
        />
      )}
      <VotersList walletAddress={walletAddress} />
      <SectionHeading>Proposal</SectionHeading>
      {eventStart?.args.metadata && (
        <DescriptionWrap data-testid="voteDescription">
          <VoteDescription metadata={eventStart.args.metadata} allowMD />
        </DescriptionWrap>
      )}
      <DetailsBoxWrap data-testid="voteScript">
        <VoteScript
          script={vote.script}
          metadata={eventStart?.args.metadata || ''}
        />
      </DetailsBoxWrap>
      {!isWalletConnected && vote.phase !== VotePhase.Closed && (
        <DetailsBoxWrap>
          <Button fullwidth onClick={openConnectWalletModal}>
            Connect wallet
          </Button>
        </DetailsBoxWrap>
      )}
      {isWalletConnected && (
        <>
          {vote.phase !== VotePhase.Closed && <VotePowerInfo />}
          <VoteInfo walletAddress={walletAddress} />
          {vote.phase !== VotePhase.Closed && <VoteActions />}
          {canExecute && (
            <EnactButtonWrap>
              <Button
                fullwidth
                color="success"
                onClick={processEnact}
                disabled={!isSupportedChain}
              >
                Enact
              </Button>
            </EnactButtonWrap>
          )}
        </>
      )}
    </Card>
  );
};
