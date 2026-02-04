import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { StETH } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { parseEther } from 'viem';

export const useShareRate = (isEnabled = true) => {
  const { chainId } = useLidoSDK();
  const stEthContract = useReadContract(StETH);
  return useQuery({
    queryKey: ['share-limit-rate', chainId],
    queryFn: async () => {
      if (!isEnabled || !stEthContract) {
        return;
      }

      return await stEthContract.readContract('getPooledEthByShares', [
        parseEther('1'),
      ]);
    },
  });
};
