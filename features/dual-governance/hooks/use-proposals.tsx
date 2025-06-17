import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { isAragonProposal } from 'utils/proposals/is-aragon-proposal';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useGetHistoricalGovernanceAddresses } from './use-get-historical-governance-addresses';

import { ProposalCombinedData } from 'features/dual-governance/proposals/types';
import { getProposalSubmittedEvents } from 'features/dual-governance/events/get-proposal-submitted-events';

export type ProposalsQueryResult = {
  proposalsCount: bigint;
  proposals: ProposalCombinedData[];
};

export const useProposals = (): UseQueryResult<ProposalsQueryResult> => {
  const { chainId: sdkChainId } = useLidoSDK();
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const publicClient = usePublicClient();
  const isSupportedChain = useIsSupportedChain();
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );
  const { addresses: governanceAddresses } =
    useGetHistoricalGovernanceAddresses();

  const _enabled =
    isSupportedChain && (isConnected ? chainId === sdkChainId : true);

  const { data: proposalsCount } = useQuery({
    queryKey: ['proposalsCount', emergencyProtectedTimelock?.address, chainId],
    queryFn: async () => {
      if (!emergencyProtectedTimelock) {
        throw new Error('Emergency Protected Timelock contract not found');
      }

      return await emergencyProtectedTimelock.readContract('getProposalsCount');
    },
    enabled:
      !!emergencyProtectedTimelock &&
      !!emergencyProtectedTimelock.address &&
      _enabled,
    staleTime: 30000,
  });

  return useQuery<ProposalsQueryResult>({
    queryKey: proposalsCount
      ? [
          'getProposals',
          emergencyProtectedTimelock.address,
          proposalsCount.toString(),
          chainId,
        ]
      : ['getProposals', emergencyProtectedTimelock.address, chainId],
    staleTime: 30000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: 'always',
    queryFn: async (): Promise<ProposalsQueryResult> => {
      if (!publicClient || proposalsCount === undefined) {
        return { proposalsCount: 0n, proposals: [] };
      }
      try {
        const { mergedProposalSubmittedEvents } =
          await getProposalSubmittedEvents({
            client: publicClient,
            EPTContract: emergencyProtectedTimelock,
            chainId,
            governanceAddresses,
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

              if (mergedProposalSubmittedEvent.DGEvent) {
                const voteId = await isAragonProposal({
                  client: publicClient,
                  proposalLog: mergedProposalSubmittedEvent.DGEvent,
                  chainId,
                });

                if (voteId) {
                  result.voteId = Number(voteId);
                }
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
  });
};
