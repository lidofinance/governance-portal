import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { useReadContract } from '../blockchain/hooks/use-read-contract';
import { useQuery } from '@tanstack/react-query';
import { DaoToken } from '../blockchain/contracts';

export const useGovernanceToken = () => {
  const { chainId } = useLidoSDK();
  const { address: accountAddress } = useAccount();
  const governanceTokenContract = useReadContract(DaoToken);

  return useQuery({
    queryKey: ['governance-token', chainId],
    queryFn: async () => {
      let balance = 0n;
      if (accountAddress) {
        try {
          balance = await governanceTokenContract.readContract('balanceOf', [
            accountAddress,
          ]);
        } catch (error) {
          console.error(
            error,
            `Unable to fetch token balance for: ${accountAddress}`,
          );
        }
      }
      const symbol = await governanceTokenContract.readContract('symbol');
      return { balance, symbol };
    },
  });
};
