import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery } from '@tanstack/react-query';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useChainId } from 'wagmi';
import { useLidoSDK } from 'providers/lido-sdk';

const PROPOSAL_AFTER_SUBMIT_DELAY_CONTRACT_METHOD = 'getAfterSubmitDelay';
const PROPOSAL_AFTER_SCHEDULE_DELAY_CONTRACT_METHOD = 'getAfterScheduleDelay';

export const useProposalDelaysQuery = ({ enabled }: { enabled: boolean }) => {
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );
  const isSupportedChain = useIsSupportedChain();
  const chainId = useChainId();
  const { chainId: sdkChainId } = useLidoSDK();

  return useQuery<
    { afterSubmitDelay: number; afterScheduleDelay: number },
    Error
  >({
    queryKey: ['proposalDelaysQuery', chainId],
    staleTime: Infinity,
    queryFn: async () => {
      try {
        if (!isSupportedChain || chainId !== sdkChainId) {
          return {
            afterSubmitDelay: 0,
            afterScheduleDelay: 0,
          };
        }

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
    enabled: enabled && isSupportedChain && chainId === sdkChainId,
  });
};
