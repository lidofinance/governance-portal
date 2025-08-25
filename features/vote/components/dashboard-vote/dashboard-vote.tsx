import { useCallback } from 'react';

import Link from 'next/link';
import { Text } from '@lidofinance/lido-ui';
import {
  Wrap,
  VoteBody,
  VoteTitle,
  VoteDescriptionWrap,
  VotesBarWrap,
  Footer,
  NeededToQuorum,
} from './style';
import { Vote, VotePhase, VoteStatus } from 'shared/votes/types';
import { getVoteDetailsFormatted } from 'features/vote/utils/get-vote-details-formatted';
import { useVotePassedCallback } from 'features/vote/hooks/use-vote-passed-callback';
import { formatFloatPct } from 'features/vote/utils/format-float-pct';
import { votePage } from 'constants/urls';
import { VoteStatusBanner } from '../vote-status-banner';
import { VoteDescription } from '../vote-description';
import { VoteYesNoBar } from '../vote-yes-no-bar';
import { StartVoteEventArgs } from 'shared/votes/utils/get-event-start-vote';

type Props = {
  vote: Vote;
  startEvent: StartVoteEventArgs | null;
  voteTime: number;
  objectionPhaseTime: number;
  executedAt?: number;
  onPass: () => void;
};

export const DashboardVote = ({
  vote,
  startEvent,
  voteTime,
  objectionPhaseTime,
  executedAt,
  onPass,
}: Props) => {
  const {
    nayPct,
    yeaPct,
    yeaNum,
    nayNum,
    yeaPctOfTotalSupply,
    nayPctOfTotalSupplyFormatted,
    yeaPctOfTotalSupplyFormatted,
    startDate,
    totalSupply,
  } = getVoteDetailsFormatted(vote);

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

  const neededToQuorum = Number(vote.minAcceptQuorum) - yeaPctOfTotalSupply;
  const neededToQuorumFormatted = formatFloatPct(neededToQuorum, {
    floor: true,
  }).toFixed(2);

  const isEnded =
    vote.state.status === VoteStatus.Rejected ||
    vote.state.status === VoteStatus.Executed;

  return (
    <Link passHref href={votePage(vote.id)}>
      <Wrap data-testid={`voteCardPreview-${vote.id}`}>
        <VoteStatusBanner
          executedAt={executedAt}
          voteTime={voteTime}
          objectionPhaseTime={objectionPhaseTime}
          status={vote.state.status}
          isEnded={isEnded}
          yeaNum={yeaNum}
          nayNum={nayNum}
          totalSupply={totalSupply}
          fontSize="xxs"
          minAcceptQuorum={Number(vote.minAcceptQuorum)}
          // TODO: add!!!
          voteDualGovernanceStatus={null}
        />
        <VoteBody>
          <VoteTitle>Vote #{vote.id}</VoteTitle>
          <VoteDescriptionWrap data-testid="voteDescription">
            <VoteDescription metadata={startEvent?.metadata} />
          </VoteDescriptionWrap>
        </VoteBody>
        <Footer>
          <VotesBarWrap>
            {vote.phase === VotePhase.Main && (
              <NeededToQuorum>
                <Text size="xxs" color="secondary">
                  {neededToQuorum > 0 ? 'Needed to quorum' : 'Quorum reached'}
                </Text>
                {neededToQuorum > 0 && (
                  <Text size="xxs">{neededToQuorumFormatted}%</Text>
                )}
              </NeededToQuorum>
            )}

            <VoteYesNoBar
              yeaPct={yeaPct}
              nayPct={nayPct}
              yeaNum={yeaNum}
              nayNum={nayNum}
              yeaPctOfTotalSupply={yeaPctOfTotalSupplyFormatted}
              nayPctOfTotalSupply={nayPctOfTotalSupplyFormatted}
              showOnForeground
            />
          </VotesBarWrap>
        </Footer>
      </Wrap>
    </Link>
  );
};
