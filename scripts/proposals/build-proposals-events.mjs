import { createPublicClient, http } from 'viem';
import {
  writeFileSync,
  readFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  unlinkSync,
} from 'fs';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import { HISTORICAL_ADDRESSES } from '../../constants/historical-addresses.mjs';
import { RPC_TIMEOUT_MS } from '../startup-checks/rpc.mjs';
import {
  fetchSubmittedEvent,
  fetchScheduledEvent,
  fetchExecutedEvent,
} from '../../utils/proposals/fetch-proposal-events.mjs';
import { PROPOSALS_PER_CHUNK } from '../../utils/proposals/constants.mjs';
import EmergencyProtectedTimelockAbi from '../../abi/EmergencyProtectedTimelock.abi.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_ROOT = join(__dirname, '../../public/proposals-events');

const serializeBigInt = (key, value) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

const chainDir = (chainId) => join(OUTPUT_ROOT, String(chainId));
const manifestPath = (chainId) => join(chainDir(chainId), 'manifest.json');
const chunkFileName = (chunkIndex, hash) =>
  `chunk-${chunkIndex}.${hash}.json`;

const hashChunk = (jsonString) =>
  createHash('sha256').update(jsonString).digest('hex').slice(0, 10);

const readExistingChainData = (chainId) => {
  const mPath = manifestPath(chainId);
  if (!existsSync(mPath)) {
    return {};
  }
  try {
    const manifest = JSON.parse(readFileSync(mPath, 'utf8'));
    const merged = {};
    for (const file of Object.values(manifest.chunks || {})) {
      const chunkPath = join(chainDir(chainId), file);
      if (!existsSync(chunkPath)) {
        continue;
      }
      const chunkData = JSON.parse(readFileSync(chunkPath, 'utf8'));
      Object.assign(merged, chunkData);
    }
    return merged;
  } catch (error) {
    console.warn(
      `Failed to read existing chain ${chainId} cache:`,
      error.message,
    );
    return {};
  }
};

const partitionByChunk = (proposalsMap, firstId) => {
  const chunks = new Map();
  for (const [idStr, entry] of Object.entries(proposalsMap)) {
    const id = Number(idStr);
    if (!Number.isFinite(id)) {
      continue;
    }
    const idx = Math.floor((id - firstId) / PROPOSALS_PER_CHUNK);
    if (!chunks.has(idx)) {
      chunks.set(idx, {});
    }
    chunks.get(idx)[idStr] = entry;
  }
  return chunks;
};

const writeChainChunks = (chainId, proposalsMap) => {
  const dir = chainDir(chainId);
  mkdirSync(dir, { recursive: true });

  let firstId = 0;
  let lastId = 0;
  let hasIds = false;
  for (const key of Object.keys(proposalsMap)) {
    const id = Number(key);
    if (!Number.isFinite(id)) continue;
    if (!hasIds) {
      firstId = id;
      lastId = id;
      hasIds = true;
    } else {
      if (id < firstId) firstId = id;
      if (id > lastId) lastId = id;
    }
  }

  const partitioned = partitionByChunk(proposalsMap, firstId);
  const newChunkFiles = new Map();

  for (const [idx, chunkData] of partitioned) {
    const json = JSON.stringify(chunkData, serializeBigInt, 2);
    const hash = hashChunk(json);
    const filename = chunkFileName(idx, hash);
    const filepath = join(dir, filename);
    if (!existsSync(filepath)) {
      writeFileSync(filepath, json);
      console.debug(`  wrote ${filename}`);
    } else {
      console.debug(`  unchanged ${filename}`);
    }
    newChunkFiles.set(idx, filename);
  }

  const manifest = {
    chunkSize: PROPOSALS_PER_CHUNK,
    firstId,
    lastId,
    chunks: Object.fromEntries(
      [...newChunkFiles].sort(([a], [b]) => a - b).map(([k, v]) => [k, v]),
    ),
  };
  writeFileSync(manifestPath(chainId), JSON.stringify(manifest, null, 2));
  console.debug(`  wrote manifest.json`);

  const keep = new Set(newChunkFiles.values());
  keep.add('manifest.json');
  for (const file of readdirSync(dir)) {
    if (!keep.has(file) && file.startsWith('chunk-') && file.endsWith('.json')) {
      unlinkSync(join(dir, file));
      console.debug(`  removed orphan ${file}`);
    }
  }
};

