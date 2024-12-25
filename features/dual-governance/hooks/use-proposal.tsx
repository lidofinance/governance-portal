import { usePublicClient } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';

import { isAragonProposal } from 'utils/proposals/isAragonProposal';
import {
  ProposalCombinedData,
  SubmitProposalCall,
} from 'features/dual-governance/proposals/types';
import { useGetProposalSubmittedEvents } from '../events/get-proposal-submitted-events';

type UseProposalConfig = {
  id: bigint | number | null | undefined;
  enabled?: boolean;
};

export const useProposal = ({
  id,
  enabled,
}: UseProposalConfig): UseQueryResult<ProposalCombinedData> => {
  const { chainId } = useLidoSDK();
  const publicClient = usePublicClient();
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  return useQuery<ProposalCombinedData, Error>({
    queryKey: ['getProposal', id],
    queryFn: async (): Promise<ProposalCombinedData> => {
      if (!publicClient || !id) {
        throw new Error('Public client or proposal ID is not available');
      }

      const proposalId = BigInt(id);

      try {
        const proposalInfo = await emergencyProtectedTimelock.readContract(
          'getProposal',
          [proposalId],
        );

        const { DGEvents, EPTEvents } = await useGetProposalSubmittedEvents({
          client: publicClient,
          chainId,
          EPTContract: emergencyProtectedTimelock,
          proposalId,
        });

        const dualGovernanceEvent = DGEvents.find(
          (log) => Number(log.args.proposalId) === Number(id),
        );

        const proposalLog = EPTEvents[0] || {};

        const result: ProposalCombinedData = {
          id: Number(proposalId),
          event: proposalLog,
          proposalDetails: {
            ...proposalInfo[0],
            calls: proposalInfo[1] as SubmitProposalCall[],
          },
        };

        const voteId = await isAragonProposal({
          client: publicClient,
          proposalLog: proposalLog,
          chainId,
        });

        if (voteId) {
          result.voteId = Number(voteId);
        }

        if (dualGovernanceEvent) {
          result.proposalDualGovernanceDetails = dualGovernanceEvent.args;
        }

        return result;
      } catch (error) {
        console.error(`Failed to fetch proposal with ID ${id}:`, error);
        throw new Error(`Failed to fetch proposal with ID ${id}`);
      }
    },
    staleTime: Infinity,
    enabled: !!publicClient && !!id && enabled,
    retry: false,
  });
};
