import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { useReadContract } from './use-read-contract';
import { WithdrawalQueue } from '../contracts';
import { WithdrawalsMap } from 'features/dual-governance/types';

// WARNING: The current implementation of fetching user's withdrawal requests is far from optimal.
// This is becase the `getWithdrawalRequests` method is not implemented in the mocked version of the WithdrawalQueue contract.
// TODO: Use the `getWithdrawalRequests` method from the WithdrawalQueue contract.
export const useUnstEthBalance = () => {
  const { chainId } = useLidoSDK();
  const { address } = useAccount();
  const withdrawalQueue = useReadContract(WithdrawalQueue);

  return useQuery({
    queryKey: ['unsteth-balance', chainId, address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) return;

      const lastRequestId = Number(
        await withdrawalQueue.readContract('getLastRequestId'),
      );

      const requestIds = Array.from({ length: lastRequestId }, (_, i) =>
        BigInt(i + 1),
      );

      const eligibleRequests: WithdrawalsMap = {};

      const withdrawalRequests = await withdrawalQueue.readContract(
        'getWithdrawalStatus',
        [requestIds],
      );

      let requestsTotalStEthAmount = 0n;

      withdrawalRequests.forEach((request: any, id: number) => {
        const { isClaimed, isFinalized, owner, amountOfStETH } = request;
        if (owner === address && !isClaimed && !isFinalized) {
          eligibleRequests[(id + 1).toString()] = amountOfStETH;
          requestsTotalStEthAmount += amountOfStETH;
        }
      });

      return { withdrawalRequests: eligibleRequests, requestsTotalStEthAmount };
    },
  });
};
