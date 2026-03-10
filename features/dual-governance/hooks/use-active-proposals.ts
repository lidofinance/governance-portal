import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { CachedEventsData, ProposalStatus } from '../proposals/types';

type Args = {
  proposalsCount?: bigint;
};

export const useActiveProposals = ({ proposalsCount }: Args) => {
  const { chainId } = useLidoSDK();
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  return useQuery({
    queryKey: ['activeProposals', proposalsCount?.toString(), chainId],
    queryFn: async () => {
      if (
        !proposalsCount ||
        proposalsCount === BigInt(0) ||
        !emergencyProtectedTimelock
      ) {
        return [] as number[];
      }

      let cachedProposals: CachedEventsData | null = null;

      try {
        const response = await fetch('/proposals-events-data.json');
        if (response.ok) {
          cachedProposals = await response.json();
        }
      } catch (error) {
        console.warn('Failed to load cached proposals data:', error);
      }

      const activeProposalIds: number[] = [];
      const chainIdStr = chainId.toString();
      const cachedChainData = cachedProposals?.[chainIdStr]?.proposals || {};

      for (
        let proposalId = 1;
        proposalId <= Number(proposalsCount);
        proposalId++
      ) {
        const proposalIdStr = proposalId.toString();
        const cachedProposal = cachedChainData[proposalIdStr];

        if (cachedProposal) {
          // Proposal is in the cache — check its status from cached details
          const cachedStatus = cachedProposal.details?.status;
          if (
            cachedStatus === ProposalStatus.Submitted ||
            cachedStatus === ProposalStatus.Scheduled
          ) {
            activeProposalIds.push(proposalId);
          }
          continue;
        }

        // Not in cache — fetch from RPC
        try {
          const proposalData = await emergencyProtectedTimelock.readContract(
            'getProposal',
            [BigInt(proposalId)],
          );

          const proposalDetails = proposalData[0];

          if (
            proposalDetails.status !== ProposalStatus.Executed &&
            proposalDetails.status !== ProposalStatus.Cancelled &&
            proposalDetails.status !== ProposalStatus.NotExist
          ) {
            activeProposalIds.push(proposalId);
          }
        } catch (error) {
          console.error(`Failed to fetch proposal ${proposalId}:`, error);
        }
      }

      return activeProposalIds.sort((a, b) => a - b);
    },
    enabled: !!emergencyProtectedTimelock && !!proposalsCount,
    staleTime: 60000,
  });
};
