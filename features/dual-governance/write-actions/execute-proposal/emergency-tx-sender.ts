import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';

export const useEmergencyExecuteProposalTxSend = () => {
  const { chainId } = useLidoSDK();
  const writeDualGovernanceContract = useWriteContract(
    EmergencyProtectedTimelock.abi,
  );

  return useCallback(
    async (id: number) => {
      invariant(writeDualGovernanceContract, 'Contract is not found');

      return writeDualGovernanceContract({
        address: EmergencyProtectedTimelock.chainAddressMap[chainId] as Address,
        functionName: 'emergencyExecute',
        args: [BigInt(id)],
      });
    },
    [chainId, writeDualGovernanceContract],
  );
};
