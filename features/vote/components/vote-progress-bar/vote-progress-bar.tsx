import { Text } from '@lidofinance/lido-ui';

import {
  BarSlot,
  CountdownRow,
  CountdownValue,
  LabelWrap,
  ProgressSection,
  Wrap,
} from './style';
import { useMemo } from 'react';
import { VotePhase } from 'shared/votes/types';
import { useVoteTimeCountdown } from '@vote/hooks/use-vote-time-countdown';
import { VoteDetailsCountdown } from '../vote-details-countdown';
import { ProgressBar } from 'shared/components/progress-bar';

interface Props {
  startDate: number;
  voteTime: number;
  objectionPhaseTime: number;
  isEnded: boolean;
  votePhase: VotePhase;
}

export const VoteProgressBar = ({
  startDate,
  voteTime,
  objectionPhaseTime,
  isEnded,
  votePhase,
}: Props) => {
  const mainPhaseEndTime = startDate + (voteTime - objectionPhaseTime);

  const timeDeltaMainPhase = useVoteTimeCountdown(
    startDate,
    voteTime - objectionPhaseTime,
  );

  const timeDeltaObjectionPhase = useVoteTimeCountdown(
    mainPhaseEndTime,
    objectionPhaseTime,
  );

  const isMainPhaseOver =
    timeDeltaMainPhase.isPassed || votePhase === VotePhase.Objection;
  const isMainActive = !isMainPhaseOver && !isEnded;
  const isObjectionPhaseActive =
    isMainPhaseOver && !isEnded && !timeDeltaObjectionPhase.isPassed;

  const mainPhaseProgress = useMemo(() => {
    if (isMainPhaseOver || isEnded) {
      return 100;
    }

    const mainPhaseDuration = voteTime - objectionPhaseTime;
    const _progress = 100 - (timeDeltaMainPhase.diff / mainPhaseDuration) * 100;
    return Math.max(0, Math.min(_progress, 100));
  }, [
    isMainPhaseOver,
    timeDeltaMainPhase.diff,
    voteTime,
    objectionPhaseTime,
    isEnded,
  ]);

  const objectionPhaseProgress = useMemo(() => {
    if (votePhase === VotePhase.Closed || isEnded) {
      return 100;
    }

    if (isObjectionPhaseActive) {
      const _progress =
        100 - (timeDeltaObjectionPhase.diff / objectionPhaseTime) * 100;
      return Math.max(0, Math.min(_progress, 100));
    }

    if (timeDeltaObjectionPhase.isPassed) {
      return 100;
    }

    return 0;
  }, [
    votePhase,
    isObjectionPhaseActive,
    timeDeltaObjectionPhase.diff,
    timeDeltaObjectionPhase.isPassed,
    objectionPhaseTime,
    isEnded,
  ]);

  const mainPhaseEndTimestamp = startDate + (voteTime - objectionPhaseTime);
  const objectionPhaseEndTimestamp = startDate + voteTime;
  const activeEndTimestamp = isMainActive
    ? mainPhaseEndTimestamp
    : objectionPhaseEndTimestamp;
  const hasActiveCountdown = isMainActive || isObjectionPhaseActive;

  return (
    <Wrap>
      <LabelWrap>
        <Text
          data-testid="voteBarMainPhase"
          size={isMainActive ? 'xs' : 'xxs'}
          weight={isMainActive ? 700 : 400}
          color={isMainActive ? 'default' : 'secondary'}
        >
          Main phase
        </Text>
        <Text
          data-testid="voteBarObjectionPhase"
          size={isObjectionPhaseActive ? 'xs' : 'xxs'}
          weight={isObjectionPhaseActive ? 700 : 400}
          color={isObjectionPhaseActive ? 'default' : 'secondary'}
        >
          Objection phase
        </Text>
      </LabelWrap>
      <ProgressSection>
        <BarSlot
          $grow={isObjectionPhaseActive ? 30 : 70}
          $active={isMainActive}
        >
          <ProgressBar
            progressPercent={mainPhaseProgress}
            totalPercent={100}
            variant={mainPhaseProgress > 0 ? 'primary' : 'default'}
            showProgressInfo={false}
          />
        </BarSlot>
        <BarSlot
          $grow={isObjectionPhaseActive ? 70 : 30}
          $active={isObjectionPhaseActive}
        >
          <ProgressBar
            progressPercent={objectionPhaseProgress}
            totalPercent={100}
            variant={objectionPhaseProgress > 0 ? 'primary' : 'default'}
            showProgressInfo={false}
          />
        </BarSlot>
      </ProgressSection>
      {hasActiveCountdown && (
        <CountdownRow>
          Ends in{' '}
          <CountdownValue>
            <VoteDetailsCountdown
              voteTime={activeEndTimestamp}
              isEndedBeforeTime={isEnded}
            />
          </CountdownValue>
        </CountdownRow>
      )}
    </Wrap>
  );
};
