import { Address, PublicClient, AbiEvent, Log } from 'viem';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_BLOCK_RANGE = 4999;

type GetBatchedLogsParams = {
  publicClient: PublicClient;
  address: Address | Address[];
  event: AbiEvent;
  fromBlock: bigint;
  toBlock: bigint | 'latest';
  args?: Record<string, any>;
  blockStep?: number;
  onProgress?: (current: bigint, total: bigint) => void;
};

/**
 * Fetches logs in batches to avoid RPC provider limitations
 * This utility splits requests into smaller chunks with a default maximum range of 4999 blocks
 */
export const getBatchedLogs = async ({
  publicClient,
  address,
  event,
  fromBlock,
  toBlock: requestedToBlock,
  args = {},
  blockStep = MAX_BLOCK_RANGE,
  onProgress,
}: GetBatchedLogsParams): Promise<Log[]> => {
  const toBlock =
    requestedToBlock === 'latest'
      ? await publicClient.getBlockNumber()
      : requestedToBlock;

  // If the range is already within limits, make a single request
  if (fromBlock + BigInt(blockStep) >= toBlock) {
    return publicClient.getLogs({
      address,
      event,
      args: args as any,
      fromBlock,
      toBlock,
    });
  }

  const logs: Log[] = [];
  let currentFromBlock = fromBlock;

  const totalBlocks = toBlock - fromBlock;

  while (currentFromBlock <= toBlock) {
    const currentToBlock = BigInt(
      Math.min(Number(currentFromBlock) + blockStep, Number(toBlock)),
    );

    try {
      const batchLogs = await publicClient.getLogs({
        address,
        event,
        args: args as any,
        fromBlock: currentFromBlock,
        toBlock: currentToBlock,
      });

      logs.push(...batchLogs);
    } catch (error) {
      console.error(
        `Error fetching logs from block ${currentFromBlock} to ${currentToBlock}:`,
        error,
      );

      // If we get an error with the current batch size, try with a smaller batch
      if (blockStep > 1000 && currentFromBlock !== toBlock) {
        const halfBlockStep = Math.floor(blockStep / 2);
        const smallerBatchLogs = await getBatchedLogs({
          publicClient,
          address,
          event,
          args: args as any,
          fromBlock: currentFromBlock,
          toBlock: currentToBlock,
          blockStep: halfBlockStep,
        });
        logs.push(...smallerBatchLogs);
      } else {
        throw error;
      }
    }

    if (onProgress) {
      const processedBlocks = currentToBlock - fromBlock + BigInt(1);
      onProgress(processedBlocks, totalBlocks);
    }

    // Add a small delay between batches to prevent UI freezing
    await delay(10);

    currentFromBlock = currentToBlock + BigInt(1);
  }

  if (onProgress) {
    onProgress(totalBlocks, totalBlocks);
  }

  return logs;
};
