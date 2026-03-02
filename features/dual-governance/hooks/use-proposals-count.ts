import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';

export const useProposalsCount = () => {
  const { chainId } = useLidoSDK();
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );
  return useQuery({
    queryKey: ['proposals-count', chainId],
    queryFn: async () => {
      if (!emergencyProtectedTimelock) {
        throw new Error('Emergency Protected Timelock contract not found');
      }

      return await emergencyProtectedTimelock.readContract('getProposalsCount');
    },
    enabled: !!emergencyProtectedTimelock,
    staleTime: 30000,
  });
};
