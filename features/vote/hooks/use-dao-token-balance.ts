import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { DaoToken } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useAccount } from 'wagmi';

export const useDaoTokenBalance = () => {
  const account = useAccount();
  const { chainId } = useLidoSDK();
  const daoTokenContract = useReadContract(DaoToken);

  return useQuery({
    queryKey: ['dao-token-balance', account.address, chainId],
    staleTime: Infinity,
    enabled: !!account.address,
    queryFn: async () => {
      if (!account.address) {
        return 0n;
      }
      const balance = await daoTokenContract.readContract('balanceOf', [
        account.address,
      ]);
      return balance ?? 0n;
    },
  });
};
