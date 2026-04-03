import { Address, PublicClient } from 'viem';
import { CONTRACT_DEPLOYMENT_BLOCKS } from 'shared/blockchain/deployment-blocks';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export interface FetchLogsOptions {
  client: PublicClient;
  address: Address | Address[];
  event: any;
  toBlock: bigint;
  fromBlock?: bigint;
  chainId?: CHAINS;
  args?: Record<string, any>;
  chunkCount?: number;
  returnOnFirstMatch?: boolean; // Return immediately when first matching log is found
}

const MAX_BLOCKS_PER_CHUNK = 4999n;

/**
 * Fetches logs in parallel chunks to optimize RPC requests
 * @returns Array of event logs
 */
export const fetchLogsInParallelChunks = async <T>({
  client,
  address,
  event,
  toBlock,
  fromBlock: customFromBlock,
  chainId,
  args,
  chunkCount = 3,
  returnOnFirstMatch = false,
}: FetchLogsOptions): Promise<T[]> => {
  let fromBlock = customFromBlock;

  if (!fromBlock && chainId) {
    const deploymentBlocks = CONTRACT_DEPLOYMENT_BLOCKS[chainId];
    fromBlock = deploymentBlocks?.dualGovernance || 0n;
  }

  fromBlock = fromBlock || 0n;

  const totalBlocks = toBlock - fromBlock + 1n;

  // If the range is small enough, just make a single request
  if (totalBlocks <= MAX_BLOCKS_PER_CHUNK) {
    try {
      const filter: any = {
        address,
        event,
        fromBlock,
        toBlock,
      };

      if (args) {
        filter.args = args;
      }

      const logs = await client.getLogs(filter);
      return logs as unknown as T[];
    } catch (error) {
      console.error(
        `Error fetching logs for range ${fromBlock}-${toBlock}:`,
        error,
      );
      return [];
    }
  }

  // Calculate initial chunk size based on total blocks and chunk count
  let blocksPerChunk = totalBlocks / BigInt(chunkCount);

  // Ensure no chunk exceeds MAX_BLOCKS_PER_CHUNK
  if (blocksPerChunk > MAX_BLOCKS_PER_CHUNK) {
    chunkCount = Number(
      (totalBlocks + MAX_BLOCKS_PER_CHUNK - 1n) / MAX_BLOCKS_PER_CHUNK,
    );
    blocksPerChunk = totalBlocks / BigInt(chunkCount);
  }

  const chunks = Array.from({ length: chunkCount }, (_, i) => {
    const start = fromBlock + blocksPerChunk * BigInt(i);
    const end =
      i === chunkCount - 1
        ? toBlock
        : fromBlock + blocksPerChunk * BigInt(i + 1) - 1n;

    return { fromBlock: start, toBlock: end };
  });

  if (returnOnFirstMatch) {
    // Process chunks from newest to oldest
    const sortedChunks = [...chunks].sort((a, b) =>
      Number(b.toBlock - a.toBlock),
    );

    for (const chunk of sortedChunks) {
      try {
        const filter: any = {
          address,
          event,
          fromBlock: chunk.fromBlock,
          toBlock: chunk.toBlock,
        };

        if (args) {
          filter.args = args;
        }

        const logs = await client.getLogs(filter);
        if (logs.length > 0) {
          return logs as unknown as T[];
        }
      } catch (error) {
        console.error(
          `Error fetching logs for range ${chunk.fromBlock}-${chunk.toBlock}:`,
          error,
        );
      }
    }

    return [] as unknown as T[];
  }

  // For normal parallel processing without early return
  const requests = chunks.map(async (chunk) => {
    const filter: any = {
      address,
      event,
      fromBlock: chunk.fromBlock,
      toBlock: chunk.toBlock,
    };

    if (args) {
      filter.args = args;
    }

    try {
      return await client.getLogs(filter);
    } catch (error) {
      console.error(
        `Error fetching logs for range ${chunk.fromBlock}-${chunk.toBlock}:`,
        error,
      );
      return [];
    }
  });

  try {
    const results = await Promise.all(requests);
    const flatResults = results.flat();
    return flatResults as unknown as T[];
  } catch (error) {
    console.error(`Error fetching logs in parallel:`, error);
    return [];
  }
};
