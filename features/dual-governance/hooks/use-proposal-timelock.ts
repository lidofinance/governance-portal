import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery } from '@tanstack/react-query';

const PROPOSAL_AFTER_SUBMIT_DELAY_CONTRACT_METHOD = 'getAfterSubmitDelay';
const PROPOSAL_AFTER_SCHEDULE_DELAY_CONTRACT_METHOD = 'getAfterScheduleDelay';

export const useProposalDelaysQuery = ({ enabled }: { enabled: boolean }) => {
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  return useQuery<
    { afterSubmitDelay: number; afterScheduleDelay: number },
    Error
  >({
    queryKey: ['proposalDelaysQuery'],
    staleTime: Infinity,
    queryFn: async () => {
      try {
        const promises = [
          emergencyProtectedTimelock.readContract(
            PROPOSAL_AFTER_SUBMIT_DELAY_CONTRACT_METHOD,
          ),
          emergencyProtectedTimelock.readContract(
            PROPOSAL_AFTER_SCHEDULE_DELAY_CONTRACT_METHOD,
          ),
        ];

        const [afterSubmitDelay, afterScheduleDelay] =
          await Promise.all(promises);

        return {
          afterSubmitDelay,
          afterScheduleDelay,
        };
      } catch (error) {
        console.error(`Failed to fetch proposal delays:`, error);
        throw new Error(`Failed to fetch proposal delays`);
      }
    },
    throwOnError: true,
    enabled,
  });
};
