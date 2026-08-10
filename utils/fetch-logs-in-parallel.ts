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
const GET_LOGS_RETRY_COUNT = 3;
const GET_LOGS_RETRY_BASE_DELAY_MS = 250;
const CHUNK_CONCURRENCY = 3;

const wait = (delayMs: number) =>
  new Promise((resolve) => setTimeout(resolve, delayMs));

const mapWithConcurrency = async <Item, Out>(
  items: Item[],
  limit: number,
  task: (item: Item) => Promise<Out>,
): Promise<Out[]> => {
  const results: Out[] = [];
  let cursor = 0;

  const worker = async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await task(items[index]);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );

  return results;
};

const buildFilter = (
  address: Address | Address[],
  event: any,
  fromBlock: bigint,
  toBlock: bigint,
  args?: Record<string, any>,
) => {
  const filter: any = { address, event, fromBlock, toBlock };
  if (args) {
    filter.args = args;
  }
  return filter;
};

const getLogsWithRetry = async (
  client: PublicClient,
  filter: any,
): Promise<any[]> => {
  let lastError: unknown;

  for (let attempt = 0; attempt < GET_LOGS_RETRY_COUNT; attempt++) {
    try {
      return await client.getLogs(filter);
    } catch (error) {
      lastError = error;
      if (attempt < GET_LOGS_RETRY_COUNT - 1) {
        await wait(GET_LOGS_RETRY_BASE_DELAY_MS * 2 ** attempt);
      }
    }
  }

  throw lastError;
};

/**
 * Fetches event logs for a block range.
 * Tries a single request for the whole range first, falling back to parallel
 * chunks only when the provider rejects it. A failed request is retried and
 * then thrown — never swallowed into a partial result.
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

  if (!returnOnFirstMatch) {
    try {
      const logs = await getLogsWithRetry(
        client,
        buildFilter(address, event, fromBlock, toBlock, args),
      );
      return logs as unknown as T[];
    } catch (error) {
      console.warn(
        '[fetchLogsInParallelChunks] full-range request failed, falling back to chunks',
        error,
      );
    }
  }

  const totalBlocks = toBlock - fromBlock + 1n;

  const chunks: { fromBlock: bigint; toBlock: bigint }[] = [];

  if (totalBlocks <= MAX_BLOCKS_PER_CHUNK) {
    chunks.push({ fromBlock, toBlock });
  } else {
    if (BigInt(chunkCount) > totalBlocks) {
      chunkCount = Number(totalBlocks);
    }

    let blocksPerChunk = totalBlocks / BigInt(chunkCount);

    if (blocksPerChunk > MAX_BLOCKS_PER_CHUNK) {
      chunkCount = Number(
        (totalBlocks + MAX_BLOCKS_PER_CHUNK - 1n) / MAX_BLOCKS_PER_CHUNK,
      );
      blocksPerChunk = totalBlocks / BigInt(chunkCount);
    }

    for (let index = 0; index < chunkCount; index++) {
      const start = fromBlock + blocksPerChunk * BigInt(index);
      const end =
        index === chunkCount - 1
          ? toBlock
          : fromBlock + blocksPerChunk * BigInt(index + 1) - 1n;

      chunks.push({ fromBlock: start, toBlock: end });
    }
  }

  if (returnOnFirstMatch) {
    const chunksNewestFirst = [...chunks].sort((first, second) =>
      Number(second.toBlock - first.toBlock),
    );

    for (const chunk of chunksNewestFirst) {
      const logs = await getLogsWithRetry(
        client,
        buildFilter(address, event, chunk.fromBlock, chunk.toBlock, args),
      );
      if (logs.length > 0) {
        return logs as unknown as T[];
      }
    }

    return [] as unknown as T[];
  }

  const results = await mapWithConcurrency(chunks, CHUNK_CONCURRENCY, (chunk) =>
    getLogsWithRetry(
      client,
      buildFilter(address, event, chunk.fromBlock, chunk.toBlock, args),
    ),
  );

  return results.flat() as unknown as T[];
};
