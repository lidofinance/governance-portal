import { LimitsType } from './get-limits';
import { PeriodDataType } from './get-period-data';

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
  const now = Math.floor(Date.now() / 1000);
  const motionEndTimestamp = isPending
    ? now + Number(motionDuration)
    : now;

  const isEndInNextPeriod = motionEndTimestamp > periodData.periodEndTimestamp;

  return {
    motionDuration: Number(motionDuration),
    limits,
    periodData,
    isEndInNextPeriod,
  };
};
