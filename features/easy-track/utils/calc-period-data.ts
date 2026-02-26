import dayjs from 'dayjs';
import { LimitsType } from './get-limits';
import { PeriodDataType } from './get-period-data';

const getNewPeriod = ({
  periodLimit,
  periodDurationMonths,
  newPeriodStartTime,
}: {
  periodLimit: string;
  periodDurationMonths: number;
  newPeriodStartTime: dayjs.Dayjs;
}): PeriodDataType => {
  return {
    alreadySpentAmount: '0',
    periodStartTimestamp: newPeriodStartTime.unix(),
    periodEndTimestamp: newPeriodStartTime
      .add(periodDurationMonths, 'M')
      .startOf('month')
      .unix(),
    spendableBalanceInPeriod: periodLimit,
  };
};

type CalcPeriodDataProps = {
  motionDuration: bigint;
  limits: LimitsType;
  periodData: PeriodDataType;
  isPending?: boolean;
};

export const calcPeriodData = ({
  motionDuration,
  limits,
  periodData,
  isPending,
}: CalcPeriodDataProps) => {
  let currentPeriodData = { ...periodData };

  const dateOfEndMotionPeriod = dayjs.unix(
    currentPeriodData.periodEndTimestamp,
  );
  const dateOfStartMotionPeriod = dayjs.unix(
    currentPeriodData.periodStartTimestamp,
  );

  const isStartInNextPeriod = dayjs().isAfter(dateOfEndMotionPeriod);

  if (isStartInNextPeriod) {
    const diffMonthCount = dayjs()
      .startOf('month')
      .diff(dateOfStartMotionPeriod.startOf('month'), 'months');

    const periodRatio = Math.floor(
      diffMonthCount / limits.periodDurationMonths,
    );

    const newPeriodStartTime = dateOfStartMotionPeriod.add(
      limits.periodDurationMonths * periodRatio,
      'M',
    );

    currentPeriodData = getNewPeriod({
      periodLimit: limits.limit,
      periodDurationMonths: limits.periodDurationMonths,
      newPeriodStartTime,
    });
  }

  const dateOfEndMotion = dayjs().add(Number(motionDuration), 'seconds');
  const periodEnd = dayjs.unix(currentPeriodData.periodEndTimestamp);

  const isEndInNextPeriod = dateOfEndMotion.isAfter(periodEnd);

  if (isEndInNextPeriod && !isPending) {
    currentPeriodData = getNewPeriod({
      periodLimit: limits.limit,
      periodDurationMonths: limits.periodDurationMonths,
      newPeriodStartTime: dayjs
        .unix(currentPeriodData.periodStartTimestamp)
        .add(limits.periodDurationMonths, 'M')
        .startOf('month'),
    });
  }

  return {
    motionDuration: Number(motionDuration),
    limits,
    periodData: currentPeriodData,
    isEndInNextPeriod,
  };
};
