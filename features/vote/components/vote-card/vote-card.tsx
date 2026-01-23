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
  InlineLoaderStyled,
} from './style';
import { Button, Container, Link } from '@lidofinance/lido-ui';
import { VoteStatusChips } from '../vote-status-chips';
import { getVoteDetailsFormatted } from '../../utils/get-vote-details-formatted';
import { useLidoSDK } from 'providers/lido-sdk';
import { formatEther, Hex } from 'viem';
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
import { Box } from 'shared/components/box';

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
  const { voteData, isLoading } = useVoteContext();

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
    eventExecuteVote: voteData?.eventExecute,
  });

  const isEnded = useMemo(
    () =>
      voteData?.status === VoteStatus.Rejected ||
      voteData?.status === VoteStatus.Executed,
    [voteData],
  );

  const formattedDate = useMemo(() => {
    if (!voteData || (!voteData.eventExecute && !voteData.startDate)) {
      return null;
    }
    if (!voteData.eventExecute) {
      return `Started ${formatDate(Number(voteData.startDate))}`;
    }

    if (voteData.eventExecute.executedAt) {
      return `Enacted ${formatDate(Number(voteData.eventExecute.executedAt))}`;
    }
  }, [voteData]);

  if (isLoading)
    return (
      <Container as="main" size="tight" key={voteId}>
        <InlineLoaderStyled />
      </Container>
    );

  if (!voteData)
    return (
      <Container as="main" size="tight" key={voteId}>
        <Box textAlign="center">
          <Text size={18} strong>
            No results found for vote #{voteId}
          </Text>
          <Text size={14} color="secondary">
            Sorry, we weren&#39;t able to find any votes for your search. Try
            another search.
          </Text>
        </Box>
      </Container>
    );

  const {
    totalSupply,
    nayNum,
    yeaNum,
    nayPct,
    yeaPct,
    nayPctOfTotalSupplyFormatted,
    yeaPctOfTotalSupplyFormatted,
  } = getVoteDetailsFormatted(voteData);

  return (
    <Container as="main" size="tight" key={voteId}>
      <Card>
        <VoteHeader>
          <VoteTitle data-testid="voteTitle">Vote #{voteId}</VoteTitle>
          {!voteDualGovernanceStatusLoading && (
            <VoteStatusChips
              totalSupply={totalSupply}
              nayNum={nayNum}
              yeaNum={yeaNum}
              minAcceptQuorum={Number(formatEther(voteData?.minAcceptQuorum))}
              status={voteData?.status}
              executedTxHash={voteData?.eventExecute?.event.transactionHash}
              votePhase={voteData.phase}
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
              {voteData.eventStart?.event.transactionHash ? (
                <Link
                  href={getEtherscanTxLink(
                    chainId,
                    voteData.eventStart?.event.transactionHash,
                  )}
                >
                  #{voteData.snapshotBlock.toString()}
                </Link>
              ) : (
                `#${voteData.snapshotBlock.toString()}`
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
        {(voteData.phase === VotePhase.Main ||
          voteData.phase === VotePhase.Objection) && (
          <>
            <VoteProgressBar
              startDate={Number(voteData.startDate)}
              voteTime={Number(voteData.voteTime)}
              objectionPhaseTime={Number(voteData.objectionPhaseTime)}
              isEnded={isEnded}
              votePhase={voteData.phase}
            />
          </>
        )}
        {voteData.voteEvents.length > 0 && (
          <VotersList voteEvents={voteData.voteEvents} />
        )}
        <SectionHeading>Proposal</SectionHeading>
        {voteData.eventStart?.args.metadata && (
          <DetailsBoxWrap>
            <DescriptionWrap data-testid="voteDescription">
              <VoteDescription
                metadata={voteData.eventStart.args.metadata}
                allowMD
              />
            </DescriptionWrap>
          </DetailsBoxWrap>
        )}
        <DetailsBoxWrap data-testid="voteScript">
          <VoteScript
            script={voteData.script as Hex}
            metadata={voteData.eventStart?.args.metadata || ''}
          />
        </DetailsBoxWrap>
        {isWalletConnectionAllowed && voteData.phase !== VotePhase.Closed && (
          <VoteActions disabled={!isWalletConnected} />
        )}
        {!isWalletConnected &&
          isWalletConnectionAllowed &&
          voteData.phase !== VotePhase.Closed && (
            <Button fullwidth onClick={openConnectWalletModal}>
              Connect wallet
            </Button>
          )}
        {isWalletConnected && (
          <>
            <VoteInfoDelegated
              voteEvents={voteData.voteEvents}
              walletAddress={walletAddress}
            />
            {voteData.phase !== VotePhase.Closed && (
              <VotePowerInfo votePowerWei={voteData.votePowerWei} />
            )}
            {voteData.canExecute && (
              <Button fullwidth color="success" onClick={handleEnact}>
                Enact
              </Button>
            )}
          </>
        )}
      </Card>
    </Container>
  );
};
