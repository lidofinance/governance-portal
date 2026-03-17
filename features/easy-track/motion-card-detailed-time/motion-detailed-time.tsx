import { Wrap, Title, Value, Subvalue } from './style';
import { MotionDisplayStatus, MotionStatus, RawMotionSubgraph } from '../types';
import { MotionTimeData } from '../hooks/use-motion-time-countdown';
import { FormattedDate } from '../../vote/components/formatted-date';

type Props = {
  motion: RawMotionSubgraph;
  timeData: MotionTimeData;
  displayStatus: MotionDisplayStatus;
  isArchived: boolean;
};

export const MotionDetailedTime = ({
  motion,
  timeData,
  displayStatus,
  isArchived,
}: Props) => {
  const { isPassed, diffFormatted } = timeData;

  if (isArchived) {
    let title = 'Ended at:';
    let date = motion.startDate + motion.duration;
    if (motion.status === MotionStatus.ENACTED) {
      title = 'Enacted at:';
      date = motion.enacted_at || '';
    } else if (motion.status === MotionStatus.CANCELED) {
      title = 'Canceled at:';
      date = motion.canceled_at || '';
    } else if (motion.status === MotionStatus.REJECTED) {
      title = 'Rejected at:';
      date = motion.rejected_at || '';
    }
    return (
      <Wrap $displayStatus={displayStatus}>
        <Title>{title}</Title>
        <Value>
          <FormattedDate format="MMM DD, YYYY" date={Number(date)} />
        </Value>
        <Subvalue>
          <FormattedDate format="hh:mm a" date={Number(date)} />
        </Subvalue>
      </Wrap>
    );
  }

  if (isPassed) {
    return (
      <Wrap $displayStatus={displayStatus}>
        <Title>Time left:</Title>
        <Value>—</Value>
      </Wrap>
    );
  }

  return (
    <Wrap $displayStatus={displayStatus}>
      <Title>Time left:</Title>
      <Value>{diffFormatted}</Value>
    </Wrap>
  );
};
