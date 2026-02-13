import { createContext, FC, useContext, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { formatUnits, formatEther, Hex } from 'viem';
import { useQuery } from '@tanstack/react-query';

import { Motion, MotionStatus, RawMotionSubgraph } from '@easy-track/types';
import { MotionType } from '@easy-track/motion-types';
import { EvmUnrecognized } from '@easy-track/evm-addresses';
import { getMotionTypeByScriptFactory } from '@easy-track/utils/get-motion-type';
import { useMotionProgress } from '@easy-track/hooks/use-motion-progress';
import {
  useMotionTimeCountdown,
  MotionTimeData,
} from '@easy-track/hooks/use-motion-time-countdown';
import {
  usePeriodLimitsInfoByMotionType,
  UsePeriodLimitsInfoResultData,
} from '@easy-track/hooks/use-period-limits-info';
import { decodeEvmScriptCallData } from '@easy-track/hooks/use-decode-evm-script-call-data';
import { useMotionTokenData } from '@easy-track/hooks/use-motion-token-data';
import { useLidoSDK } from 'providers/lido-sdk';

const DEFAULT_DECIMALS = 18;

const getTopUpAmount = (
  callData: any,
  tokenDecimals = DEFAULT_DECIMALS,
): number => {
  if (!callData) return 0;

  if (callData[1]?.[0]?._isBigNumber) {
    return Number(formatEther(callData[1][0])) || 0;
  }

  if (Array.isArray(callData.amounts)) {
    const amountsSum = (callData.amounts as bigint[]).reduce(
      (acc, amount) => acc + amount,
    );
    return Number(formatUnits(amountsSum, tokenDecimals));
  }

  return 0;
};

type MotionDetailedContextValue = {
  motion: Motion | RawMotionSubgraph;
  motionType: MotionType | EvmUnrecognized;
  isArchived: boolean;
  callData: unknown;
  periodLimitsData: UsePeriodLimitsInfoResultData | null | undefined;
  motionTopUpAmount: number;
  motionTopUpToken: string | undefined;
  isOverPeriodLimit: boolean;
  isCanEnactInNextPeriod: boolean;
  progress: ReturnType<typeof useMotionProgress>;
  timeData: MotionTimeData;
  isPending: boolean;
};

const MotionDetailedContext = createContext<MotionDetailedContextValue | null>(
  null,
);

export const useMotionDetailed = () => {
  const value = useContext(MotionDetailedContext);
  invariant(
    value,
    'useMotionDetailed was used outside of MotionDetailedProvider',
  );
  return value;
};

type Props = {
  motion: Motion | RawMotionSubgraph;
  children: React.ReactNode;
};

export const MotionDetailedProvider: FC<Props> = ({ motion, children }) => {
  const { chainId } = useLidoSDK();

  const motionType = getMotionTypeByScriptFactory(
    chainId,
    motion.evmScriptFactory,
  );

  const isArchived =
    motion.status !== MotionStatus.ACTIVE &&
    motion.status !== MotionStatus.PENDING;

  const isPending = motion.status === MotionStatus.PENDING;

  const timeData = useMotionTimeCountdown(motion);
  const progress = useMotionProgress(motion);

  const { data: callData } = useQuery({
    queryKey: ['call-data', chainId, Number(motion.id)],
    queryFn: () =>
      decodeEvmScriptCallData(
        motionType as MotionType,
        motion.evmScriptCalldata as Hex,
      ),
    enabled: !!motion.evmScriptCalldata && motionType !== EvmUnrecognized,
  });

  const { data: tokenData } = useMotionTokenData(
    (callData as any)?.token ?? undefined,
  );

  const { data: periodLimitsData } = usePeriodLimitsInfoByMotionType({
    motionType,
    isPending,
  });

  const motionTopUpAmount = useMemo(
    () => getTopUpAmount(callData, tokenData?.decimals ?? DEFAULT_DECIMALS),
    [callData, tokenData],
  );

  const motionTopUpToken = tokenData?.label;

  const isOverPeriodLimit = useMemo(() => {
    if (!periodLimitsData) return false;
    const newSpentAmount =
      Number(periodLimitsData.periodData.alreadySpentAmount) +
      motionTopUpAmount;
    return newSpentAmount > Number(periodLimitsData.limits.limit);
  }, [periodLimitsData, motionTopUpAmount]);

  const isCanEnactInNextPeriod = useMemo(() => {
    if (!periodLimitsData) return false;
    return periodLimitsData.isEndInNextPeriod;
  }, [periodLimitsData]);

  const value: MotionDetailedContextValue = {
    motion,
    motionType,
    isArchived,
    callData,
    periodLimitsData,
    motionTopUpAmount,
    motionTopUpToken,
    isOverPeriodLimit,
    isCanEnactInNextPeriod,
    progress,
    timeData,
    isPending,
  };

  return (
    <MotionDetailedContext.Provider value={value}>
      {children}
    </MotionDetailedContext.Provider>
  );
};
