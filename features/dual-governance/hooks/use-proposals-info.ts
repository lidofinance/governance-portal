import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useContractInstance } from 'shared/blockchain/hooks/use-contract-instance';

export const useProposalsInfo = () => {
  const { chainId } = useLidoSDK();
  const emergencyProtectedTimelock = useContractInstance(
    EmergencyProtectedTimelock,
  );

  return useQuery({
    queryKey: ['proposals-info', chainId],
    staleTime: Infinity,
    queryFn: async () => {
      // TODO: add date fetch
      const proposalsCount =
        await emergencyProtectedTimelock.read.getProposalsCount();

      return {
        proposalsCount: proposalsCount.toString(),
      };
    },
  });
};
