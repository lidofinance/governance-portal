// We can't use absolute imports here
import {
  CHUNK_SIZE,
  CONCURRENT_LIMIT,
  GET_LOGS_BLOCK_RANGE,
  proposalExecutedEventAbi,
  proposalScheduledEventAbi,
  proposalSubmittedEventAbi,
} from './constants.mjs';
import { HISTORICAL_ADDRESSES } from '../../constants/historical-addresses.mjs';
import EmergencyProtectedTimelockAbi from '../../abi/EmergencyProtectedTimelock.abi.json';
import DualGovernanceAbi from '../../abi/DualGovernance.abi.json';

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
      ? `/api/etherscan/block-by-timestamp?chainId=${chainId}&timestamp=${timestamp}` // server-side proxy to avoid exposing API key
      : `https://api.etherscan.io/v2/api?chainid=${chainId}&module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${process.env.ETHERSCAN_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error || !data.result) {
      throw new Error(`Etherscan API error: ${data.error || 'No result'}`);
    }

    return {
      fromBlock: BigInt(data.result) - GET_LOGS_BLOCK_RANGE,
      toBlock: BigInt(data.result) + GET_LOGS_BLOCK_RANGE,
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
      fromBlock: exactBlock - GET_LOGS_BLOCK_RANGE,
      toBlock: exactBlock + GET_LOGS_BLOCK_RANGE,
    };
  }
};

export const fetchSubmittedEvent = async (
  proposalDetails,
  publicClient,
  chainId,
  isRuntime = true,
) => {
  if (!proposalDetails?.submittedAt) {
    console.warn('No submittedAt timestamp for proposal:', proposalDetails?.id);
    return null;
  }

  const submittedBlockRange = await getBlockByTimestamp(
    Number(proposalDetails.submittedAt),
    chainId,
    publicClient,
    isRuntime,
  );

  if (!submittedBlockRange) {
    console.warn(
      'Could not determine block range for proposal:',
      proposalDetails.id,
    );
    return null;
  }

  const eventPromises = HISTORICAL_ADDRESSES[chainId].governanceAddresses.map(
    async (address) => {
      try {
        return await publicClient.getLogs({
          address,
          abi: DualGovernanceAbi,
          fromBlock: submittedBlockRange.fromBlock,
          toBlock: submittedBlockRange.toBlock,
          event: proposalSubmittedEventAbi,
          args: {
            proposalId: BigInt(proposalDetails.id),
          },
        });
      } catch (error) {
        console.warn(`Failed to fetch logs from ${address}:`, error.message);
        return [];
      }
    },
  );

  const proposalSubmittedEvents = await Promise.all(eventPromises);
  const flatEvents = proposalSubmittedEvents.flat();

  if (flatEvents.length === 0) {
    console.warn('No submitted events found for proposal:', proposalDetails.id);
  }

  return flatEvents[0] || null;
};

export const fetchScheduledEvent = async (
  proposalDetails,
  publicClient,
  chainId,
  isRuntime = true,
) => {
  if (!proposalDetails?.submittedAt) {
    console.warn('No scheduledAt timestamp for proposal:', proposalDetails?.id);
    return null;
  }

  const submittedBlockRange = await getBlockByTimestamp(
    Number(proposalDetails.scheduledAt),
    chainId,
    publicClient,
    isRuntime,
  );

  const scheduledEvents = await publicClient.getLogs({
    address: HISTORICAL_ADDRESSES[chainId].emergencyProtectedTimelockAddress,
    abi: EmergencyProtectedTimelockAbi,
    fromBlock: submittedBlockRange.fromBlock,
    toBlock: submittedBlockRange.toBlock,
    event: proposalScheduledEventAbi,
    args: {
      id: BigInt(proposalDetails.id),
    },
  });

  return scheduledEvents[0] || null;
};

export const fetchExecutedEvent = async (
  proposalDetails,
  publicClient,
  chainId,
  isRuntime = true,
) => {
  if (!proposalDetails.scheduledAt) {
    console.warn('No scheduledAt timestamp for proposal:', proposalDetails?.id);
    return null;
  }

  if (proposalDetails.status !== 3) {
    console.warn(
      'Proposal is not executed, skipping "executed" event fetch',
      proposalDetails?.id,
    );
    return null;
  }

  const scheduledBlockRange = await getBlockByTimestamp(
    Number(proposalDetails.scheduledAt),
    chainId,
    publicClient,
    isRuntime,
  );

  const toBlock = await publicClient.getBlockNumber();

  const chunks = createChunks(scheduledBlockRange.fromBlock, toBlock);
  const results = await processChunksInBatches(chunks, (chunk) =>
    publicClient.getLogs({
      address: HISTORICAL_ADDRESSES[chainId].emergencyProtectedTimelockAddress,
      event: proposalExecutedEventAbi,
      args: { id: BigInt(proposalDetails.id) },
      fromBlock: chunk.from,
      toBlock: chunk.to,
    }),
  );
  return results[0] || null;
};
