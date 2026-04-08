import {
  CHUNK_SIZE,
  CONCURRENT_LIMIT,
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
 * First tries a single getLogs over the full range (voteId is indexed,
 * so most RPC nodes handle it efficiently). Falls back to chunked
 * scanning if the RPC rejects the range.
 */
export const fetchExecuteVoteEvent = async (
  voteId,
  snapshotBlock,
  votingAddress,
  publicClient,
) => {
  const logArgs = {
    address: votingAddress,
    event: executeVoteEventAbi,
    args: { voteId: BigInt(voteId) },
  };

  try {
    // Try full-range query first — indexed topic makes this fast on most RPCs
    const events = await publicClient.getLogs({
      ...logArgs,
      fromBlock: snapshotBlock,
    });

    const executedLog = events[0] || null;

    if (executedLog && executedLog.blockNumber) {
      const block = await publicClient.getBlock({
        blockNumber: executedLog.blockNumber,
      });
      return { ...executedLog, blockTimestamp: Number(block.timestamp) };
    }

    return executedLog;
  } catch {
    // Full-range rejected — fall back to chunked scanning
    console.debug(
      `  Full-range getLogs failed for vote ${voteId}, falling back to chunked scan`,
    );

    try {
      const toBlock = await publicClient.getBlockNumber();
      const chunks = createChunks(snapshotBlock, toBlock);

      const results = await processChunksInBatches(chunks, (chunk) =>
        publicClient.getLogs({
          ...logArgs,
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
  }
};

/**
 * Fetch CastVote and AttemptCastVoteAsDelegate events for a vote.
 * Tries a single getLogs call first (voteId is indexed), falls back to
 * chunked scanning if the RPC rejects the range.
 */
export const fetchCastVoteEvents = async (
  voteId,
  snapshotBlock,
  toBlock,
  votingAddress,
  publicClient,
) => {
  const castVoteArgs = {
    address: votingAddress,
    event: castVoteEventAbi,
    args: { voteId: BigInt(voteId) },
    fromBlock: snapshotBlock,
  };

  const delegateArgs = {
    address: votingAddress,
    event: attemptCastVoteAsDelegateEventAbi,
    args: { voteId: BigInt(voteId) },
    fromBlock: snapshotBlock,
  };

  if (toBlock) {
    castVoteArgs.toBlock = toBlock;
    delegateArgs.toBlock = toBlock;
  }

  // Try single full-range query first
  try {
    const [castVoteResults, delegateResults] = await Promise.all([
      publicClient.getLogs(castVoteArgs),
      publicClient.getLogs(delegateArgs),
    ]);

    return {
      castVoteEvents: castVoteResults,
      attemptCastVoteAsDelegateEvents: delegateResults,
    };
  } catch {
    // Full-range rejected — fall back to chunked scanning
    console.debug(
      `  Full-range CastVote getLogs failed for vote ${voteId}, falling back to chunked scan`,
    );
  }

  try {
    const endBlock = toBlock || (await publicClient.getBlockNumber());

    const [castVoteResults, delegateResults] = await Promise.all([
      processChunksInBatches(
        createChunks(snapshotBlock, endBlock),
        (chunk) =>
          publicClient.getLogs({
            ...castVoteArgs,
            fromBlock: chunk.from,
            toBlock: chunk.to,
          }),
      ),
      processChunksInBatches(
        createChunks(snapshotBlock, endBlock),
        (chunk) =>
          publicClient.getLogs({
            ...delegateArgs,
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
