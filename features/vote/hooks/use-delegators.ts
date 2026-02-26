import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { Voting } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useAccount } from 'wagmi';
import { DELEGATORS_FETCH_SIZE, DELEGATORS_FETCH_TOTAL } from '../constants';
import { Address } from 'viem';

type DelegatorData = {
  address: Address;
  balance: bigint;
  ensName?: string | null;
};

type DelegatorsData = {
  nonZeroDelegators: DelegatorData[];
  totalVotingPower: bigint;
  notFetchedDelegatorsCount: number;
};

/*
  A data hook to fetch first N delegators of the current wallet address.
  Returns up to DELEGATORS_FETCH_TOTAL delegators with their voting power.
  The list contains only delegators with voting power greater than 0.
*/
export const useDelegators = () => {
  const { address } = useAccount();
  const { chainId } = useLidoSDK();
  const votingContract = useReadContract(Voting);
  // TODO: add ENS support
  // const { lookupAddress } = useEnsResolvers();

  const { data, isLoading, error } = useQuery<DelegatorsData | undefined>({
    queryKey: [`use-delegators`, chainId, address, votingContract.address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) {
        return;
      }
      const totalDelegatorsCount = await votingContract.readContract(
        'getDelegatedVotersCount',
        [address],
      );

      const totalCountNum = Number(totalDelegatorsCount);

      if (totalDelegatorsCount === 0n) {
        return {
          nonZeroDelegators: [] as DelegatorData[],
          totalVotingPower: 0n,
          notFetchedDelegatorsCount: 0,
        };
      }

      const fetchLimit = Math.min(totalCountNum, DELEGATORS_FETCH_TOTAL);
      const fetchCount = Math.ceil(fetchLimit / DELEGATORS_FETCH_SIZE);
      const fetchNumbers = Array.from({ length: fetchCount }).fill(0);

      const delegators: DelegatorData[] = [];
      let totalVotingPower = 0n;

      await Promise.all(
        fetchNumbers.map(async (_, fetchIndex) => {
          const delegatorsAtPage = await votingContract.readContract(
            'getDelegatedVoters',
            [
              address,
              BigInt(fetchIndex * DELEGATORS_FETCH_SIZE),
              BigInt(DELEGATORS_FETCH_SIZE),
            ],
          );

          if (delegatorsAtPage.length === 0) {
            return;
          }

          const delegatorsAtPageBalances = await votingContract.readContract(
            'getVotingPowerMultiple',
            [delegatorsAtPage],
          );

          delegatorsAtPage.forEach((delegator, index) => {
            delegators.push({
              address: delegator,
              balance: delegatorsAtPageBalances[index],
            });
            totalVotingPower =
              totalVotingPower + delegatorsAtPageBalances[index];
          });
        }),
      );

      const nonZeroDelegators = delegators.filter(
        (delegator) => delegator.balance > 0n,
      );

      // const nonZeroDelegatorsWithEns = await Promise.all(
      //   nonZeroDelegators.map(async (delegator) => {
      //     try {
      //       const ensName = await lookupAddress(delegator.address);

      //       return {
      //         ...delegator,
      //         ensName,
      //       };
      //     } catch (err) {
      //       return delegator;
      //     }
      //   }),
      // );

      return {
        nonZeroDelegators,
        totalVotingPower,
        notFetchedDelegatorsCount: totalCountNum - delegators.length,
      };
    },
  });

  return {
    data: {
      nonZeroDelegators: data?.nonZeroDelegators ?? [],
      totalVotingPower: data?.totalVotingPower ?? 0n,
      notFetchedDelegatorsCount: data?.notFetchedDelegatorsCount ?? 0,
    },
    isLoading,
    error,
  };
};
