import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { AragonVoting } from 'shared/blockchain/contracts';
import { useAccount } from 'wagmi';

export const useEnactVoteTxSender = () => {
  const { isConnected } = useAccount();
  const writeVotingContract = useWriteContract(AragonVoting.abi);
  const votingContractAddress = useContractAddress(AragonVoting);

  return useCallback(
    async (voteId: bigint) => {
      invariant(isConnected, 'Wallet must be connected to proceed');
      invariant(voteId >= 0n, 'Valid vote ID is required to proceed');

      return writeVotingContract({
        address: votingContractAddress,
        functionName: 'executeVote',
        args: [voteId],
      });
    },
    [isConnected, votingContractAddress, writeVotingContract],
  );
};
