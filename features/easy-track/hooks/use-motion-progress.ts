import { useMemo } from 'react';
import type { Motion, RawMotionSubgraph } from '../types';
import { getMotionProgress } from '../utils/get-motion-progress';
import { useGovernanceTotalSupply } from 'shared/hooks/use-governance-total-supply';

export const useMotionProgress = (
  motion: Motion | RawMotionSubgraph | null,
) => {
  const { data: totalSupply, isLoading: isLoadingSupply } =
    useGovernanceTotalSupply();

  return useMemo(() => {
    if (!motion || isLoadingSupply || !totalSupply) {
      return null;
    }
    return getMotionProgress(motion, totalSupply);
  }, [motion, isLoadingSupply, totalSupply]);
};
