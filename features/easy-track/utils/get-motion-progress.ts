import { formatEther } from 'viem';
import type { Motion, RawMotionSubgraph } from '../types';

export const getMotionProgress = (
  motion: Motion | RawMotionSubgraph,
  totalSupply: bigint,
) => {
  const thresholdPct = Number(motion.objectionsThreshold) / 100;
  const totalSupplyNumber = Number(formatEther(totalSupply));
  const objectionsAmount = Number(formatEther(BigInt(motion.objectionsAmount)));
  const thresholdAmount = (totalSupplyNumber * thresholdPct) / 100;
  // if thresholdAmount is 0, use 1 to avoid division by 0
  const objectionsPct = (objectionsAmount / (thresholdAmount || 1)) * 100;

  const objectionsAmountFormatted =
    objectionsAmount > 0 && objectionsAmount < 0.01
      ? '<0.01'
      : (Math.round(objectionsAmount * 100) / 100).toLocaleString('en-EN');

  const objectionsPctFormatted =
    objectionsPct > 0 && objectionsPct < 0.01
      ? '<0.01'
      : Math.round(objectionsPct * 100) / 100;

  return {
    thresholdPct,
    thresholdAmount,
    objectionsPct,
    objectionsAmount,
    objectionsAmountFormatted,
    objectionsPctFormatted,
  };
};

export type MotionProgress = ReturnType<typeof getMotionProgress>;
