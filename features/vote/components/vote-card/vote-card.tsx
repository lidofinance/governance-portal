import { useVote } from '../../hooks/use-vote';
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
import { Container, Link } from '@lidofinance/lido-ui';
import { VoteStatusChips } from '../vote-status-chips';
import { getVoteDetailsFormatted } from '../../utils/get-vote-details-formatted';
import { useLidoSDK } from 'providers/lido-sdk';
import { formatEther } from 'viem';
import { useVoteDualGovernanceStatus } from '../../hooks/use-vote-dual-governance-status';
import { Text } from 'shared/components/text';
import { getEtherscanTxLink } from 'utils/etherscan';
import { useMemo } from 'react';
import { VoteYesNoBar } from '../vote-yes-no-bar';
import { VoteDescription } from '../vote-description';
import { VotersList } from '../voters-list';

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
  const voteData = useVote({ voteId });

  const {
    data: voteDualGovernanceStatus,
    isLoading: voteDualGovernanceStatusLoading,
  } = useVoteDualGovernanceStatus({
    voteId,
    eventExecuteVote: voteData?.eventExecute,
  });

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

  if (!voteData) return null;

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
              minAcceptQuorum={Number(formatEther(voteData.minAcceptQuorum))}
              status={voteData.status}
              executedTxHash={voteData.eventExecute?.event.transactionHash}
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
        {voteData.voteEvents.length > 0 && (
          <VotersList voteEvents={voteData.voteEvents} />
        )}
        <DetailsBoxWrap data-testid="voteScript">
          {/*<VoteScript script={decoded[0].args[0]} />*/}
        </DetailsBoxWrap>
      </Card>
    </Container>
  );
};
