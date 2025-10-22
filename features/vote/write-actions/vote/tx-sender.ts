import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { Voting } from 'shared/blockchain/contracts';
import { ProcessVoteDelegatedTxArgs, ProcessVoteTxArgs } from './types';

export const useVoteTxSender = () => {
  const writeVotingContract = useWriteContract(Voting.abi);
  const votingContractAddress = useContractAddress(Voting);

  const voteOwnTxSender = useCallback(
    async ({ mode, voteId }: ProcessVoteTxArgs) => {
      invariant(mode, 'vote mode must be provided');
      invariant(voteId, 'vote ID must be provided');

      return writeVotingContract({
        address: votingContractAddress,
        functionName: 'vote',
        args: [voteId, mode === 'yay', false],
      });
    },
    [votingContractAddress, writeVotingContract],
  );

  const voteDelegatedTxSender = useCallback(
    ({ mode, voteId, voters }: ProcessVoteDelegatedTxArgs) => {
      invariant(mode, 'vote mode must be provided');
      invariant(voteId, 'vote ID must be provided');
      invariant(voters.length, 'voters list cannot be empty');

      return writeVotingContract({
        address: votingContractAddress,
        functionName: 'attemptVoteForMultiple',
        args: [voteId, mode === 'yay', voters],
      });
    },

    [votingContractAddress, writeVotingContract],
  );

  return { voteOwnTxSender, voteDelegatedTxSender };
};
