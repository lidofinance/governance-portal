import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { useReadContract } from './use-read-contract';
import { WithdrawalQueue } from '../contracts';
import { WithdrawalsMap } from 'features/dual-governance/types';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

/**
 *  For the Mainnet network we use the getWithdrawalRequests method directly, for the rest we have unoptimized workaround,
 *  as WithdrawalQueueMock contract doesnt' have this method
 */
export const useUnstEthBalance = () => {
  const { chainId } = useLidoSDK();
  const { address: accountAddress } = useAccount();
  const withdrawalQueue = useReadContract(WithdrawalQueue);

  return useQuery({
    queryKey: ['unsteth-balance', chainId, accountAddress],
    enabled: !!accountAddress,
    queryFn: async () => {
      if (!accountAddress)
        return { withdrawalRequests: {}, requestsTotalStEthAmount: 0n };

      try {
        if (chainId === CHAINS.Mainnet) {
          try {
            const withdrawalRequests = await withdrawalQueue.readContract(
              'getWithdrawalRequests' as any,
              [accountAddress],
            );

            const eligibleRequests: WithdrawalsMap = {};
            let requestsTotalStEthAmount = 0n;

            if (
              Array.isArray(withdrawalRequests) &&
              withdrawalRequests.length > 0
            ) {
              withdrawalRequests.forEach((requestId: any) => {
                if (requestId && typeof requestId === 'bigint') {
                  eligibleRequests[requestId.toString()] = 0n;
                }
              });

              const requestDetails = await withdrawalQueue.readContract(
                'getWithdrawalStatus',
                [withdrawalRequests],
              );

              if (Array.isArray(requestDetails)) {
                requestDetails.forEach((request: any, index: number) => {
                  if (request && typeof request === 'object') {
                    const { amountOfStETH } = request;
                    const requestId = withdrawalRequests[index];
                    eligibleRequests[requestId.toString()] = amountOfStETH;
                    requestsTotalStEthAmount += amountOfStETH;
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
          await withdrawalQueue.readContract('getLastRequestId'),
        );

        if (lastRequestId === 0) {
          return { withdrawalRequests: {}, requestsTotalStEthAmount: 0n };
        }

        const requestIds = Array.from({ length: lastRequestId }, (_, i) =>
          BigInt(i + 1),
        );

        const eligibleRequests: WithdrawalsMap = {};
        let requestsTotalStEthAmount = 0n;

        const withdrawalRequests = await withdrawalQueue.readContract(
          'getWithdrawalStatus',
          [requestIds],
        );

        if (Array.isArray(withdrawalRequests)) {
          withdrawalRequests.forEach((request: any, id: number) => {
            if (request && typeof request === 'object') {
              const { isClaimed, isFinalized, owner, amountOfStETH } = request;
              if (owner === accountAddress && !isClaimed && !isFinalized) {
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
