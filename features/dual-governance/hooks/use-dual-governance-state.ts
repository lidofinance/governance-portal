import { useLidoSDK } from 'providers/lido-sdk';
import { DualGovernanceDetailedState } from '../types';
import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { DualGovernance } from 'shared/blockchain/contracts';

/**
 * Simple plain hook to get governance state
 * The hook is mostly used in GovernanceStateProvider
 */
export const useDualGovernanceState = ({
  isEnabled,
}: {
  isEnabled: boolean;
}) => {
  const { chainId } = useLidoSDK();

  const readDualGovernanceContract = useReadContract(DualGovernance);

  return useQuery<DualGovernanceDetailedState>({
    queryKey: ['dg-current-state', chainId],
    staleTime: 5000,
    enabled: isEnabled,

    queryFn: async () => {
      try {
        return readDualGovernanceContract.readContract('getStateDetails');
      } catch (e) {
        throw new Error(`Unable to get detailedState: ${e}`);
      }
    },
  });
};
