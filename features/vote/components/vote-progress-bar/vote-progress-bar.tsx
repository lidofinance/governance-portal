import { Text } from '@lidofinance/lido-ui';

import {
  LabelWrap,
  MainPhaseCountWrap,
  ProgressBarWrap,
  ProgressSection,
  Wrap,
} from './style';
import { useMemo } from 'react';
import { VotePhase } from 'shared/votes/types';
import { useVoteTimeCountdown } from '../../hooks/use-vote-time-countdown';
import { VoteDetailsCountdown } from '../vote-details-countdown';
import { ProgressBar } from 'shared/components/progress-bar';

interface Props {
  startDate: number;
  voteTime: number;
  objectionPhaseTime: number;
  isEnded: boolean;
  votePhase: VotePhase;
}

const formatterOptions: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  timeZoneName: 'short',
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);

  return date.toLocaleString('en-US', formatterOptions);
};

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

  // Derive effective phase from time so the UI updates immediately at the
  // phase boundary, without waiting for a contract refetch.
  const isMainPhaseOver =
    timeDeltaMainPhase.isPassed || votePhase === VotePhase.Objection;
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

  const formattedStartDate = useMemo(() => formatDate(startDate), [startDate]);
  const formattedEndDate = useMemo(() => {
    const endDate = startDate + voteTime;
    return formatDate(endDate);
  }, [startDate, voteTime]);

  // Calculate absolute end times for countdown
  const mainPhaseEndTimestamp = startDate + (voteTime - objectionPhaseTime);
  const objectionPhaseEndTimestamp = startDate + voteTime;

  return (
    <Wrap>
      <LabelWrap>
        <MainPhaseCountWrap>
          <Text
            data-testid="voteBarMainPhase"
            color={!isMainPhaseOver ? 'primary' : 'secondary'}
            size="xxs"
          >
            Main phase{!isMainPhaseOver ? ' ends in ' : ' ended'}
          </Text>
          {!isMainPhaseOver && (
            <b>
              <VoteDetailsCountdown
                voteTime={mainPhaseEndTimestamp}
                isEndedBeforeTime={isEnded}
              />
            </b>
          )}
        </MainPhaseCountWrap>
        <Text
          data-testid="voteBarObjectionPhase"
          color={isObjectionPhaseActive ? 'primary' : 'secondary'}
          size="xxs"
        >
          {`Objection phase ${isObjectionPhaseActive ? 'ends in ' : ''}`}

          {isObjectionPhaseActive && (
            <b>
              <VoteDetailsCountdown
                voteTime={objectionPhaseEndTimestamp}
                isEndedBeforeTime={isEnded}
              />
            </b>
          )}
        </Text>
      </LabelWrap>
      <ProgressSection>
        <ProgressBarWrap $alignDescription="flex-start" $width="60%">
          <ProgressBar
            progressPercent={mainPhaseProgress}
            totalPercent={100}
            variant={mainPhaseProgress > 0 ? 'primary' : 'default'}
            showProgressInfo={false}
          />
          <div data-testid="voteStartDate"> {formattedStartDate} </div>
        </ProgressBarWrap>
        <ProgressBarWrap $alignDescription="flex-end" $width="40%">
          <ProgressBar
            progressPercent={objectionPhaseProgress}
            totalPercent={100}
            variant={objectionPhaseProgress > 0 ? 'primary' : 'default'}
            showProgressInfo={false}
          />
          <div data-testid="voteEndDate">{formattedEndDate}</div>
        </ProgressBarWrap>
      </ProgressSection>
    </Wrap>
  );
};
