import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';

export const useProposalsInfo = () => {
  const { chainId } = useLidoSDK();
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  return useQuery({
    queryKey: ['proposals-info', chainId],
    staleTime: Infinity,
    queryFn: async () => {
      // TODO: add timestamp fetch
      const proposalsCount =
        await emergencyProtectedTimelock.readContract('getProposalsCount');

      return {
        proposalsCount: proposalsCount.toString(),
      };
    },
  });
};
