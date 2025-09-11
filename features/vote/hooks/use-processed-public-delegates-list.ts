import { PUBLIC_DELEGATES } from '../public-delegates';
import { PublicDelegate } from '../types';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Voting } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { DELEGATORS_FETCH_TOTAL } from '../constants';

export type ProcessedDelegate = PublicDelegate & {
  delegatorsCount: bigint;
  delegatedVotingPower: bigint;
};

export const useProcessedPublicDelegatesList = () => {
  const { chainId } = useLidoSDK();
  const votingContract = useReadContract(Voting);

  return useQuery({
    queryKey: [
      'use-processed-public-delegates-list',
      chainId,
      votingContract.address,
    ],
    queryFn: async () => {
      const parsedList: ProcessedDelegate[] = await Promise.all(
        PUBLIC_DELEGATES.map(async (delegate) => {
          const delegatorsCount = await votingContract.readContract(
            'getDelegatedVotersCount',
            [delegate.address],
          );

          if (delegatorsCount === 0n) {
            return {
              ...delegate,
              delegatorsCount: 0n,
              delegatedVotingPower: 0n,
            };
          }

          const delegatorsAddresses = await votingContract.readContract(
            'getDelegatedVoters',
            [delegate.address, 0n, BigInt(DELEGATORS_FETCH_TOTAL)],
          );

          const delegatorsBalances = await votingContract.readContract(
            'getVotingPowerMultiple',
            [delegatorsAddresses],
          );

          const delegatedVotingPower = delegatorsBalances.reduce(
            (acc, balance) => acc + balance,
            0n,
          );

          return {
            ...delegate,
            delegatorsCount,
            delegatedVotingPower,
          };
        }),
      );

      return parsedList.sort((a, b) => {
        if (a.delegatedVotingPower < b.delegatedVotingPower) {
          return 1;
        }
        if (a.delegatedVotingPower > b.delegatedVotingPower) {
          return -1;
        }

        return a.name.localeCompare(b.name);
      });
    },
  });
};
