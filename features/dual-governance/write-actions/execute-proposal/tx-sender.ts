import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { CHAINS } from '@lido-sdk/constants';

export const useExecuteProposalTxSend = () => {
  const { chainId } = useLidoSDK();
  const writeDualGovernanceContract = useWriteContract(
    EmergencyProtectedTimelock.abi,
  );

  return useCallback(
    async (id: number) => {
      invariant(writeDualGovernanceContract, 'Contract is not found');

      return writeDualGovernanceContract({
        address: EmergencyProtectedTimelock.chainAddressMap[
          chainId as unknown as CHAINS
        ] as Address,
        functionName: 'execute',
        args: [BigInt(id)],
      });
    },
    [chainId, writeDualGovernanceContract],
  );
};
