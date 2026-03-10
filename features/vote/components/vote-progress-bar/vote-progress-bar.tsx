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

  const mainPhaseProgress = useMemo(() => {
    if (
      votePhase === VotePhase.Objection ||
      votePhase === VotePhase.Closed ||
      isEnded
    ) {
      return 100;
    }

    if (votePhase === VotePhase.Main) {
      const mainPhaseDuration = voteTime - objectionPhaseTime;
      const _progress =
        100 - (timeDeltaMainPhase.diff / mainPhaseDuration) * 100;
      return Math.max(0, Math.min(_progress, 100));
    }

    return 0;
  }, [
    votePhase,
    timeDeltaMainPhase.diff,
    voteTime,
    objectionPhaseTime,
    isEnded,
  ]);

  const objectionPhaseProgress = useMemo(() => {
    if (votePhase === VotePhase.Closed || isEnded) {
      return 100;
    }

    if (votePhase === VotePhase.Objection) {
      const _progress =
        100 - (timeDeltaObjectionPhase.diff / objectionPhaseTime) * 100;
      return Math.max(0, Math.min(_progress, 100));
    }

    return 0;
  }, [votePhase, timeDeltaObjectionPhase.diff, objectionPhaseTime, isEnded]);

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
            color={votePhase === VotePhase.Main ? 'primary' : 'secondary'}
            size="xxs"
          >
            Main phase{votePhase === VotePhase.Main ? ' ends in ' : ' ended'}
          </Text>
          {votePhase === VotePhase.Main && (
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
          color={votePhase === VotePhase.Objection ? 'primary' : 'secondary'}
          size="xxs"
        >
          {`Objection phase ${
            votePhase === VotePhase.Objection ? 'ends in ' : ''
          }`}

          {votePhase === VotePhase.Objection && (
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
