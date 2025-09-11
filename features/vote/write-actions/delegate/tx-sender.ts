import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { Snapshot, Voting } from 'shared/blockchain/contracts';
import { SNAPSHOT_LIDO_SPACE_NAME } from 'features/vote/constants';
import { DelegateTxArgs } from './types';

export const useDelegateTxSender = () => {
  const writeVotingContract = useWriteContract(Voting.abi);
  const votingContractAddress = useContractAddress(Voting);

  const writeSnapshotContract = useWriteContract(Snapshot.abi);
  const snapshotContractAddress = useContractAddress(Snapshot);

  return useCallback(
    async ({ delegateAddress, type }: DelegateTxArgs) => {
      invariant(delegateAddress, 'delegateAddress must be presented');
      invariant(type === 'aragon' || type === 'snapshot', 'type must be valid');

      if (type === 'snapshot') {
        return writeSnapshotContract({
          address: snapshotContractAddress,
          functionName: 'setDelegate',
          args: [SNAPSHOT_LIDO_SPACE_NAME, delegateAddress],
        });
      }

      return writeVotingContract({
        address: votingContractAddress,
        functionName: 'assignDelegate',
        args: [delegateAddress],
      });
    },
    [
      snapshotContractAddress,
      votingContractAddress,
      writeSnapshotContract,
      writeVotingContract,
    ],
  );
};
