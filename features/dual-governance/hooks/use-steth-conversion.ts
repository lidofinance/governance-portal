import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { StETH } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';

export const useStETHConversion = (stEthAmount: bigint) => {
  const { chainId } = useLidoSDK();
  const readStEthContract = useReadContract(StETH);

  return useQuery({
    queryKey: ['converted-steth-locked-shares', Number(stEthAmount), chainId],
    queryFn: async (): Promise<bigint> => {
      if (!readStEthContract) {
        throw new Error('readStEthContract must be defined');
      }

      if (!stEthAmount) {
        throw new Error('stEthAmount must be defined');
      }

      return await readStEthContract.readContract('getPooledEthByShares', [
        stEthAmount,
      ]);
    },
    enabled: !!readStEthContract && !!stEthAmount && stEthAmount > 0n,
  });
};
