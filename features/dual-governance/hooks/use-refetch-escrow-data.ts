import { useQueryClient } from '@tanstack/react-query';
import { useEscrowContext } from 'providers/escrow';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';

/**
 * Hook to refetch all escrow-related data after a transaction
 * This ensures that the UI updates immediately after supporting veto or revoking tokens
 */
export const useRefetchEscrowData = () => {
  const {
    refetch: refetchEscrowData,
    ESCROW_QUERY_KEYS,
    invalidateEscrowQueries,
  } = useEscrowContext();
  const { refetch: refetchDualGovernanceState } =
    useDualGovernanceStateContext();
  const queryClient = useQueryClient();

  const refetchAll = async () => {
    invalidateEscrowQueries();
    await queryClient.invalidateQueries({
      queryKey: ESCROW_QUERY_KEYS.escrowBalances,
    });

    await queryClient.invalidateQueries({
      queryKey: ['unsteth-balance'],
    });

    await queryClient.invalidateQueries({
      queryKey: ['token-balance'],
    });

    await refetchDualGovernanceState();
    await refetchEscrowData();
  };

  return {
    refetchAll,
  };
};
