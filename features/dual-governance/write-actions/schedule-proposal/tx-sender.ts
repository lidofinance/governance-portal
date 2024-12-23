import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { DualGovernance } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';

export const useScheduleProposalTxSend = () => {
  const { chainId } = useLidoSDK();
  const writeDualGovernanceContract = useWriteContract(DualGovernance.abi);

  return useCallback(
    async (id: number) => {
      invariant(writeDualGovernanceContract, 'Contract is not found');

      return writeDualGovernanceContract({
        address: DualGovernance.chainAddressMap[chainId] as Address,
        functionName: 'scheduleProposal',
        args: [BigInt(id)],
      });
    },
    [chainId, writeDualGovernanceContract],
  );
};
