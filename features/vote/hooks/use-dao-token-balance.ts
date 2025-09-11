import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { DaoToken } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { getDaoTokenMetadata } from 'shared/blockchain/utils/get-dao-token-metadata';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';

export const useDaoTokenBalance = () => {
  const account = useAccount();
  const { chainId } = useLidoSDK();
  const daoTokenContract = useReadContract(DaoToken);

  return useQuery({
    queryKey: ['dao-token-info', account.address, chainId],
    staleTime: Infinity,
    enabled: !!account.address,
    queryFn: async () => {
      if (!account.address) {
        return 0;
      }
      const daoTokenMetadata = getDaoTokenMetadata(chainId);
      const balance = await daoTokenContract.readContract('balanceOf', [
        account.address,
      ]);
      return Number(formatUnits(balance, daoTokenMetadata.decimals));
    },
  });
};
