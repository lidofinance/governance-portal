import { useCallback } from 'react';
import { useSimpleReducer } from 'shared/hooks/use-simple-reducer';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { OperatorGrid } from 'shared/blockchain/contracts';

type Tier = {
  operator: string;
  shareLimit: bigint;
  liabilityShares: bigint;
  reserveRatioBP: number;
  forcedRebalanceThresholdBP: number;
  infraFeeBP: number;
  liquidityFeeBP: number;
  reservationFeeBP: number;
};
export const useOperatorGridTierMap = (totalTiersCount: number | undefined) => {
  const [tierMap, setState] = useSimpleReducer<
    Record<string, Tier | null | undefined>
  >({});
  const operatorGrid = useReadContract(OperatorGrid);

  const getOperatorGridTier = useCallback(
    async (tierId: string) => {
      const tierIdNum = parseInt(tierId);
      if (
        !totalTiersCount ||
        isNaN(tierIdNum) ||
        tierIdNum < 0 ||
        tierIdNum >= totalTiersCount
      ) {
        return null;
      }

      if (tierMap[tierIdNum] !== undefined) {
        return tierMap[tierIdNum] as Tier | null;
      }

      try {
        const tier = await operatorGrid.readContract('tier', [BigInt(tierId)]);
        setState({ [tierIdNum]: tier });
        return tier;
      } catch (error) {
        setState({ [tierIdNum]: null });
        return null;
      }
    },
    [tierMap, totalTiersCount, operatorGrid, setState],
  );

  return {
    tierMap,
    getOperatorGridTier,
  };
};
