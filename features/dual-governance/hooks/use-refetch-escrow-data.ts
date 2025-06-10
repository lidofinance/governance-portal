import { useQueryClient } from '@tanstack/react-query';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import { useEscrowContext } from 'providers/escrow';

/**
 * Hook to refetch all escrow-related data after a transaction
 * This ensures that the UI updates immediately after supporting veto or revoking tokens
 */
export const useRefetchEscrowData = () => {
  const queryClient = useQueryClient();
  const { refetch: refetchDualGovernanceState } =
    useDualGovernanceStateContext();
  const { refetch: refetchEscrowData } = useEscrowContext();

  const refetchAll = async () => {
    await queryClient.invalidateQueries({ queryKey: ['escrow-balances'] });
    await queryClient.invalidateQueries({ queryKey: ['lockedAssets'] });
    await queryClient.invalidateQueries({ queryKey: ['pooledEthByShares'] });
    await queryClient.invalidateQueries({ queryKey: ['stEthTotalSupply'] });
    await queryClient.invalidateQueries({ queryKey: ['rageQuitSupport'] });

    await refetchDualGovernanceState();
    await refetchEscrowData();
  };

  return { refetchAll };
};
