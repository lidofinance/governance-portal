import { useQueryClient } from '@tanstack/react-query';
import { useDualGovernanceContext } from 'providers/dual-governance';

/**
 * Hook to refetch all escrow-related data after a transaction
 * This ensures that the UI updates immediately after supporting veto or revoking tokens
 */
export const useRefetchEscrowData = () => {
  const queryClient = useQueryClient();
  const { refetch: refetchDualGovernanceState } = useDualGovernanceContext();

  const refetchAll = async () => {
    await queryClient.invalidateQueries({ queryKey: ['escrow-balances'] });
    await refetchDualGovernanceState();
  };

  return { refetchAll };
};
