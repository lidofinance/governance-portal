import { createContext, FC, useContext } from 'react';
import invariant from 'tiny-invariant';
import { Hex } from 'viem';

import { Motion, MotionStatus, RawMotionSubgraph } from '@easy-track/types';
import { MotionType } from '@easy-track/motion-types';
import { EvmUnrecognized } from '@easy-track/evm-addresses';
import { getMotionTypeByScriptFactory } from '@easy-track/utils/get-motion-type';
import { useMotionProgress } from '@easy-track/hooks/use-motion-progress';
import {
  useMotionTimeCountdown,
  MotionTimeData,
} from '@easy-track/hooks/use-motion-time-countdown';
import { UsePeriodLimitsInfoResultData } from '@easy-track/hooks/use-period-limits-info';
import { useMotionCallData } from '@easy-track/hooks/use-motion-call-data';
import { useMotionLimitStatus } from '@easy-track/hooks/use-motion-limit-status';
import { useMotionActions } from '@easy-track/hooks/use-motion-actions';
import { useLidoSDK } from 'providers/lido-sdk';

type MotionsContextValue = {
  motion: Motion | RawMotionSubgraph;
  motionType: MotionType | EvmUnrecognized;
  isArchived: boolean;
  callData: unknown;
  periodLimitsData: UsePeriodLimitsInfoResultData | null | undefined;
  motionTopUpAmount: number;
  motionTopUpToken: string | undefined;
  isOverPeriodLimit: boolean;
  canEnactInNextPeriod: boolean;
  progress: ReturnType<typeof useMotionProgress>;
  timeData: MotionTimeData;
  isPending: boolean;
  handleObject: (motionId: bigint) => Promise<void>;
  handleEnact: (motionId: bigint, calldata: Hex) => Promise<void>;
  handleCancel: (motionId: bigint) => Promise<void>;
};

const MotionsContext = createContext<MotionsContextValue | null>(null);

export const useMotions = () => {
  const value = useContext(MotionsContext);
  invariant(value, 'useMotions was used outside of MotionsProvider');
  return value;
};

type Props = {
  motion: Motion | RawMotionSubgraph;
  children: React.ReactNode;
};

export const MotionsProvider: FC<Props> = ({ motion, children }) => {
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

  const { callData, motionTopUpAmount, motionTopUpToken } = useMotionCallData(
    motion,
    motionType,
  );

  const { periodLimitsData, isOverPeriodLimit, canEnactInNextPeriod } =
    useMotionLimitStatus({ motionType, isPending, motionTopUpAmount });

  const { handleObject, handleEnact, handleCancel } = useMotionActions();

  const value: MotionsContextValue = {
    motion,
    motionType,
    isArchived,
    callData,
    periodLimitsData,
    motionTopUpAmount,
    motionTopUpToken,
    isOverPeriodLimit,
    canEnactInNextPeriod,
    progress,
    timeData,
    isPending,
    handleObject,
    handleEnact,
    handleCancel,
  };

  return (
    <MotionsContext.Provider value={value}>{children}</MotionsContext.Provider>
  );
};
