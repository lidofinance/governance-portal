import { usePublicClient } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { PublicClient, Address, Abi, AbiEvent } from 'viem';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { CHAINS } from '@lido-sdk/constants';
import { isAragonProposal } from 'utils/proposals/isAragonProposal';
import {
  ProposalCombinedData,
  ProposalDetails,
  ProposalLog,
  SubmitProposalCall,
} from 'features/dual-governance/proposals/types';

const BATCH_SIZE = 10000n;

type FindEventsBaseConfig = {
  address: Address;
  abi: Abi;
  eventName: string;
  batchSize: bigint;
  proposalsCount: bigint;
};

type GetProposalResult = readonly [
  ProposalDetails,
  readonly SubmitProposalCall[],
];

interface FindEventsConfig extends FindEventsBaseConfig {
  onProposalFound?: (result: ProposalCombinedData) => void;
  contract: ReturnType<typeof useReadContract>;
}

type UseProposalsConfig = {
  onProposalFound?: (result: ProposalCombinedData) => void;
  currentPage: number;
  limit: number;
};

export type ProposalsQueryResult = {
  proposalsCount: bigint;
  proposals: ProposalCombinedData[];
};

const findAllProposalsEvents = async (
  client: PublicClient,
  config: FindEventsConfig,
  chainId: CHAINS,
  currentPage: number,
  limit: number,
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

  const startId = proposalsCount - BigInt((currentPage - 1) * limit);
  const endId = startId > BigInt(limit) ? startId - BigInt(limit - 1) : 1n;

  let latestBlock = await client.getBlockNumber();
  const foundEvents: Record<string, boolean> = {};
  const proposals: ProposalCombinedData[] = [];

  for (let id = startId; id >= endId; id--) {
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

    console.log(batchLogs, 'batchLogs');

    for (const log of batchLogs) {
      const id = log.args.id;
      if (id && id >= endId && id <= startId && !foundEvents[id.toString()]) {
        foundEvents[id.toString()] = true;

        const voteId = await isAragonProposal({
          client,
          proposalLog: log,
          chainId,
        });

        try {
          const proposalInfo = (await contract.readContract('getProposal', [
            id,
          ])) as GetProposalResult;

          console.log(proposalInfo, 'proposalInfo');

          const result: ProposalCombinedData = {
            id: Number(id),
            event: log,
            proposalInfo,
            voteId: Number(voteId),
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

  return proposals.sort((a, b) => b.id - a.id);
};

export const useProposals = ({
  onProposalFound,
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
        const proposals = await findAllProposalsEvents(
          publicClient,
          {
            address: emergencyProtectedTimelock.address,
            abi: EmergencyProtectedTimelock.abi,
            eventName: 'ProposalSubmitted',
            proposalsCount,
            batchSize: BATCH_SIZE,
            onProposalFound,
            contract: emergencyProtectedTimelock,
          },
          chainId,
          currentPage,
          limit,
        );

        console.log(proposals, proposalsCount, 'proposals, proposalsCount');

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
