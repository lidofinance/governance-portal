import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import {
  DualGovernance,
  EmergencyProtectedTimelock,
} from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { isAragonProposal } from 'utils/proposals/isAragonProposal';
import { findAllEvents } from 'utils';

import {
  ProposalCombinedData,
  ProposalDetails,
  ProposalDualGovernanceLog,
  ProposalLog,
  SubmitProposalCall,
} from 'features/dual-governance/proposals/types';
import { Address } from 'viem';
import { UseEventWatcherConfig } from 'features/dual-governance/types';

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

const WATCH_EVENT_POLLING_INTERVAL = 1000;

export const useProposalExecutedEventWatcher = ({
  chainId,
  refetchFn,
}: UseEventWatcherConfig<ProposalsQueryResult>) => {
  useWatchContractEvent({
    address: EmergencyProtectedTimelock.chainAddressMap[chainId] as Address,
    abi: EmergencyProtectedTimelock.abi,
    eventName: 'ProposalExecuted',
    poll: true,
    pollingInterval: WATCH_EVENT_POLLING_INTERVAL,
    onLogs(logs) {
      console.log('Proposal executed', logs);
      refetchFn();
    },
  });
};

export const useProposalScheduledEventWatcher = ({
  chainId,
  refetchFn,
}: UseEventWatcherConfig<ProposalsQueryResult>) => {
  useWatchContractEvent({
    address: EmergencyProtectedTimelock.chainAddressMap[chainId] as Address,
    abi: EmergencyProtectedTimelock.abi,
    eventName: 'ProposalScheduled',
    poll: true,
    pollingInterval: WATCH_EVENT_POLLING_INTERVAL,
    onLogs(logs) {
      console.log('Proposal scheduled', logs);
      refetchFn();
    },
  });
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

        const proposalDualGovernanceEvents = await findAllEvents(publicClient, {
          address: DualGovernance.chainAddressMap[chainId] as Address,
          abi: DualGovernance.abi,
          eventName: 'ProposalSubmitted',
          shouldStop: (log: ProposalDualGovernanceLog) =>
            Number(log.args?.proposalId) === 1,
        });

        const mapProposalsData = proposalsEvents.map(
          async (proposalEventLog) => {
            try {
              const proposalInfo =
                (await emergencyProtectedTimelock.readContract('getProposal', [
                  proposalEventLog.args.id,
                ])) as GetProposalResult;

              const dualGovernanceEvent = proposalDualGovernanceEvents.find(
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
                chainId,
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
          },
        );

        const proposals = await Promise.all(mapProposalsData);

        const sortProposals = proposals.sort((a, b) => b.id - a.id);

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
