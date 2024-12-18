import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { isAragonProposal } from 'utils/proposals/isAragonProposal';
import { findAllEvents } from 'utils';

import {
  ProposalCombinedData,
  ProposalDetails,
  ProposalLog,
  SubmitProposalCall,
} from 'features/dual-governance/proposals/types';

type GetProposalResult = readonly [
  ProposalDetails,
  readonly SubmitProposalCall[],
];

type UseProposalsConfig = {
  onProposalFound?: (result: ProposalCombinedData) => void;
  currentPage: number;
  limit: number;
};

export type ProposalsQueryResult = {
  proposalsCount: bigint;
  proposals: ProposalCombinedData[];
};

export const useProposals = ({
  currentPage,
  limit,
}: UseProposalsConfig): UseQueryResult<ProposalsQueryResult> => {
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
          currentPage,
          limit,
        ]
      : ['getProposals', emergencyProtectedTimelock.address],
    queryFn: async (): Promise<ProposalsQueryResult> => {
      if (!publicClient || proposalsCount === undefined) {
        return { proposalsCount: 0n, proposals: [] };
      }

      try {
        const proposalsEvents = await findAllEvents(publicClient, {
          address: emergencyProtectedTimelock.address,
          abi: EmergencyProtectedTimelock.abi,
          eventName: 'ProposalSubmitted',
          shouldStop: (log: ProposalLog) => Number(log.args?.id) === 1,
        });

        const mapProposalsData = proposalsEvents.map(
          async (proposalEventLog) => {
            try {
              const voteId = await isAragonProposal({
                client: publicClient,
                proposalLog: proposalEventLog,
                chainId,
              });

              const proposalInfo =
                (await emergencyProtectedTimelock.readContract('getProposal', [
                  proposalEventLog.args.id,
                ])) as GetProposalResult;

              const result: ProposalCombinedData = {
                id: Number(proposalEventLog.args.id),
                event: proposalEventLog,
                proposalDetails: {
                  ...proposalInfo[0],
                  calls: proposalInfo[1] as SubmitProposalCall[],
                },
                voteId: Number(voteId),
              };
              return result;
            } catch (e) {
              console.error(
                `Failed to process proposal data for log with ID ${proposalEventLog.args.id}:`,
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
    staleTime: Infinity,
    enabled: !!publicClient && proposalsCount !== undefined,
  });
};
