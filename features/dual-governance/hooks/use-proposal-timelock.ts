import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery } from '@tanstack/react-query';

const useTimelockQuery = (
  queryKey: string,
  contractMethod: string,
  contract: ReturnType<typeof useReadContract>,
) => {
  return useQuery<number, Error>({
    queryKey: [queryKey],
    staleTime: Infinity,
    queryFn: async () => {
      try {
        const result = await contract.readContract(contractMethod);
        return Number(result);
      } catch (error) {
        console.error(`Failed to fetch ${contractMethod}:`, error);
        throw new Error(`Failed to fetch ${contractMethod}`);
      }
    },
  });
};

export const useProposalTimelocks = () => {
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  const { data: afterSubmitDelay, isLoading: isSubmitDelayLoading } =
    useTimelockQuery(
      'proposalAfterSubmitDelay',
      'getAfterSubmitDelay',
      emergencyProtectedTimelock,
    );

  const { data: afterScheduleDelay, isLoading: isScheduleDelayLoading } =
    useTimelockQuery(
      'afterScheduleDelay',
      'getAfterScheduleDelay',
      emergencyProtectedTimelock,
    );

  return {
    isLoading: isSubmitDelayLoading || isScheduleDelayLoading,
    afterSubmitDelay, // in seconds
    afterScheduleDelay, // in seconds
  };
};
