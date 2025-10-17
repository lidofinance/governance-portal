import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { Snapshot, Voting } from 'shared/blockchain/contracts';
import { SNAPSHOT_LIDO_SPACE_NAME } from 'features/vote/constants';
import { DelegationType } from 'features/vote/types';

export const useRevokeDelegationTxSender = () => {
  const writeVotingContract = useWriteContract(Voting.abi);
  const votingContractAddress = useContractAddress(Voting);

  const writeSnapshotContract = useWriteContract(Snapshot.abi);
  const snapshotContractAddress = useContractAddress(Snapshot);

  return useCallback(
    async (type: DelegationType) => {
      invariant(type === 'Aragon' || type === 'Snapshot', 'type must be valid');

      if (type === 'Snapshot') {
        return writeSnapshotContract({
          address: snapshotContractAddress,
          functionName: 'clearDelegate',
          args: [SNAPSHOT_LIDO_SPACE_NAME],
        });
      }

      return writeVotingContract({
        address: votingContractAddress,
        functionName: 'unassignDelegate',
        args: [],
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
