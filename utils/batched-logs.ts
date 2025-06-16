import { Address, PublicClient, AbiEvent, Log } from 'viem';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_BLOCK_RANGE = 4999;
const REQUEST_TIMEOUT = 20000;

type GetBatchedLogsParams = {
  publicClient: PublicClient;
  address: Address | Address[];
  event: AbiEvent;
  fromBlock: bigint;
  toBlock: bigint | 'latest';
  args?: Record<string, any>;
  blockStep?: number;
  onProgress?: (current: bigint, total: bigint) => void;
  retryCount?: number;
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
  retryCount = 0,
}: GetBatchedLogsParams): Promise<Log[]> => {
  const toBlock =
    requestedToBlock === 'latest'
      ? await publicClient.getBlockNumber()
      : requestedToBlock;

  // If the range is already within limits, make a single request
  if (fromBlock + BigInt(blockStep) >= toBlock) {
    try {
      const logPromise = publicClient.getLogs({
        address,
        event,
        args: args as any,
        fromBlock,
        toBlock,
      });

      const timeoutPromise = new Promise<Log[]>((_, reject) =>
        setTimeout(
          () => reject(new Error('RPC request timeout')),
          REQUEST_TIMEOUT,
        ),
      );

      return await Promise.race([logPromise, timeoutPromise]);
    } catch (error) {
      if (retryCount < 3) {
        const backoffMs = Math.min(500 * Math.pow(2, retryCount), 4000);
        console.warn(
          `Error fetching logs, retrying in ${backoffMs}ms (attempt ${retryCount + 1}/3)`,
          error,
        );
        await delay(backoffMs);

        return getBatchedLogs({
          publicClient,
          address,
          event,
          fromBlock,
          toBlock,
          args,
          blockStep,
          onProgress,
          retryCount: retryCount + 1,
        });
      }
      throw error;
    }
  }

  const logs: Log[] = [];
  let currentFromBlock = fromBlock;

  const totalBlocks = toBlock - fromBlock;
  let lastProgressUpdate = Date.now();

  while (currentFromBlock <= toBlock) {
    const currentToBlock = BigInt(
      Math.min(Number(currentFromBlock) + blockStep, Number(toBlock)),
    );

    try {
      const logPromise = publicClient.getLogs({
        address,
        event,
        args: args as any,
        fromBlock: currentFromBlock,
        toBlock: currentToBlock,
      });

      const timeoutPromise = new Promise<Log[]>((_, reject) =>
        setTimeout(
          () => reject(new Error('RPC request timeout')),
          REQUEST_TIMEOUT,
        ),
      );

      const batchLogs = await Promise.race([logPromise, timeoutPromise]);
      logs.push(...batchLogs);
    } catch (error) {
      console.error(
        `Error fetching logs from block ${currentFromBlock} to ${currentToBlock}:`,
        error,
      );

      // If we get an error with the current batch size, try with a smaller batch
      if (blockStep > 1000 && currentFromBlock !== toBlock) {
        const backoffMs = Math.min(
          500 * (1 + Math.floor(Math.random() * 3)),
          2000,
        );
        console.warn(`Reducing batch size and retrying in ${backoffMs}ms`);
        await delay(backoffMs);

        const halfBlockStep = Math.floor(blockStep / 2);
        const smallerBatchLogs = await getBatchedLogs({
          publicClient,
          address,
          event,
          args: args as any,
          fromBlock: currentFromBlock,
          toBlock: currentToBlock,
          blockStep: halfBlockStep,
          onProgress,
          retryCount: 0,
        });
        logs.push(...smallerBatchLogs);
      } else if (retryCount < 3) {
        // For small batches, retry up to 3 times with backoff
        const backoffMs = Math.min(1000 * Math.pow(2, retryCount), 8000);
        console.warn(
          `Retrying same batch in ${backoffMs}ms (attempt ${retryCount + 1}/3)`,
        );
        await delay(backoffMs);

        const retryBatchLogs = await getBatchedLogs({
          publicClient,
          address,
          event,
          args: args as any,
          fromBlock: currentFromBlock,
          toBlock: currentToBlock,
          blockStep,
          onProgress,
          retryCount: retryCount + 1,
        });
        logs.push(...retryBatchLogs);
      } else {
        throw error;
      }
    }

    if (onProgress) {
      const processedBlocks = currentToBlock - fromBlock + BigInt(1);

      const now = Date.now();
      if (now - lastProgressUpdate > 500) {
        onProgress(processedBlocks, totalBlocks);
        lastProgressUpdate = now;
      }
    }

    // Adaptive delay between batches to prevent UI freezing and reduce RPC load
    const adaptiveDelay = Math.min(
      30 + Math.floor(Number(currentToBlock - currentFromBlock) / 1000) * 10,
      100,
    );
    await delay(adaptiveDelay);

    currentFromBlock = currentToBlock + BigInt(1);
  }

  if (onProgress) {
    onProgress(totalBlocks, totalBlocks);
  }

  return logs;
};
