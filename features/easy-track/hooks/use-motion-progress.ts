import { useMemo } from 'react';
import type { Motion } from '../types';
import { getMotionProgress } from '../utils/get-motion-progress';
import { useGovernanceTotalSupply } from 'shared/hooks/use-governance-total-supply';

export const useMotionProgress = (motion: Motion) => {
  const { data: totalSupply, isLoading: isLoadingSupply } =
    useGovernanceTotalSupply();

  return useMemo(() => {
    return !isLoadingSupply && totalSupply
      ? getMotionProgress(motion, totalSupply)
      : null;
  }, [isLoadingSupply, motion, totalSupply]);
};