const fetchProposalsCount = async (
  publicClient,
  emergencyProtectedTimelockAddress,
) => {
  try {
    console.debug('Fetching proposals count...');
    const count = await publicClient.readContract({
      address: emergencyProtectedTimelockAddress,
      abi: EmergencyProtectedTimelockAbi,
      functionName: 'getProposalsCount',
    });
    console.debug(`Successfully fetched proposals count: ${count}`);
    return count;
  } catch (error) {
    console.error('Failed to fetch proposals count:', error.message);
    return null;
  }
};

const fetchProposalDetails = async (
  publicClient,
  emergencyProtectedTimelockAddress,
  proposalId,
) => {
  try {
    const details = await publicClient.readContract({
      address: emergencyProtectedTimelockAddress,
      abi: EmergencyProtectedTimelockAbi,
      functionName: 'getProposalDetails',
      args: [BigInt(proposalId)],
    });
    return {
      id: proposalId,
      ...details,
    };
  } catch (error) {
    console.error(`Failed to fetch proposal ${proposalId}:`, error.message);
    return null;
  }
};

export const buildProposalsEvents = async () => {
  console.debug('Starting proposals events build...');

  const supportedChains = process.env.SUPPORTED_CHAINS
    ? process.env.SUPPORTED_CHAINS.split(',')
    : [];
  console.debug(`Building for chains: ${supportedChains.join(', ') || 'None'}`);

  if (supportedChains.length === 0) {
    console.warn('No SUPPORTED_CHAINS environment variable set. Aborting.');
    return {};
  }

  const contractAddresses = {};
  for (const chainIdStr of supportedChains) {
    const chainId = Number(chainIdStr);
    if (HISTORICAL_ADDRESSES[chainId]) {
      contractAddresses[chainId] = {
        governance: HISTORICAL_ADDRESSES[chainId].governanceAddresses,
        emergencyProtectedTimelock:
          HISTORICAL_ADDRESSES[chainId].emergencyProtectedTimelockAddress,
      };
    } else {
      console.warn(`No HISTORICAL_ADDRESSES found for chain ${chainId}.`);
    }
  }
  console.debug(
    'Loaded contract addresses for chains:',
    Object.keys(contractAddresses),
  );

  const clients = {};
  for (const chainIdStr of supportedChains) {
    const chainId = Number(chainIdStr);
    const rpcUrls = process.env[`EL_RPC_URLS_${chainId}`];

    if (rpcUrls) {
      console.debug(`Creating client for chain ${chainId}...`);
      clients[chainId] = createPublicClient({
        transport: http(rpcUrls.split(',')[0], {
          retryCount: 3,
          timeout: RPC_TIMEOUT_MS,
        }),
      });
    } else {
      console.warn(
        `No RPC URL found in EL_RPC_URLS_${chainId}. Chain ${chainId} will be skipped.`,
      );
    }
  }

  const clientsCreated = Object.keys(clients).length;
  if (clientsCreated === 0 && supportedChains.length > 0) {
    console.error('----------------------------------------------------');
    console.error(
      'FATAL: No RPC clients were created for any supported chains.',
    );
    console.error('This is likely due to missing environment variables');
    console.error('(e.g., EL_RPC_URLS_1, EL_RPC_URLS_560048, etc.).');
    console.error('Aborting build to prevent an empty data file.');
    console.error('----------------------------------------------------');
    throw new Error('No RPC clients configured.');
  }
  console.debug(`Successfully created ${clientsCreated} clients.`);

  const TERMINAL_STATUSES = new Set([3 /* Executed */, 4 /* Cancelled */]);
  const EXECUTED_STATUS = 3;

  const eventsData = {};

  for (const chainIdStr of supportedChains) {
    const chainId = Number(chainIdStr);

    if (!clients[chainId]) {
      console.debug(
        `No RPC client available for chain ${chainId}, skipping...`,
      );
      continue;
    }

    if (!contractAddresses[chainId]) {
      console.debug(
        `No contract addresses configured for chain ${chainId}, skipping...`,
      );
      continue;
    }

    console.debug(`Processing chain ${chainId}...`);

    const proposalsCount = await fetchProposalsCount(
      clients[chainId],
      contractAddresses[chainId].emergencyProtectedTimelock,
    );

    if (proposalsCount === null || proposalsCount === undefined) {
      console.warn(
        `Could not obtain proposals count for chain ${chainId}, skipping proposals processing.`,
      );
      continue;
    }

    if (typeof proposalsCount !== 'bigint') {
      console.warn(
        `Unexpected proposalsCount type for chain ${chainId}: ${typeof proposalsCount}, treating as 0`,
      );
      continue;
    }

    console.debug(`Found ${proposalsCount} proposals on chain ${chainId}`);

    if (proposalsCount === 0n) {
      console.debug(`No proposals found on chain ${chainId}`);
      writeChainChunks(chainId, {});
      continue;
    }

    const proposalIds = Array.from(
      { length: Number(proposalsCount) },
      (_, i) => i + 1,
    );

    console.debug(`Fetching proposal details for chain ${chainId}...`);
    const proposalsDetailsPromises = proposalIds.map((id) =>
      fetchProposalDetails(
        clients[chainId],
        contractAddresses[chainId].emergencyProtectedTimelock,
        id,
      ),
    );

    const proposalsDetailsResults = await Promise.allSettled(
      proposalsDetailsPromises,
    );

    const proposalsDetails = [];
    proposalsDetailsResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        proposalsDetails.push(result.value);
      } else if (result.status === 'rejected') {
        console.warn(
          `Failed to fetch proposal detail for ID ${proposalIds[index]} on chain ${chainId}:`,
          result.reason.message,
        );
      }
    });

    console.debug(
      `Successfully fetched ${proposalsDetails.length} proposal details for chain ${chainId}`,
    );

    const existingChainData = readExistingChainData(chainId);

    const freshStatusById = new Map(
      proposalsDetails.map((p) => [String(p.id), p.status]),
    );
    const seed = {};
    for (const [idStr, cached] of Object.entries(existingChainData)) {
      const freshStatus = freshStatusById.get(idStr);
      if (
        freshStatus !== undefined &&
        cached?.details?.status === freshStatus
      ) {
        seed[idStr] = cached;
      }
    }

    eventsData[chainId] = {
      proposals: seed,
    };

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const canSkip = (cached, proposal) => {
      const cachedStatus = cached?.details?.status;
      return (
        cachedStatus !== undefined &&
        TERMINAL_STATUSES.has(cachedStatus) &&
        cachedStatus === proposal.status &&
        !!cached.proposalSubmittedEvent &&
        (proposal.status !== EXECUTED_STATUS || !!cached.proposalExecutedEvent)
      );
    };

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const processProposal = async (proposal) => {
      if (!proposal) return null;

      const cached = existingChainData[proposal.id];
      if (canSkip(cached, proposal)) {
        console.debug(
          `Proposal ${proposal.id} is terminal and fully cached, skipping`,
        );
        return null;
      }

      console.debug(
        `Processing event fetches for proposal ${proposal.id} on chain ${chainId}...`,
      );

      try {
        const submittedEvent = await fetchSubmittedEvent(
          proposal,
          clients[chainId],
          chainId,
          false,
        );

        const scheduledEvent = await fetchScheduledEvent(
          proposal,
          clients[chainId],
          chainId,
          false,
        );

        const executedEvent = await fetchExecutedEvent(
          proposal,
          clients[chainId],
          chainId,
          false,
        );

        return {
          id: proposal.id,
          data: {
            proposalSubmittedEvent: submittedEvent,
            proposalScheduledEvent: scheduledEvent,
            proposalExecutedEvent: executedEvent,
            details: proposal,
          },
        };
      } catch (error) {
        console.error(
          `Error fetching events for proposal ${proposal.id} on chain ${chainId}:`,
          error.message,
          error.stack,
        );
        return null;
      }
    };

    console.debug(
      `Processing ${proposalsDetails.length} proposals sequentially for chain ${chainId}...`,
    );

    for (const [index, proposal] of proposalsDetails.entries()) {
      console.debug(
        `Processing proposal ${index + 1}/${proposalsDetails.length} (ID: ${proposal.id}) on chain ${chainId}`,
      );
      try {
        const result = await processProposal(proposal);
        if (result) {
          const { id, data } = result;
          eventsData[chainId].proposals[id] = data;
        }
      } catch (error) {
        console.error(
          `A critical error occurred processing proposal ${proposal.id} on chain ${chainId}:`,
          error.message,
          error.stack,
        );
      }
    }
    console.debug(`All proposals for chain ${chainId} processed.`);

    console.debug(`Writing chunks for chain ${chainId}...`);
    writeChainChunks(chainId, eventsData[chainId].proposals);
  }

  console.debug('Proposals events build completed successfully');
  console.debug('Built data for chains:', Object.keys(eventsData));

  return eventsData;
};

void (async () => {
  try {
    await buildProposalsEvents();
    console.debug('Script buildProposalsEvents completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Script failed:', error.message, error.stack);
    process.exit(1);
  }
})();
