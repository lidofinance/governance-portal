import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { StETH } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';

export const useStETHConversion = (sharesAmount: bigint) => {
  const { chainId } = useLidoSDK();
  const readStEthContract = useReadContract(StETH);

  return useQuery({
    queryKey: ['converted-steth-locked-shares', Number(sharesAmount), chainId],
    queryFn: async (): Promise<bigint> => {
      if (!readStEthContract) {
        throw new Error('readStEthContract must be defined');
      }

      if (!sharesAmount) {
        throw new Error('sharesAmount must be defined');
      }

      return await readStEthContract.readContract('getPooledEthByShares', [
        sharesAmount,
      ]);
    },
    enabled: !!readStEthContract && !!sharesAmount && sharesAmount > 0n,
  });
};
