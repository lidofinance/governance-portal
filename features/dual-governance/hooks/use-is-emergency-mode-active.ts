import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';

export const useIsEmergencyModeActive = () => {
  const { chainId } = useLidoSDK();
  const isSupportedChain = useIsSupportedChain();

  const emergencyProtectedTimelockContract = useReadContract(
    EmergencyProtectedTimelock,
  );

  const { data: isEmergencyModeActive, isLoading } = useQuery<boolean>({
    queryKey: ['isEmergencyModeActive', chainId],
    enabled: isSupportedChain,
    queryFn: async () => {
      try {
        const result = await emergencyProtectedTimelockContract.readContract(
          'isEmergencyModeActive',
        );
        return result === null ? false : result;
      } catch (error) {
        console.debug(`Emergency mode check skipped: ${error}`);
        return false;
      }
    },
  });

  return { isEmergencyModeActive, isLoading };
};
