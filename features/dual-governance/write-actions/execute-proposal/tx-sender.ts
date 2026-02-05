import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';

export const useExecuteProposalTxSend = () => {
  const writeDualGovernanceContract = useWriteContract(
    EmergencyProtectedTimelock.abi,
  );

  const emergencyProtectedTimelockAddress = useContractAddress(
    EmergencyProtectedTimelock,
  );

  return useCallback(
    async (id: number) => {
      invariant(writeDualGovernanceContract, 'Contract is not found');

      return writeDualGovernanceContract({
        address: emergencyProtectedTimelockAddress,
        functionName: 'execute',
        args: [BigInt(id)],
      });
    },
    [emergencyProtectedTimelockAddress, writeDualGovernanceContract],
  );
};
