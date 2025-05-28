import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { DualGovernance } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { useDynamicDualGovernance } from '../../hooks/use-dynamic-dual-governance';

export const useScheduleProposalTxSend = () => {
  const { chainId } = useLidoSDK();
  const writeDualGovernanceContract = useWriteContract(DualGovernance.abi);
  const { currentDualGovernanceAddress } = useDynamicDualGovernance();

  return useCallback(
    async (id: number) => {
      invariant(writeDualGovernanceContract, 'Contract is not found');

      // Use the dynamic DualGovernance address from EmergencyProtectedTimelock
      const governanceAddress =
        currentDualGovernanceAddress ||
        (DualGovernance.chainAddressMap[chainId] as Address);

      return writeDualGovernanceContract({
        address: governanceAddress,
        functionName: 'scheduleProposal',
        args: [BigInt(id)],
      });
    },
    [chainId, writeDualGovernanceContract, currentDualGovernanceAddress],
  );
};
