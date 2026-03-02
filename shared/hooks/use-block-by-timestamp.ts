import { useQuery } from '@tanstack/react-query';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { usePublicClient } from 'wagmi';
import {
  calculateAverageBlockTime,
  estimateBlockRangeFromTimestamp,
} from 'utils/estimate-block-range';

const GET_LOGS_RANGE = 2499n;

export const useBlockByTimestamp = (timestamp: number, chainId: CHAINS) => {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['block-by-timestamp', timestamp, chainId],
    queryFn: async () => {
      if (!timestamp) return undefined;

      // First try Etherscan API
      try {
        const response = await fetch(
          `/api/etherscan/block-by-timestamp?timestamp=${timestamp}&chainId=${chainId}`,
        );

        if (response.ok) {
          const data = await response.json();
          if (!data.error && data.blockNumber) {
            return {
              fromBlock: BigInt(data.blockNumber) - GET_LOGS_RANGE,
              toBlock: BigInt(data.blockNumber) + GET_LOGS_RANGE,
            };
          }
        }
      } catch (error) {
        console.warn(
          'Etherscan API failed, falling back to calculation:',
          error,
        );
      }

      // Fallback to own calculation if Etherscan fails
      if (!publicClient) {
        throw new Error('Public client not available for block calculation');
      }

      try {
        const averageBlockTime = await calculateAverageBlockTime(publicClient);
        return await estimateBlockRangeFromTimestamp(
          timestamp,
          GET_LOGS_RANGE,
          averageBlockTime,
          publicClient,
        );
      } catch (error) {
        console.error('Block calculation failed:', error);
        throw new Error('Failed to get block by timestamp');
      }
    },
    enabled: !!timestamp && timestamp > 0,
    staleTime: 30000,
    retry: false,
  });
};
