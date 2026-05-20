import { useCallback } from 'react';

import Link from 'next/link';
import { Text, Tooltip } from '@lidofinance/lido-ui';
import { InfoIcon } from 'shared/components/icons';
import {
  VoteDashboardCard,
  VoteTitle,
  VoteDescriptionWrap,
  VoteSummary,
  VoteQuorum,
  QuorumRow,
  QuorumLabel,
  QuorumValue,
  QuorumReached,
  QuorumReachedWrap,
  QuorumTooltipBody,
  QuorumTooltipRow,
  VoteTotalsRow,
} from './style';
import { formatVoteAmount } from '@vote/utils/format-vote-amount';
import { splitVoteDescription } from '@vote/utils/split-vote-description';
import { EventExecuteVote, Vote, VoteStatus } from 'shared/votes/types';
import { getVoteDetailsFormatted } from '@vote/utils/get-vote-details-formatted';
import { useVotePassedCallback } from '@vote/hooks/use-vote-passed-callback';
import { formatFloatPct } from '@vote/utils/format-float-pct';
import { votePage } from 'constants/urls';
import { VoteDescription } from '../vote-description';
import { VoteYesNoBar } from '../vote-yes-no-bar';
import { VoteMetaBar } from './vote-meta-bar';
import { EventStartVote } from 'shared/votes/utils/get-event-start-vote';
import { formatEther } from 'viem';
import { useVoteDualGovernanceStatus } from '@vote/hooks/use-vote-dual-governance-status';
import { ProposalStatus } from '@dg/proposals/types';

type Props = {
  vote: Vote;
  startEvent: EventStartVote | null;
  voteTime: number;
  objectionPhaseTime: number;
  onPass: () => void;
  executeEvent: EventExecuteVote | null;
  description: string | null;
};

export const DashboardVote = ({
  vote,
  startEvent,
  voteTime,
  objectionPhaseTime,
  onPass,
  executeEvent,
  description,
}: Props) => {
  const {
    nayPct,
    yeaPct,
    yeaNum,
    nayNum,
    nayPctOfTotalSupplyFormatted,
    yeaPctOfTotalSupplyFormatted,
    startDate,
  } = getVoteDetailsFormatted(vote);

  const { data: voteDualGovernanceStatus } = useVoteDualGovernanceStatus({
    voteId: vote.id,
    eventExecuteVote: executeEvent,
  });

  const isDualGovernancePhase =
    !!voteDualGovernanceStatus &&
    (voteDualGovernanceStatus.proposalStatus === ProposalStatus.Submitted ||
      voteDualGovernanceStatus.proposalStatus === ProposalStatus.Scheduled);

  const handlePass = useCallback(() => {
    // TODO:
    // Immediate revalidation glitches sometimes:
    // It appears accidentally when we fetch data that was changed immediately after the change. It returns it's old version from chain.
    // Small timeout is a fix for this glitch.
    // That's why there is timeout
    setTimeout(() => onPass(), 1200);
  }, [onPass]);

  useVotePassedCallback({
    startDate,
    voteTime,
    onPass: handlePass,
  });

  useVotePassedCallback({
    startDate,
    voteTime: voteTime && objectionPhaseTime && voteTime - objectionPhaseTime,
    onPass: handlePass,
  });

  const quorumPct = formatFloatPct(Number(formatEther(vote.minAcceptQuorum)));
  const yeaNumFormatted = formatVoteAmount(yeaNum);
  const nayNumFormatted = formatVoteAmount(nayNum);

  const totalSupply = Number(formatEther(vote.votingPower));
  const quorumAmount = totalSupply * Number(formatEther(vote.minAcceptQuorum));

  const { title, body } = splitVoteDescription({
    description,
    metadata: startEvent?.args.metadata,
  });

  const hasDescription = body !== null || !description?.trim();

  const isEnded =
    vote.state.status === VoteStatus.Rejected ||
    vote.state.status === VoteStatus.Executed;

  return (
    <Link passHref href={votePage(vote.id)}>
      <VoteDashboardCard data-testid={`voteCardPreview-${vote.id}`}>
        <VoteSummary>
          <VoteMetaBar
            voteId={vote.id}
            status={vote.state.status}
            isQuorumReached={vote.state.isQuorumReached}
            voteTime={voteTime}
            objectionPhaseTime={objectionPhaseTime}
            startDate={startDate}
            isEnded={isEnded}
            dualGovernancePhase={isDualGovernancePhase}
          />
          {title && <VoteTitle>{title}</VoteTitle>}
          {hasDescription && (
            <VoteDescriptionWrap data-testid="voteDescription">
              <VoteDescription
                metadata={startEvent?.args.metadata}
                description={body}
              />
            </VoteDescriptionWrap>
          )}
        </VoteSummary>
        <VoteQuorum>
          <QuorumRow>
            <QuorumLabel>
              Quorum: <QuorumValue>{quorumPct}%</QuorumValue>
            </QuorumLabel>
            {vote.state.isQuorumReached && (
              <Tooltip
                title={
                  <QuorumTooltipBody>
                    To reach quorum, more than {quorumPct}% of the total LDO
                    supply must vote for one option.
                    <QuorumTooltipRow>
                      <span>Total Supply</span>
                      <span>{formatVoteAmount(totalSupply)} LDO</span>
                    </QuorumTooltipRow>
                    <QuorumTooltipRow>
                      <span>Quorum</span>
                      <span>{formatVoteAmount(quorumAmount)} LDO</span>
                    </QuorumTooltipRow>
                  </QuorumTooltipBody>
                }
              >
                <QuorumReachedWrap>
                  <QuorumReached>Reached</QuorumReached>
                  <InfoIcon />
                </QuorumReachedWrap>
              </Tooltip>
            )}
          </QuorumRow>
          <VoteYesNoBar
            yeaPct={yeaPct}
            nayPct={nayPct}
            yeaNum={yeaNum}
            nayNum={nayNum}
            yeaPctOfTotalSupply={yeaPctOfTotalSupplyFormatted}
            nayPctOfTotalSupply={nayPctOfTotalSupplyFormatted}
            showOnForeground
          />
          <VoteTotalsRow>
            <Text size="xxs" color="secondary">
              {yeaNumFormatted}
            </Text>
            <Text size="xxs" color="secondary">
              {nayNumFormatted}
            </Text>
          </VoteTotalsRow>
        </VoteQuorum>
      </VoteDashboardCard>
    </Link>
  );
};
