import { usePublicClient } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { findAllEvents } from 'utils';
import {
  DualGovernance,
  EmergencyProtectedTimelock,
} from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';

import { isAragonProposal } from 'utils/proposals/isAragonProposal';
import {
  ProposalCombinedData,
  ProposalDualGovernanceLog,
  ProposalLog,
  SubmitProposalCall,
} from 'features/dual-governance/proposals/types';
import { findAbiItem } from 'utils/find-abi-item';
import { Address } from 'viem';

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
        const eventAbi = findAbiItem({
          abi: DualGovernance.abi,
          name: 'ProposalSubmitted',
          type: 'event',
        });

        if (!eventAbi) {
          throw new Error('Event ProposalSubmitted not found in ABI');
        }

        let proposalInfo;
        try {
          proposalInfo = await emergencyProtectedTimelock.readContract(
            'getProposal',
            [proposalId],
          );
        } catch (error) {
          throw error;
        }

        const proposalEventLogs = await findAllEvents(publicClient, {
          address: emergencyProtectedTimelock.address,
          abi: EmergencyProtectedTimelock.abi,
          eventName: 'ProposalSubmitted',
          shouldStop: (log: ProposalLog) => Number(log.args.id) === Number(id),
        });

        const proposalDualGovernanceEventLogs = await findAllEvents(
          publicClient,
          {
            address: DualGovernance.chainAddressMap[chainId] as Address,
            abi: DualGovernance.abi,
            eventName: 'ProposalSubmitted',
            shouldStop: (log: ProposalDualGovernanceLog) =>
              Number(log.args.proposalId) === Number(id),
          },
        );

        const dualGovernanceEvent = proposalDualGovernanceEventLogs.find(
          (log: ProposalDualGovernanceLog) =>
            Number(log.args.proposalId) === Number(id),
        );

        const proposalLog = proposalEventLogs[0];

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
