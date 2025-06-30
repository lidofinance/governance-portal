import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { useReadContract } from './use-read-contract';
import { WithdrawalsMap } from 'features/dual-governance/types';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { WithdrawalQueue, WithdrawalQueueMock } from '../contracts';

/**
 *  For the Mainnet network we use the getWithdrawalRequests method directly, for the rest we have unoptimized workaround,
 *  as WithdrawalQueueMock contract doesn't have this method
 */
export const useUnstEthBalance = () => {
  const { chainId } = useLidoSDK();
  const { address: accountAddress } = useAccount();

  // Use separate contract instances with their proper types
  const isMainnet = chainId === CHAINS.Mainnet;
  const mainnetWithdrawalQueue = useReadContract(WithdrawalQueue);
  const mockWithdrawalQueue = useReadContract(WithdrawalQueueMock);

  return useQuery({
    queryKey: ['unsteth-balance', chainId, accountAddress],
    enabled: !!accountAddress,
    queryFn: async () => {
      if (!accountAddress)
        return { withdrawalRequests: {}, requestsTotalStEthAmount: 0n };

      try {
        if (isMainnet) {
          try {
            const withdrawalRequests =
              await mainnetWithdrawalQueue.readContract(
                'getWithdrawalRequests',
                [accountAddress],
              );

            const eligibleRequests: WithdrawalsMap = {};
            let requestsTotalStEthAmount = 0n;

            if (
              Array.isArray(withdrawalRequests) &&
              withdrawalRequests.length > 0
            ) {
              const requestDetails = await mainnetWithdrawalQueue.readContract(
                'getWithdrawalStatus',
                [withdrawalRequests],
              );

              if (Array.isArray(requestDetails)) {
                requestDetails.forEach((request: any, index: number) => {
                  if (request && typeof request === 'object') {
                    const { isClaimed, isFinalized, owner, amountOfStETH } =
                      request;
                    if (
                      owner.toLowerCase() === accountAddress.toLowerCase() &&
                      !isClaimed &&
                      !isFinalized
                    ) {
                      const requestId = withdrawalRequests[index];
                      eligibleRequests[requestId.toString()] = amountOfStETH;
                      requestsTotalStEthAmount += amountOfStETH;
                    }
                  }
                });
              }
            }

            return {
              withdrawalRequests: eligibleRequests,
              requestsTotalStEthAmount,
            };
          } catch (error) {
            console.error('Error using Mainnet approach:', error);
          }
        }

        const lastRequestId = Number(
          await mockWithdrawalQueue.readContract('getLastRequestId'),
        );

        if (lastRequestId === 0) {
          return { withdrawalRequests: {}, requestsTotalStEthAmount: 0n };
        }

        const requestIds = Array.from({ length: lastRequestId }, (_, i) =>
          BigInt(i + 1),
        );

        const eligibleRequests: WithdrawalsMap = {};
        let requestsTotalStEthAmount = 0n;

        const withdrawalRequests = await mockWithdrawalQueue.readContract(
          'getWithdrawalStatus',
          [requestIds],
        );

        if (Array.isArray(withdrawalRequests)) {
          withdrawalRequests.forEach((request: any, id: number) => {
            if (request && typeof request === 'object') {
              const { isClaimed, isFinalized, owner, amountOfStETH } = request;
              if (
                owner.toLowerCase() === accountAddress.toLowerCase() &&
                !isClaimed &&
                !isFinalized
              ) {
                eligibleRequests[(id + 1).toString()] = amountOfStETH;
                requestsTotalStEthAmount += amountOfStETH;
              }
            }
          });
        }

        return {
          withdrawalRequests: eligibleRequests,
          requestsTotalStEthAmount,
        };
      } catch (error) {
        console.error('Error in useUnstEthBalance:', error);
        return { withdrawalRequests: {}, requestsTotalStEthAmount: 0n };
      }
    },
  });
};
