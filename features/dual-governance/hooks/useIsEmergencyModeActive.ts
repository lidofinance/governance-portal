import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';

export const useIsEmergencyModeActive = () => {
  const { chainId } = useLidoSDK();

  const governanceAddress = null;

  const emergencyProtectedTimelockContract = useReadContract(
    EmergencyProtectedTimelock,
  );

  const { data: isEmergencyModeActive } = useQuery<boolean>({
    queryKey: ['isEmergencyModeActive', chainId],
    staleTime: Infinity,
    queryFn: async () => {
      try {
        return await emergencyProtectedTimelockContract.readContract(
          'isEmergencyModeActive',
        );
      } catch (error) {
        console.error(`Failed to get emergencyMode status: ${error}`);
        throw new Error(`Failed to get emergencyMode status: ${error}`);
      }
    },
  });

  // if (isEmergencyModeActive) {
  //   const { data: emergencyGovernance } = useQuery<boolean>({
  //     queryKey: ['isEmergencyModeActive', chainId],
  //     staleTime: Infinity,
  //     queryFn: async () => {
  //       try {
  //         return await emergencyProtectedTimelockContract.readContract(
  //           'isEmergencyModeActive',
  //         );
  //       } catch (error) {
  //         console.error(`Failed to get emergencyMode status: ${error}`);
  //         throw new Error(`Failed to get emergencyMode status: ${error}`);
  //       }
  //     },
  //   });
  // }

  return { isEmergencyModeActive, governanceAddress };
};
