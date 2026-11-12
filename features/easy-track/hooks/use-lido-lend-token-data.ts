import { useQuery } from '@tanstack/react-query';
import { type Hex } from 'viem';
import { useLidoSDK } from 'providers/lido-sdk';
import { LidoLend } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useMotionTokenData } from './use-motion-token-data';

export const useLidoLendTokenData = (marketId: Hex, isCollateral?: boolean) => {
  const { chainId } = useLidoSDK();
  const lidoLend = useReadContract(LidoLend);

  const { data: marketParams, isLoading: isMarketParamsLoading } = useQuery({
    queryKey: ['lido-lend-market-params', chainId, marketId],
    staleTime: Infinity,
    queryFn: async () => {
      const params = await lidoLend.readContract('idToMarketParams', [
        marketId,
      ]);
      if (params === null) {
        throw new Error(`Failed to read params of market ${marketId}`);
      }
      return params;
    },
  });

  const tokenData = useMotionTokenData(marketParams?.[isCollateral ? 1 : 0]);

  return {
    ...tokenData,
    isLoading: isMarketParamsLoading || tokenData.isLoading,
  };
};
