import { formatEther } from 'viem';
import type { Motion, RawMotionSubgraph } from '../types';

export const getMotionProgress = (
  motion: Motion | RawMotionSubgraph,
  totalSupply: bigint,
) => {
  const thresholdPct = Number(motion.objectionsThreshold) / 100;
  const totalSupplyNumber = Number(formatEther(totalSupply));
  const objectionsAmount = Number(motion.objectionsAmount);
  const thresholdAmount = (totalSupplyNumber * thresholdPct) / 100;
  // if thresholdAmount is 0, use 1 to avoid division by 0
  const objectionsPct = (objectionsAmount / (thresholdAmount || 1)) * 100;

  const onlyZeros = Math.ceil(1 - Math.log10(objectionsPct));
  const objectionsPctFormatted =
    onlyZeros > 1 && onlyZeros < Infinity
      ? objectionsPct.toFixed(onlyZeros - 1)
      : Math.round(objectionsPct * 100) / 100;

  return {
    thresholdPct,
    thresholdAmount,
    objectionsPct,
    objectionsAmount,
    objectionsPctFormatted,
  };
};

export type MotionProgress = ReturnType<typeof getMotionProgress>;
