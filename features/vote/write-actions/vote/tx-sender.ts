import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { Voting } from 'shared/blockchain/contracts';
import { VoteTxArgs } from './types';

export const useVoteTxSender = () => {
  const writeVotingContract = useWriteContract(Voting.abi);
  const votingContractAddress = useContractAddress(Voting);

  return useCallback(
    async ({ mode, voteId, delegatedVoters }: VoteTxArgs) => {
      invariant(
        voteId >= 0n,
        'Valid vote ID is required to send vote transaction',
      );

      const isSupporting = mode === 'yay';

      if (delegatedVoters?.length) {
        return writeVotingContract({
          address: votingContractAddress,
          functionName: 'attemptVoteForMultiple',
          args: [voteId, isSupporting, delegatedVoters],
        });
      }

      return writeVotingContract({
        address: votingContractAddress,
        functionName: 'vote',
        args: [voteId, isSupporting, false],
      });
    },
    [votingContractAddress, writeVotingContract],
  );
};
