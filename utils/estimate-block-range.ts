import { PublicClient } from 'viem';

const AVERAGE_BLOCK_TIME = 13;

export const calculateAverageBlockTime = async (
  client: PublicClient,
  blockCount = 4999n,
): Promise<number> => {
  try {
    const latestBlock = await client.getBlock({ blockTag: 'latest' });
    const oldBlock = await client.getBlock({
      blockNumber: latestBlock.number - blockCount,
    });

    const timeDiffSeconds = Number(latestBlock.timestamp - oldBlock.timestamp);
    return timeDiffSeconds / Number(blockCount);
  } catch (error) {
    console.error('Error calculating average block time:', error);
    return 12; // Default to 12 seconds as fallback
  }
};

/**
 * Estimates a block range based on a timestamp
 */
export const estimateBlockRangeFromTimestamp = async (
  timestamp: number | Date,
  rangeSize = 2000n,
  blockTime: number | undefined = AVERAGE_BLOCK_TIME,
  client: PublicClient,
): Promise<{ fromBlock: bigint; toBlock: bigint }> => {
  try {
    const latestBlock = await client.getBlock({ blockTag: 'latest' });
    const currentBlockNumber = latestBlock.number;
    const currentBlockTimestamp = Number(latestBlock.timestamp);

    const targetTimestamp =
      timestamp instanceof Date
        ? Math.floor(timestamp.getTime() / 1000)
        : timestamp;

    const timeDiffSeconds = currentBlockTimestamp - targetTimestamp;

    const blocksAgo = Math.floor(timeDiffSeconds / blockTime);

    let estimatedBlockNumber = currentBlockNumber - BigInt(blocksAgo);
    if (estimatedBlockNumber < 0n) estimatedBlockNumber = 0n;

    const fromBlock = estimatedBlockNumber - rangeSize;
    const toBlock = estimatedBlockNumber + rangeSize;

    return { fromBlock, toBlock };
  } catch (error) {
    console.error('Error in estimateBlockRangeFromTimestamp:', error);

    // Fallback
    const latestBlock = await client.getBlockNumber();
    const fromBlock =
      latestBlock > rangeSize * 2n ? latestBlock - rangeSize * 2n : 0n;

    return {
      fromBlock,
      toBlock: latestBlock,
    };
  }
};
