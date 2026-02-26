import { VoterState } from 'shared/votes/types';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Voting } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { DELEGATED_VOTERS_ADDRESSES_LIMIT } from '../constants';

type Args = {
  voteId?: bigint;
};

export interface EligibleDelegator {
  address: string;
  votingPower: bigint;
  votedByDelegate: boolean;
}

// export interface EligibleDelegatorsData {
//   delegatedVotersAddresses: string[];
//   eligibleDelegatedVotingPower: bigint;
//   delegatedVotersState: VoterState[];
//   eligibleDelegatedVoters: EligibleDelegator[];
//   eligibleDelegatedVotersAddresses: string[];
// }

const processEligibleDelegators = (
  addresses: string[],
  votingPowers: bigint[],
  voterStates: VoterState[],
): {
  eligibleDelegatedVoters: EligibleDelegator[];
  eligibleDelegatedVotingPower: bigint;
} => {
  return addresses.reduce(
    (acc, address, index) => {
      const votingPower = votingPowers[index];
      const voterState = voterStates[index];

      if (
        votingPower > 0 &&
        voterState !== VoterState.Yea &&
        voterState !== VoterState.Nay
      ) {
        const delegator: EligibleDelegator = {
          address,
          votingPower,
          votedByDelegate:
            voterState === VoterState.DelegateNay ||
            voterState === VoterState.DelegateYea,
        };

        acc.eligibleDelegatedVoters.push(delegator);
        acc.eligibleDelegatedVotingPower =
          acc.eligibleDelegatedVotingPower + votingPower;
      }

      return acc;
    },
    {
      eligibleDelegatedVoters: [] as EligibleDelegator[],
      eligibleDelegatedVotingPower: 0n,
    },
  );
};

export const useEligibleDelegators = ({ voteId }: Args) => {
  const { chainId } = useLidoSDK();
  const { address: walletAddress } = useAccount();
  const voting = useReadContract(Voting);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'useEligibleDelegators',
      Number(voteId),
      chainId,
      walletAddress,
      voting.address,
    ],
    queryFn: async () => {
      invariant(walletAddress, 'Wallet address is required');
      invariant(voteId, 'voteId address is required');

      try {
        const totalCount = await voting.readContract(
          'getDelegatedVotersCount',
          [walletAddress],
        );

        if (totalCount === 0n) {
          return {
            delegatedVotersAddresses: [],
            eligibleDelegatedVotingPower: 0n,
            delegatedVotersState: [],
            eligibleDelegatedVoters: [],
            eligibleDelegatedVotersAddresses: [],
          };
        }

        const batchCount = Math.ceil(
          Number(totalCount) / DELEGATED_VOTERS_ADDRESSES_LIMIT,
        );

        const addressBatches = await Promise.all(
          Array.from({ length: batchCount }, (_, i) =>
            voting.readContract('getDelegatedVoters', [
              walletAddress,
              BigInt(i * DELEGATED_VOTERS_ADDRESSES_LIMIT),
              BigInt(DELEGATED_VOTERS_ADDRESSES_LIMIT),
            ]),
          ),
        );

        const delegatedVotersAddresses = addressBatches.flat();

        const [votingPowerBatches, voterStateBatches] = await Promise.all([
          Promise.all(
            addressBatches.map((batch) =>
              voting.readContract('getVotingPowerMultipleAtVote', [
                BigInt(voteId),
                batch,
              ]),
            ),
          ),
          Promise.all(
            addressBatches.map((batch) =>
              voting.readContract('getVoterStateMultipleAtVote', [
                BigInt(voteId),
                batch,
              ]),
            ),
          ),
        ]);

        const delegatedVotersVotingPower = votingPowerBatches.flat();
        const delegatedVotersState = voterStateBatches.flat();

        const { eligibleDelegatedVoters, eligibleDelegatedVotingPower } =
          processEligibleDelegators(
            delegatedVotersAddresses,
            delegatedVotersVotingPower,
            delegatedVotersState,
          );

        const eligibleDelegatedVotersAddresses = eligibleDelegatedVoters.map(
          ({ address }) => address,
        );

        return {
          delegatedVotersAddresses,
          eligibleDelegatedVotingPower,
          delegatedVotersState,
          eligibleDelegatedVoters,
          eligibleDelegatedVotersAddresses,
        };
      } catch (error) {
        console.error('Error in useEligibleDelegators:', error);
        throw error;
      }
    },
  });

  return {
    data: {
      delegatedVotersAddresses: data?.delegatedVotersAddresses || [],
      eligibleDelegatedVotingPower: data?.eligibleDelegatedVotingPower || 0n,
      delegatedVotersState: data?.delegatedVotersState || [],
      eligibleDelegatedVoters: data?.eligibleDelegatedVoters || [],
      eligibleDelegatedVotersAddresses:
        data?.eligibleDelegatedVotersAddresses || [],
    },
    isLoading,
    refetch,
  };
};
