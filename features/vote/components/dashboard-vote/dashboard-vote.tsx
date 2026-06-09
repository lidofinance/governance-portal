import { useCallback } from 'react';

import Link from 'next/link';
import {
  VoteDashboardCard,
  VoteTitle,
  VoteDescriptionWrap,
  VoteSummary,
  VoteQuorum,
} from './style';
import { splitVoteDescription } from '@vote/utils/split-vote-description';
import { EventExecuteVote, Vote, VoteStatus } from 'shared/votes/types';
import { getVoteDetailsFormatted } from '@vote/utils/get-vote-details-formatted';
import { useVotePassedCallback } from '@vote/hooks/use-vote-passed-callback';
import { votePage } from 'constants/urls';
import { VoteDescription } from '../vote-description';
import { VoteQuorumPanel } from '../vote-quorum-panel';
import { VoteMetaBar } from '../vote-meta-bar';
import { EventStartVote } from 'shared/votes/utils/get-event-start-vote';
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
  returnQuery: string;
};

export const DashboardVote = ({
  vote,
  startEvent,
  voteTime,
  objectionPhaseTime,
  onPass,
  executeEvent,
  description,
  returnQuery,
}: Props) => {
  const { startDate } = getVoteDetailsFormatted(vote);

  const { data: voteDualGovernanceStatus } = useVoteDualGovernanceStatus({
    voteId: vote.id,
    eventExecuteVote: executeEvent,
  isEventExecuteLoading: false,
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

  const { title: splitTitle, body: splitBody } = splitVoteDescription({
    description,
    metadata: startEvent?.args.metadata,
  });

  const trimmedDescription = description?.trim() || null;
  const hasCleanSplit = splitTitle !== null && splitBody !== null;

  const title = trimmedDescription
    ? hasCleanSplit
      ? splitTitle
      : 'Proposal'
    : splitTitle;

  const body = trimmedDescription
    ? hasCleanSplit
      ? splitBody
      : trimmedDescription
    : null;

  const hasDescription = body !== null || !trimmedDescription;

  const isEnded =
    vote.state.status === VoteStatus.Rejected ||
    vote.state.status === VoteStatus.Executed;

  return (
    <Link
      passHref
      href={{
        pathname: votePage(vote.id),
        query: returnQuery.trim() ? { q: returnQuery.trim() } : undefined,
      }}
    >
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
          <VoteQuorumPanel vote={vote} />
        </VoteQuorum>
      </VoteDashboardCard>
    </Link>
  );
};
