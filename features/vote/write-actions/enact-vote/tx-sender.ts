import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { Voting } from 'shared/blockchain/contracts';

export const useEnactVoteTxSender = () => {
  const writeVotingContract = useWriteContract(Voting.abi);
  const votingContractAddress = useContractAddress(Voting);

  return useCallback(
    async (voteId: bigint) => {
      invariant(voteId, 'vote ID must be provided');

      return writeVotingContract({
        address: votingContractAddress,
        functionName: 'executeVote',
        args: [voteId],
      });
    },
    [votingContractAddress, writeVotingContract],
  );
};
