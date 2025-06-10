import { useQueryClient } from '@tanstack/react-query';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';

/**
 * Hook to refetch all escrow-related data after a transaction
 * This ensures that the UI updates immediately after supporting veto or revoking tokens
 */
export const useRefetchEscrowData = () => {
  const queryClient = useQueryClient();
  const { refetch: refetchDualGovernanceState } =
    useDualGovernanceStateContext();

  const refetchAll = async () => {
    await queryClient.invalidateQueries({ queryKey: ['escrow-balances'] });
    await refetchDualGovernanceState();
  };

  return { refetchAll };
};
