import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import invariant from 'tiny-invariant';
import { ProposalDetails, SubmitProposalCall } from '../proposals/types';

type ProposalDataResult = ProposalDetails & { calls: SubmitProposalCall[] };

export const useProposalDetails = (
  proposalId: number,
  enabled: boolean | undefined = true,
) => {
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  return useQuery({
    queryKey: ['proposal-details', proposalId],
    queryFn: async () => {
      if (!emergencyProtectedTimelock) {
        invariant(
          emergencyProtectedTimelock,
          'EPT contract is not initialized',
        );
      }

      const proposalData = await emergencyProtectedTimelock.readContract(
        'getProposal',
        [BigInt(proposalId)],
      );

      const proposalDetails: ProposalDataResult = {
        ...proposalData[0],
        calls: proposalData[1] as unknown as SubmitProposalCall[],
      };
      return proposalDetails;
    },
    enabled: !!emergencyProtectedTimelock && enabled,
  });
};
