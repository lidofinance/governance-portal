import { usePublicClient } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';

import { isAragonProposal } from 'utils/proposals/is-aragon-proposal';
import { ProposalCombinedData } from 'features/dual-governance/proposals/types';
import { getProposalSubmittedEvents } from '../events/get-proposal-submitted-events';

type UseProposalConfig = {
  id: number;
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
        const _chainId = chainId;

        const { mergedProposalSubmittedEvents } =
          await getProposalSubmittedEvents({
            client: publicClient,
            EPTContract: emergencyProtectedTimelock,
          });

        const proposalLog =
          mergedProposalSubmittedEvents.find(
            (event) => Number(event.proposalId) === id,
          ) || null;

        if (!proposalLog) {
          throw new Error('No proposal events found');
        }

        const result: ProposalCombinedData = {
          ...proposalLog,
          proposalId: Number(proposalLog.proposalId),
          proposalDetails: {
            ...proposalInfo[0],
          },
        };

        const voteId = await isAragonProposal({
          client: publicClient,
          proposalLog: proposalLog.DGEvent,
          chainId: _chainId,
        });

        if (voteId) {
          result.voteId = Number(voteId);
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
