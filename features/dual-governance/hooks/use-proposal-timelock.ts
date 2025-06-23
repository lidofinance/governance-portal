import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery } from '@tanstack/react-query';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useLidoSDK } from 'providers/lido-sdk';

export const useProposalDelaysQuery = ({ enabled }: { enabled: boolean }) => {
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );
  const isSupportedChain = useIsSupportedChain();
  const { chainId } = useLidoSDK();

  return useQuery<{ afterSubmitDelay: number; afterScheduleDelay: number }>({
    queryKey: ['proposalDelaysQuery', chainId],
    staleTime: Infinity,
    queryFn: async () => {
      try {
        if (!isSupportedChain) {
          return {
            afterSubmitDelay: 0,
            afterScheduleDelay: 0,
          };
        }

        const [afterSubmitDelay, afterScheduleDelay] = await Promise.all([
          emergencyProtectedTimelock.readContract('getAfterSubmitDelay'),
          emergencyProtectedTimelock.readContract('getAfterScheduleDelay'),
        ]);

        return {
          afterSubmitDelay: afterSubmitDelay === null ? 0 : afterSubmitDelay,
          afterScheduleDelay:
            afterScheduleDelay === null ? 0 : afterScheduleDelay,
        };
      } catch (error) {
        console.debug(`Proposal delays check skipped:`, error);
        return {
          afterSubmitDelay: 0,
          afterScheduleDelay: 0,
        };
      }
    },
    throwOnError: false,
    enabled: enabled && isSupportedChain,
  });
};
