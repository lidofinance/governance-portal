import {
  CHUNK_SIZE,
  CONCURRENT_LIMIT,
  GET_LOGS_BLOCK_RANGE,
  startVoteEventAbi,
  executeVoteEventAbi,
  castVoteEventAbi,
  attemptCastVoteAsDelegateEventAbi,
} from './constants.mjs';

const createChunks = (fromBlock, toBlock) => {
  const chunks = [];

  for (let start = fromBlock; start <= toBlock; start += CHUNK_SIZE + 1n) {
    const end = start + CHUNK_SIZE > toBlock ? toBlock : start + CHUNK_SIZE;
    chunks.push({ from: start, to: end });
  }

  return chunks;
};

const processChunksInBatches = async (
  chunks,
  processBatch,
  concurrentLimit = CONCURRENT_LIMIT,
) => {
  const allResults = [];

  for (let i = 0; i < chunks.length; i += concurrentLimit) {
    const batch = chunks.slice(i, i + concurrentLimit);
    const batchPromises = batch.map(processBatch);
    const batchResults = await Promise.all(batchPromises);

    allResults.push(...batchResults.flat());

    if (i + concurrentLimit < chunks.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return allResults;
};

const getBlockByTimestampBinarySearch = async (
  targetTimestamp,
  publicClient,
  maxIterations = 50,
) => {
  const currentBlock = await publicClient.getBlockNumber();
  let low = 0n;
  let high = currentBlock;

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2n;
    const block = await publicClient.getBlock({ blockNumber: mid });
    const blockTimestamp = Number(block.timestamp);

    if (blockTimestamp === targetTimestamp) {
      return mid;
    }

    if (blockTimestamp < targetTimestamp) {
      low = mid + 1n;
    } else {
      high = mid - 1n;
    }

    if (high - low <= 1n) {
      const [lowBlock, highBlock] = await Promise.all([
        publicClient.getBlock({ blockNumber: low }),
        publicClient.getBlock({ blockNumber: high }),
      ]);

      const lowDiff = Math.abs(Number(lowBlock.timestamp) - targetTimestamp);
      const highDiff = Math.abs(Number(highBlock.timestamp) - targetTimestamp);

      return lowDiff <= highDiff ? low : high;
    }
  }

  return (low + high) / 2n;
};

const getBlockByTimestamp = async (
  timestamp,
  chainId,
  publicClient,
  isRuntime,
) => {
  try {
    const url = isRuntime
      ? `/api/etherscan/block-by-timestamp?chainId=${chainId}&timestamp=${timestamp}`
      : `https://api.etherscan.io/v2/api?chainid=${chainId}&module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${process.env.ETHERSCAN_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== '1' || !data.result) {
      throw new Error(`Etherscan API error: ${data.message || 'No result'}`);
    }

    const block = BigInt(data.result);
    return {
      fromBlock: block > GET_LOGS_BLOCK_RANGE ? block - GET_LOGS_BLOCK_RANGE : 0n,
      toBlock: block + GET_LOGS_BLOCK_RANGE,
    };
  } catch (error) {
    console.debug(
      'Etherscan API failed, using block estimation:',
      error.message,
    );

    const exactBlock = await getBlockByTimestampBinarySearch(
      timestamp,
      publicClient,
    );

    return {
      fromBlock:
        exactBlock > GET_LOGS_BLOCK_RANGE
          ? exactBlock - GET_LOGS_BLOCK_RANGE
          : 0n,
      toBlock: exactBlock + GET_LOGS_BLOCK_RANGE,
    };
  }
};

/**
 * Fetch StartVote event for a given vote.
 * Uses snapshotBlock as anchor — the event is emitted in the same block.
 */
export const fetchStartVoteEvent = async (
  voteId,
  snapshotBlock,
  votingAddress,
  publicClient,
) => {
  try {
    const events = await publicClient.getLogs({
      address: votingAddress,
      event: startVoteEventAbi,
      args: { voteId: BigInt(voteId) },
      fromBlock: snapshotBlock,
      toBlock: snapshotBlock + 1n,
    });

    return events[0] || null;
  } catch (error) {
    console.warn(`Failed to fetch StartVote for vote ${voteId}:`, error.message);
    return null;
  }
};

/**
 * Fetch ExecuteVote event for an executed vote.
 * Scans from snapshotBlock to current block in chunks.
 */
export const fetchExecuteVoteEvent = async (
  voteId,
  snapshotBlock,
  votingAddress,
  publicClient,
) => {
  try {
    const toBlock = await publicClient.getBlockNumber();
    const chunks = createChunks(snapshotBlock, toBlock);

    const results = await processChunksInBatches(chunks, (chunk) =>
      publicClient.getLogs({
        address: votingAddress,
        event: executeVoteEventAbi,
        args: { voteId: BigInt(voteId) },
        fromBlock: chunk.from,
        toBlock: chunk.to,
      }),
    );

    const executedLog = results[0] || null;

    if (executedLog && executedLog.blockNumber) {
      const block = await publicClient.getBlock({
        blockNumber: executedLog.blockNumber,
      });
      return { ...executedLog, blockTimestamp: Number(block.timestamp) };
    }

    return executedLog;
  } catch (error) {
    console.warn(
      `Failed to fetch ExecuteVote for vote ${voteId}:`,
      error.message,
    );
    return null;
  }
};

/**
 * Fetch CastVote and AttemptCastVoteAsDelegate events for a vote.
 * Scans from snapshotBlock to toBlock (executeVote block or current block) in chunks.
 */
export const fetchCastVoteEvents = async (
  voteId,
  snapshotBlock,
  toBlock,
  votingAddress,
  publicClient,
) => {
  try {
    const endBlock = toBlock || (await publicClient.getBlockNumber());

    const [castVoteResults, delegateResults] = await Promise.all([
      processChunksInBatches(
        createChunks(snapshotBlock, endBlock),
        (chunk) =>
          publicClient.getLogs({
            address: votingAddress,
            event: castVoteEventAbi,
            args: { voteId: BigInt(voteId) },
            fromBlock: chunk.from,
            toBlock: chunk.to,
          }),
      ),
      processChunksInBatches(
        createChunks(snapshotBlock, endBlock),
        (chunk) =>
          publicClient.getLogs({
            address: votingAddress,
            event: attemptCastVoteAsDelegateEventAbi,
            args: { voteId: BigInt(voteId) },
            fromBlock: chunk.from,
            toBlock: chunk.to,
          }),
      ),
    ]);

    return {
      castVoteEvents: castVoteResults,
      attemptCastVoteAsDelegateEvents: delegateResults,
    };
  } catch (error) {
    console.warn(
      `Failed to fetch CastVote events for vote ${voteId}:`,
      error.message,
    );
    return {
      castVoteEvents: [],
      attemptCastVoteAsDelegateEvents: [],
    };
  }
};
