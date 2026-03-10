import { createContext, FC, useContext, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { Hex } from 'viem';

import { Motion, MotionStatus, RawMotionSubgraph } from '@easy-track/types';
import { MotionType } from '@easy-track/motion-types';
import { EvmUnrecognized } from '@easy-track/evm-addresses';
import { getMotionTypeByScriptFactory } from '@easy-track/utils/get-motion-type';
import { getIsMotionArchived } from '@easy-track/utils/get-motion-status';
import { useMotionProgress } from '@easy-track/hooks/use-motion-progress';
import { UsePeriodLimitsInfoResultData } from '@easy-track/hooks/use-period-limits-info';
import { useMotionCallData } from '@easy-track/hooks/use-motion-call-data';
import { useMotionLimitStatus } from '@easy-track/hooks/use-motion-limit-status';
import { useObjectMotionAction } from '@easy-track/write-actions/object-motion/action';
import { useEnactMotionAction } from '@easy-track/write-actions/enact-motion/action';
import { useCancelMotionAction } from '@easy-track/write-actions/cancel-motion/action';
import { useLidoSDK } from 'providers/lido-sdk';

type MotionContextValue = {
  motion: Motion | RawMotionSubgraph;
  motionType: MotionType | EvmUnrecognized;
  isArchived: boolean;
  periodLimitsData: UsePeriodLimitsInfoResultData | null | undefined;
  motionTopUpAmount: number;
  motionTopUpToken: string | undefined;
  isOverPeriodLimit: boolean;
  canEnactInNextPeriod: boolean;
  progress: ReturnType<typeof useMotionProgress>;
  handleObject: (motionId: bigint) => Promise<void>;
  handleEnact: (motionId: bigint, calldata: Hex) => Promise<void>;
  handleCancel: (motionId: bigint) => Promise<void>;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export const useMotionContext = () => {
  const value = useContext(MotionContext);
  invariant(value, 'useMotionContext was used outside of MotionsProvider');
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

  const isArchived = getIsMotionArchived(motion);

  const isPending = motion.status === MotionStatus.PENDING;

  const progress = useMotionProgress(motion);

  const { motionTopUpAmount, motionTopUpToken } = useMotionCallData(
    motion,
    motionType,
  );

  const { periodLimitsData, isOverPeriodLimit, canEnactInNextPeriod } =
    useMotionLimitStatus({ motionType, isPending, motionTopUpAmount });

  const handleObject = useObjectMotionAction();
  const handleEnact = useEnactMotionAction();
  const handleCancel = useCancelMotionAction();

  const value: MotionContextValue = useMemo(
    () => ({
      motion,
      motionType,
      isArchived,
      periodLimitsData,
      motionTopUpAmount,
      motionTopUpToken,
      isOverPeriodLimit,
      canEnactInNextPeriod,
      progress,
      handleObject,
      handleEnact,
      handleCancel,
    }),
    [
      canEnactInNextPeriod,
      handleCancel,
      handleEnact,
      handleObject,
      isArchived,
      isOverPeriodLimit,
      motion,
      motionTopUpAmount,
      motionTopUpToken,
      motionType,
      periodLimitsData,
      progress,
    ],
  );

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
};
