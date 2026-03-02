import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';

export const useIsEmergencyCommittee = () => {
  const { address, isConnected } = useAccount();
  const isSupportedChain = useIsSupportedChain();

  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  return useQuery({
    queryKey: [
      'emergency-execution-committee',
      address,
      isConnected,
      isSupportedChain,
    ],
    queryFn: async () => {
      if (
        !emergencyProtectedTimelock ||
        !address ||
        !isConnected ||
        !isSupportedChain
      ) {
        return false;
      }

      try {
        const emergencyExecutionCommittee =
          await emergencyProtectedTimelock.readContract(
            'getEmergencyExecutionCommittee',
          );

        if (typeof emergencyExecutionCommittee === 'string' && address) {
          return (
            emergencyExecutionCommittee.toLowerCase() === address.toLowerCase()
          );
        } else {
          return false;
        }
      } catch (error) {
        console.error('Error fetching emergency execution committee:', error);
        return false;
      }
    },
    enabled:
      !!emergencyProtectedTimelock &&
      !!address &&
      isConnected &&
      isSupportedChain,
  });
};
