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

const shapeStartVoteEvent = (log) => {
  if (!log) {
    return null;
  }
  return {
    transactionHash: log.transactionHash,
    blockNumber: log.blockNumber,
    args: {
      voteId: log.args.voteId,
      creator: log.args.creator,
      metadata: log.args.metadata,
    },
  };
};

/**
 * Fetch StartVote event for a given vote.
 * Uses snapshotBlock as anchor — the event is emitted in the same block.
 * Returns a UI-ready shape: { transactionHash, blockNumber, args }.
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

    return shapeStartVoteEvent(events[0]);
  } catch (error) {
    console.warn(`Failed to fetch StartVote for vote ${voteId}:`, error.message);
    return null;
  }
};

const shapeExecuteVoteEvent = async (log, publicClient) => {
  if (!log || !log.blockNumber) {
    return null;
  }
  const block = await publicClient.getBlock({
    blockNumber: log.blockNumber,
  });
  return {
    transactionHash: log.transactionHash,
    blockNumber: log.blockNumber,
    executedAt: Number(block.timestamp),
  };
};

/**
 * Fetch ExecuteVote event for an executed vote.
 * First tries a single getLogs over the full range (voteId is indexed,
 * so most RPC nodes handle it efficiently). Falls back to chunked
 * scanning if the RPC rejects the range.
 * Returns a UI-ready shape: { transactionHash, blockNumber, executedAt }.
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
    const events = await publicClient.getLogs({
      ...logArgs,
      fromBlock: snapshotBlock,
    });

    return await shapeExecuteVoteEvent(events[0], publicClient);
  } catch {
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

      return await shapeExecuteVoteEvent(results[0], publicClient);
    } catch (error) {
      console.warn(
        `Failed to fetch ExecuteVote for vote ${voteId}:`,
        error.message,
      );
      return null;
    }
  }
};

const shapeCastVoteLog = (log) => ({
  blockNumber: log.blockNumber,
  transactionIndex: log.transactionIndex,
  args: {
    voteId: log.args.voteId,
    voter: log.args.voter,
    supports: log.args.supports,
    stake: log.args.stake,
  },
});

const shapeDelegateLog = (log) => ({
  blockNumber: log.blockNumber,
  transactionIndex: log.transactionIndex,
  args: {
    voteId: log.args.voteId,
    delegate: log.args.delegate,
    voters: log.args.voters,
  },
});

/**
 * Fetch CastVote and AttemptCastVoteAsDelegate events for a vote.
 * Tries a single getLogs call first (voteId is indexed), falls back to
 * chunked scanning if the RPC rejects the range.
 * Returns normalized events for processing by the build script.
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

  try {
    const [castVoteResults, delegateResults] = await Promise.all([
      publicClient.getLogs(castVoteArgs),
      publicClient.getLogs(delegateArgs),
    ]);

    return {
      castVoteEvents: castVoteResults.map(shapeCastVoteLog),
      attemptCastVoteAsDelegateEvents: delegateResults.map(shapeDelegateLog),
    };
  } catch {
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
      castVoteEvents: castVoteResults.map(shapeCastVoteLog),
      attemptCastVoteAsDelegateEvents: delegateResults.map(shapeDelegateLog),
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
