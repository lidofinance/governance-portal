import { VoterState } from 'shared/votes/types';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Voting } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { DELEGATED_VOTERS_ADDRESSES_LIMIT } from '../constants';
import { Address } from 'viem';
import { EligibleDelegator, VoteMode, VoterInfo } from '../types';

const convertVoterStateToVoteMode = (
  voterState:
    | VoterState.DelegateYea
    | VoterState.DelegateNay
    | VoterState.Absent,
): VoteMode | 'absent' => {
  switch (voterState) {
    case VoterState.DelegateYea:
      return 'yay';
    case VoterState.DelegateNay:
      return 'nay';
    default:
      return 'absent';
  }
};

const processEligibleDelegators = (
  addresses: Address[],
  votingPowers: bigint[],
  voterStates: VoterState[],
): {
  eligibleDelegatedVoters: EligibleDelegator[];
  eligibleDelegatedVotingPower: bigint;
  delegatedVotersVotedThemselves: VoterInfo[];
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
          delegateVoteMode: convertVoterStateToVoteMode(voterState),
        };

        acc.eligibleDelegatedVoters.push(delegator);
        acc.eligibleDelegatedVotingPower =
          acc.eligibleDelegatedVotingPower + votingPower;
      } else if (
        voterState === VoterState.Yea ||
        voterState === VoterState.Nay
      ) {
        acc.delegatedVotersVotedThemselves.push({
          address,
          supports: voterState === VoterState.Yea,
          stake: votingPower,
        });
      }

      return acc;
    },
    {
      eligibleDelegatedVoters: [] as EligibleDelegator[],
      delegatedVotersVotedThemselves: [] as VoterInfo[],
      eligibleDelegatedVotingPower: 0n,
    },
  );
};

export const useVoteDelegators = (voteId: number | undefined) => {
  const { chainId } = useLidoSDK();
  const { address: walletAddress } = useAccount();
  const voting = useReadContract(Voting);

  return useQuery({
    queryKey: [
      'eligible-delegators',
      voteId,
      chainId,
      walletAddress,
      voting.address,
    ],
    enabled: !!walletAddress && typeof voteId === 'number',
    queryFn: async () => {
      invariant(walletAddress, 'Wallet address is required');
      invariant(typeof voteId === 'number', 'Vote ID is required');

      const totalCount = await voting.readContract('getDelegatedVotersCount', [
        walletAddress,
      ]);

      if (totalCount === 0n) {
        return {
          eligibleDelegatedVoters: [],
          eligibleDelegatedVotingPower: 0n,
          totalDelegatedVotingPower: 0n,
          delegatedVotersVotedThemselves: [],
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

      const voteIdBigInt = BigInt(voteId);

      const [votingPowerBatches, voterStateBatches] = await Promise.all([
        Promise.all(
          addressBatches.map((batch) =>
            voting.readContract('getVotingPowerMultipleAtVote', [
              voteIdBigInt,
              batch,
            ]),
          ),
        ),
        Promise.all(
          addressBatches.map((batch) =>
            voting.readContract('getVoterStateMultipleAtVote', [
              voteIdBigInt,
              batch,
            ]),
          ),
        ),
      ]);

      const delegatedVotersVotingPower = votingPowerBatches.flat();
      const delegatedVotersState = voterStateBatches.flat();

      const totalDelegatedVotingPower = delegatedVotersVotingPower.reduce(
        (acc, power) => acc + power,
        0n,
      );

      const {
        eligibleDelegatedVoters,
        eligibleDelegatedVotingPower,
        delegatedVotersVotedThemselves,
      } = processEligibleDelegators(
        delegatedVotersAddresses,
        delegatedVotersVotingPower,
        delegatedVotersState,
      );

      eligibleDelegatedVoters.sort((a, b) =>
        a.votingPower > b.votingPower
          ? -1
          : a.votingPower < b.votingPower
            ? 1
            : 0,
      );

      delegatedVotersVotedThemselves.sort((a, b) =>
        a.stake > b.stake ? -1 : a.stake < b.stake ? 1 : 0,
      );

      return {
        eligibleDelegatedVoters,
        eligibleDelegatedVotingPower,
        totalDelegatedVotingPower,
        delegatedVotersVotedThemselves,
      };
    },
  });
};
