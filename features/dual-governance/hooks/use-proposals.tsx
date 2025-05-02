import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { isAragonProposal } from 'utils/proposals/is-aragon-proposal';

import {
  ProposalCombinedData,
  ProposalDetails,
  SubmitProposalCall,
} from 'features/dual-governance/proposals/types';
import { getProposalSubmittedEvents } from 'features/dual-governance/events/get-proposal-submitted-events';
import { CHAINS } from '@lido-sdk/constants';

type GetProposalResult = readonly [
  ProposalDetails,
  readonly SubmitProposalCall[],
];

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

      const _chainId = chainId as unknown as CHAINS;

      try {
        const { DGEvents, EPTEvents } = await getProposalSubmittedEvents({
          client: publicClient,
          chainId: _chainId,
          EPTContract: emergencyProtectedTimelock,
        });

        const mapProposalsData = EPTEvents.map(async (proposalEventLog) => {
          try {
            const proposalInfo = (await emergencyProtectedTimelock.readContract(
              'getProposal',
              [proposalEventLog.args.id],
            )) as GetProposalResult;

            const dualGovernanceEvent = DGEvents.find(
              (log) => log.args.proposalId === proposalEventLog.args.id,
            );

            const result: ProposalCombinedData = {
              id: Number(proposalEventLog.args.id),
              event: proposalEventLog,
              proposalDetails: {
                ...proposalInfo[0],
                calls: proposalInfo[1] as SubmitProposalCall[],
              },
            };

            const voteId = await isAragonProposal({
              client: publicClient,
              proposalLog: proposalEventLog,
              chainId: _chainId,
            });

            if (voteId) {
              result.voteId = Number(voteId);
            }

            if (dualGovernanceEvent) {
              result.proposalDualGovernanceDetails = dualGovernanceEvent.args;
            }

            return result;
          } catch (e) {
            console.error(
              `Failed to process proposal data for log with ID ${proposalEventLog.args.id}:`,
              e,
            );
            throw new Error('Failed to prepare proposals data');
          }
        });

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
