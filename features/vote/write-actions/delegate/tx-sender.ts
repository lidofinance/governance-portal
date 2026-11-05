import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { DelegationFormInput } from '@vote/types';
import { AragonVoting } from 'shared/blockchain/contracts';

export const useDelegateTxSender = () => {
  const writeVotingContract = useWriteContract(AragonVoting.abi);
  const votingContractAddress = useContractAddress(AragonVoting);

  return useCallback(
    async ({ delegateAddress }: DelegationFormInput) => {
      invariant(delegateAddress, 'delegateAddress must be presented');

      return writeVotingContract({
        address: votingContractAddress,
        functionName: 'assignDelegate',
        args: [delegateAddress],
      });
    },
    [votingContractAddress, writeVotingContract],
  );
};
