import { useCallback } from 'react';
import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import {
  DualGovernance,
  EmergencyProtectedTimelock,
} from 'shared/blockchain/contracts';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { Address } from 'viem';
import { dualGovernanceAbi } from 'abi/ts';

/**
 * Hook to get the DualGovernance contract address from the EmergencyProtectedTimelock contract.
 * This is necessary because the DualGovernance contract address can change during emergency mode.
 */
export const useDynamicDualGovernance = () => {
  const { chainId } = useLidoSDK();
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  const {
    data: currentDualGovernanceAddress,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dynamic-dual-governance-address', chainId],
    staleTime: 60000,
    enabled: !!emergencyProtectedTimelock,
    queryFn: async () => {
      if (!emergencyProtectedTimelock) return null;

      try {
        const governanceAddress =
          await emergencyProtectedTimelock.readContract('getGovernance');
        return governanceAddress as Address;
      } catch (error) {
        console.error('Error fetching DualGovernance address:', error);
      }
    },
  });

  const staticDualGovernanceContract = useReadContract(DualGovernance);

  const readDualGovernanceContract = useReadContractGetter(dualGovernanceAbi);

  const readDynamicContract = useCallback(
    async (functionName: string, args: any[] = []) => {
      if (!currentDualGovernanceAddress) {
        if (!staticDualGovernanceContract) return null;

        try {
          return await staticDualGovernanceContract.readContract(
            functionName as any,
            args as any,
          );
        } catch (error) {
          console.error(
            `Error calling ${String(functionName)} on static contract:`,
            error,
          );
          return null;
        }
      }

      const readContract = readDualGovernanceContract(
        currentDualGovernanceAddress,
      );

      try {
        return await readContract(functionName as any, args as any);
      } catch (error) {
        console.error(
          `Error calling ${String(functionName)} on dynamic contract:`,
          error,
        );
        return null;
      }
    },
    [
      currentDualGovernanceAddress,
      staticDualGovernanceContract,
      readDualGovernanceContract,
    ],
  );

  return {
    readDynamicContract,
    currentDualGovernanceAddress,
    isLoading,
    error,
    refetch,
  };
};
