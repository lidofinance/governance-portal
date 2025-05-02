import { usePublicClient } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';

import { isAragonProposal } from 'utils/proposals/is-aragon-proposal';
import {
  ProposalCombinedData,
  SubmitProposalCall,
} from 'features/dual-governance/proposals/types';
import { getProposalSubmittedEvents } from '../events/get-proposal-submitted-events';
import { CHAINS } from '@lido-sdk/constants';

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
        const _chainId = chainId as unknown as CHAINS;

        const { DGEvents, EPTEvents } = await getProposalSubmittedEvents({
          client: publicClient,
          chainId: _chainId,
          EPTContract: emergencyProtectedTimelock,
        });

        const dualGovernanceEvent = DGEvents.find(
          (log) => Number(log.args.proposalId) === Number(id),
        );

        const proposalLog =
          EPTEvents.find((event) => event.args.id === BigInt(id)) || null;

        if (!proposalLog) {
          throw new Error('No proposal events found');
        }

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
          chainId: _chainId,
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
