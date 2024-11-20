import { usePublicClient } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { PublicClient, Address, Log, Abi, AbiEvent } from 'viem';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';

const BATCH_SIZE = 10000n;

export interface ProposalEventArgs {
  metadata: string;
  id: bigint;
  proposer: Address;
  timestamp: bigint;
  calls: any[];
}

export type ProposalLog = Log & {
  args: ProposalEventArgs;
};

interface FindEventsBaseConfig {
  address: Address;
  abi: Abi;
  eventName: string;
  batchSize: bigint;
  proposalsCount: bigint;
}

export interface ProposalCombinedData {
  id: string;
  event: ProposalLog;
  proposalInfo: any;
  voteId: number;
}

interface FindEventsConfig extends FindEventsBaseConfig {
  onProposalFound?: (result: ProposalCombinedData) => void;
  contract: ReturnType<typeof useReadContract>;
}

interface UseProposalsConfig {
  onProposalFound?: (result: ProposalCombinedData) => void;
}

interface ProposalsQueryResult {
  proposalsCount: bigint;
  proposals: ProposalCombinedData[];
}

const findAllProposalsEvents = async (
  client: PublicClient,
  config: FindEventsConfig,
): Promise<ProposalCombinedData[]> => {
  const {
    proposalsCount,
    batchSize,
    abi,
    eventName,
    address,
    onProposalFound,
    contract,
  } = config;

  let latestBlock = await client.getBlockNumber();
  const foundEvents: Record<string, boolean> = {};
  const proposals: ProposalCombinedData[] = [];

  for (let id = 1n; id <= proposalsCount; id++) {
    foundEvents[id.toString()] = false;
  }

  while (
    latestBlock > 0n &&
    Object.values(foundEvents).some((found) => !found)
  ) {
    const fromBlock = latestBlock >= batchSize ? latestBlock - batchSize : 0n;
    const toBlock = latestBlock;

    const eventAbi = abi.find(
      (x): x is AbiEvent => x.type === 'event' && x.name === eventName,
    );

    if (!eventAbi) {
      console.error(`Event ${eventName} not found in ABI`);
      return proposals;
    }

    const batchLogs = (await client.getLogs({
      address,
      event: eventAbi,
      fromBlock,
      toBlock,
    })) as unknown as ProposalLog[];

    for (const log of batchLogs) {
      const id = log.args.id;
      if (id && id <= proposalsCount && !foundEvents[id.toString()]) {
        foundEvents[id.toString()] = true;

        try {
          const proposalInfo = await contract.readContract('getProposal', [
            id.toString(),
          ]);

          const result: ProposalCombinedData = {
            id: id.toString(),
            event: log,
            proposalInfo,
            voteId: Number(log.args.id), // TODO Get real voteId from metadata when it's done on the onchain side
          };

          if (onProposalFound !== undefined) {
            onProposalFound(result);
          }

          proposals.push(result);
        } catch (error) {
          console.error(
            `Failed to fetch proposal details for ID ${id}:`,
            error,
          );
        }
      }
    }

    latestBlock = fromBlock - 1n;
  }

  return proposals;
};

export const useProposals = ({
  onProposalFound,
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
        ]
      : ['getProposals', emergencyProtectedTimelock.address],
    queryFn: async (): Promise<ProposalsQueryResult> => {
      if (!publicClient || proposalsCount === undefined) {
        return { proposalsCount: 0n, proposals: [] };
      }

      try {
        const proposals = await findAllProposalsEvents(publicClient, {
          address: emergencyProtectedTimelock.address,
          abi: EmergencyProtectedTimelock.abi,
          eventName: 'ProposalSubmitted',
          proposalsCount,
          batchSize: BATCH_SIZE,
          onProposalFound,
          contract: emergencyProtectedTimelock,
        });

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
