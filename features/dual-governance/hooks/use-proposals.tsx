import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { isAragonProposal } from 'utils/proposals/is-aragon-proposal';

import { ProposalCombinedData } from 'features/dual-governance/proposals/types';
import { getProposalSubmittedEvents } from 'features/dual-governance/events/get-proposal-submitted-events';

export type ProposalsQueryResult = {
  proposalsCount: bigint;
  proposals: ProposalCombinedData[];
};

export const useProposals = (): UseQueryResult<ProposalsQueryResult> => {
  const { chainId } = useLidoSDK();
  const publicClient = usePublicClient();
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  const { data: proposalsCount } = useQuery<bigint>({
    queryKey: ['proposalsCount', chainId],
    staleTime: Infinity,
    queryFn: async () => {
      try {
        return await emergencyProtectedTimelock.readContract(
          'getProposalsCount',
        );
      } catch (error) {
        console.error('Failed to fetch proposals count:', error);
        throw new Error('Failed to fetch proposals count');
      }
    },
  });

  return useQuery<ProposalsQueryResult, Error>({
    queryKey: proposalsCount
      ? [
          'getProposals',
          emergencyProtectedTimelock.address,
          proposalsCount.toString(),
        ]
      : ['getProposals', emergencyProtectedTimelock.address],
    queryFn: async (): Promise<ProposalsQueryResult> => {
      if (!publicClient || proposalsCount === undefined) {
        return { proposalsCount: 0n, proposals: [] };
      }
      try {
        const { mergedProposalSubmittedEvents } =
          await getProposalSubmittedEvents({
            client: publicClient,
            EPTContract: emergencyProtectedTimelock,
          });

        const mapProposalsData = mergedProposalSubmittedEvents.map(
          async (mergedProposalSubmittedEvent) => {
            try {
              const proposalInfo =
                await emergencyProtectedTimelock.readContract('getProposal', [
                  BigInt(mergedProposalSubmittedEvent.proposalId.toString()),
                ]);

              const result: ProposalCombinedData = {
                ...mergedProposalSubmittedEvent,
                proposalId: Number(mergedProposalSubmittedEvent.proposalId),
                proposalDetails: {
                  ...proposalInfo[0],
                },
              };

              const voteId = await isAragonProposal({
                client: publicClient,
                proposalLog: mergedProposalSubmittedEvent.DGEvent,
                chainId,
              });

              if (voteId) {
                result.voteId = Number(voteId);
              }

              return result;
            } catch (e) {
              console.error(
                `Failed to process proposal data for log with ID ${mergedProposalSubmittedEvent.proposalId}:`,
                e,
              );
              throw new Error('Failed to prepare proposals data');
            }
          },
        );

        const proposals = await Promise.all(mapProposalsData);

        return { proposalsCount, proposals };
      } catch (error) {
        console.error('Failed to fetch proposals:', error);
        throw new Error('Failed to fetch proposals');
      }
    },
    refetchOnWindowFocus: true,
    enabled: !!publicClient && proposalsCount !== undefined,
  });
};
