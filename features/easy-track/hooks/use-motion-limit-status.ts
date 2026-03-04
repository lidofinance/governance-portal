import { useMemo } from 'react';
import { MotionType } from '@easy-track/motion-types';
import { EvmUnrecognized } from '@easy-track/evm-addresses';
import {
  usePeriodLimitsInfoByMotionType,
  UsePeriodLimitsInfoResultData,
} from '@easy-track/hooks/use-period-limits-info';

type Props = {
  motionType: MotionType | EvmUnrecognized;
  isPending: boolean;
  motionTopUpAmount: number;
};

type Result = {
  periodLimitsData: UsePeriodLimitsInfoResultData | null | undefined;
  isOverPeriodLimit: boolean;
  isCanEnactInNextPeriod: boolean;
};

export const useMotionLimitStatus = ({
  motionType,
  isPending,
  motionTopUpAmount,
}: Props): Result => {
  const { data: periodLimitsData } = usePeriodLimitsInfoByMotionType({
    motionType,
    isPending,
  });

  const isOverPeriodLimit = useMemo(() => {
    if (!periodLimitsData) return false;
    const newSpentAmount =
      Number(periodLimitsData.periodData.alreadySpentAmount) +
      motionTopUpAmount;
    return newSpentAmount > Number(periodLimitsData.limits.limit);
  }, [periodLimitsData, motionTopUpAmount]);

  const isCanEnactInNextPeriod = periodLimitsData?.isEndInNextPeriod ?? false;

  return { periodLimitsData, isOverPeriodLimit, isCanEnactInNextPeriod };
};
