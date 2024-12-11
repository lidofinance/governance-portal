import { usePublicClient } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { DualGovernance, EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';

import { isAragonProposal } from 'utils/proposals/isAragonProposal';
import { AbiEvent } from 'viem';
import {
  ProposalCombinedData,
  ProposalLog,
} from 'features/dual-governance/proposals/types';

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

  const dualGovernance = useReadContract(
    DualGovernance
  )

  return useQuery<ProposalCombinedData, Error>({
    queryKey: ['getProposal', id],
    queryFn: async (): Promise<ProposalCombinedData> => {
      if (!publicClient || !id) {
        throw new Error('Public client or proposal ID is not available');
      }

      const proposalId = BigInt(id);

      try {
        const eventAbi = DualGovernance.abi.find(
          (x) => x.type === 'event' && x.name === 'ProposalSubmitted',
        ) as AbiEvent | undefined;

        if (!eventAbi) {
          throw new Error('Event ProposalSubmitted not found in ABI');
        }

        const logs = (await publicClient.getLogs({
          address: dualGovernance.address,
          event: eventAbi,
          fromBlock: 0n,
          toBlock: 'latest',
        })) as unknown as ProposalLog[];

        const proposalLog = logs.find(
          (log: any) => BigInt(log.args.proposalId) === proposalId,
        );

        if (!proposalLog) {
          throw new Error(`Proposal with ID ${id} not found`);
        }

        const voteId = await isAragonProposal({
          client: publicClient,
          proposalLog: proposalLog,
          chainId,
        });

        const proposalInfo = await emergencyProtectedTimelock.readContract(
          'getProposal',
          [proposalId],
        );

        return {
          id: Number(proposalId),
          event: proposalLog,
          proposalInfo,
          voteId: voteId ? Number(voteId) : undefined,
        };
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
