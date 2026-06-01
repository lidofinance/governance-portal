import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import { createPublicClient, http, decodeEventLog, isAddress } from 'viem';
import { RPC_TIMEOUT_MS } from '../startup-checks/rpc.mjs';
import DualGovernanceAbi from '../../abi/DualGovernance.abi.json' assert { type: 'json' };
import EmergencyProtectedTimelockAbi from '../../abi/EmergencyProtectedTimelock.abi.json' assert { type: 'json' };
import { HISTORICAL_ADDRESSES } from '../../constants/historical-addresses.mjs';
import { diffEntry } from '../cache-entry-diff.mjs';

const eventSpecs = {
  proposalSubmittedEvent: {
    abi: DualGovernanceAbi,
    eventName: 'ProposalSubmitted',
    idArg: 'proposalId',
    valueArgs: ['proposerAccount', 'metadata'],
  },
  proposalScheduledEvent: {
    abi: EmergencyProtectedTimelockAbi,
    eventName: 'ProposalScheduled',
    idArg: 'id',
    valueArgs: [],
  },
  proposalExecutedEvent: {
    abi: EmergencyProtectedTimelockAbi,
    eventName: 'ProposalExecuted',
    idArg: 'id',
    valueArgs: [],
    checkTimestamp: true,
  },
};

const PROPOSAL_STATUS_LABEL = {
  0: 'NotExist',
  1: 'Submitted',
  2: 'Scheduled',
  3: 'Executed',
  4: 'Cancelled',
};

const requiredEventsByStatus = {
  1: ['proposalSubmittedEvent'],
  2: ['proposalSubmittedEvent', 'proposalScheduledEvent'],
  3: [
    'proposalSubmittedEvent',
    'proposalScheduledEvent',
    'proposalExecutedEvent',
  ],
  4: ['proposalSubmittedEvent'],
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const INPUT_ROOT = join(__dirname, '../../public/proposals-events');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const supportedChains = process.env.SUPPORTED_CHAINS
  ? process.env.SUPPORTED_CHAINS.split(',')
  : [];

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

const readCachedChainData = (chainId) => {
  const chainDir = join(INPUT_ROOT, String(chainId));
  const manifestFile = join(chainDir, 'manifest.json');
  if (!existsSync(manifestFile)) {
    return null;
  }
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
  const proposals = {};
  const missingChunks = [];
  for (const file of Object.values(manifest.chunks || {})) {
    const chunkPath = join(chainDir, file);
    if (!existsSync(chunkPath)) {
      console.error(
        `❌ Manifest references missing chunk ${file} for chain ${chainId}`,
      );
      missingChunks.push(file);
      continue;
    }
    const chunkData = JSON.parse(readFileSync(chunkPath, 'utf8'));
    Object.assign(proposals, chunkData);
  }
  return { proposals, missingChunks };
};

const readEventsData = () => {
  if (!existsSync(INPUT_ROOT) || !statSync(INPUT_ROOT).isDirectory()) {
    throw new Error(`Cache root not found at ${INPUT_ROOT}.`);
  }
  const eventsData = {};
  for (const entry of readdirSync(INPUT_ROOT)) {
    const chainId = Number(entry);
    if (!Number.isFinite(chainId)) {
      continue;
    }
    const chainData = readCachedChainData(chainId);
    if (chainData) {
      eventsData[entry] = chainData;
    }
  }
  return eventsData;
};

const getClients = () => {
  const clients = {};

  for (const chainIdStr of supportedChains) {
    const chainId = Number(chainIdStr);
    const rpcUrl = process.env[`EL_RPC_URLS_${chainId}`];

    if (rpcUrl) {
      console.info(`Setting up RPC client for chain ${chainId}...`);
      clients[chainId] = createPublicClient({
        transport: http(rpcUrl.split(',')[0], {
          retryCount: 3,
          timeout: RPC_TIMEOUT_MS,
        }),
      });
    } else {
      console.warn(
        `⚠️ No RPC URL found for chain ${chainId}. This chain will be skipped for validation.`,
      );
    }
  }
  return clients;
};

const collectDetailsDiffs = async (
  proposalId,
  proposalData,
  client,
  eptAddress,
) => {
  try {
    const onChainDetails = await client.readContract({
      address: eptAddress,
      abi: EmergencyProtectedTimelockAbi,
      functionName: 'getProposalDetails',
      args: [BigInt(proposalId)],
    });
    const diffs = diffEntry(onChainDetails, proposalData.details).map(
      (message) => `details.${message}`,
    );
    return { diffs, status: Number(onChainDetails.status) };
  } catch (error) {
    return { diffs: [`details: read failed: ${error.message}`], status: null };
  }
};

const collectEventDiffs = async (proposalId, key, cachedEvent, client) => {
  const spec = eventSpecs[key];
  const diffs = [];

  if (!cachedEvent.transactionHash) {
    return [`${key}: missing transactionHash`];
  }

  let receipt;
  try {
    receipt = await client.getTransactionReceipt({
      hash: cachedEvent.transactionHash,
    });
  } catch (error) {
    return [`${key}: receipt fetch failed: ${error.message}`];
  }

  const log = receipt.logs.find(
    (entry) =>
      entry.address.toLowerCase() === cachedEvent.address.toLowerCase() &&
      entry.topics[0] === cachedEvent.topics[0],
  );
  if (!log) {
    return [
      `${key}: event not found in receipt ${cachedEvent.transactionHash}`,
    ];
  }

  if (BigInt(receipt.blockNumber) !== BigInt(cachedEvent.blockNumber)) {
    diffs.push(
      `${key}.blockNumber: ${cachedEvent.blockNumber} !== ${receipt.blockNumber}`,
    );
  }

  let decoded;
  try {
    decoded = decodeEventLog({
      abi: spec.abi,
      data: log.data,
      topics: log.topics,
    });
  } catch (error) {
    return [...diffs, `${key}: decode failed: ${error.message}`];
  }

  if (decoded.eventName !== spec.eventName) {
    diffs.push(`${key}.eventName: ${spec.eventName} !== ${decoded.eventName}`);
  }

  if (String(decoded.args[spec.idArg]) !== String(proposalId)) {
    diffs.push(
      `${key}.${spec.idArg}: ${proposalId} !== ${decoded.args[spec.idArg]}`,
    );
  }

  for (const arg of spec.valueArgs) {
    const onChainValue = decoded.args[arg];
    const cachedValue = cachedEvent.args[arg];
    const equal = isAddress(onChainValue)
      ? onChainValue.toLowerCase() === String(cachedValue).toLowerCase()
      : String(onChainValue).trim() === String(cachedValue).trim();
    if (!equal) {
      diffs.push(
        `${key}.args.${arg}: ${JSON.stringify(cachedValue)} !== ${JSON.stringify(onChainValue)}`,
      );
    }
  }

  if (spec.checkTimestamp && cachedEvent.blockTimestamp != null) {
    try {
      const block = await client.getBlock({
        blockNumber: BigInt(cachedEvent.blockNumber),
      });
      if (Number(block.timestamp) !== Number(cachedEvent.blockTimestamp)) {
        diffs.push(
          `${key}.blockTimestamp: ${cachedEvent.blockTimestamp} !== ${block.timestamp}`,
        );
      }
    } catch (error) {
      diffs.push(`${key}.blockTimestamp: block fetch failed: ${error.message}`);
    }
  }

  return diffs;
};

const collectProposalDiffs = async (
  proposalId,
  proposal,
  client,
  eptAddress,
) => {
  const { diffs, status } = await collectDetailsDiffs(
    proposalId,
    proposal,
    client,
    eptAddress,
  );

  const requiredKeys = requiredEventsByStatus[status] ?? [];
  for (const key of requiredKeys) {
    if (!proposal[key]) {
      diffs.push(
        `${key}: required by status ${PROPOSAL_STATUS_LABEL[status] ?? status} but missing in cache`,
      );
    }
  }

  for (const key of Object.keys(eventSpecs)) {
    const cachedEvent = proposal[key];
    if (!cachedEvent) {
      continue;
    }
    diffs.push(
      ...(await collectEventDiffs(proposalId, key, cachedEvent, client)),
    );
  }

  return diffs;
};

const validateEvents = async (eventsData, clients) => {
  let hasFailures = false;

  for (const chainIdStr of Object.keys(eventsData)) {
    const chainId = Number(chainIdStr);
    const { proposals } = eventsData[chainIdStr];
    const client = clients[chainId];

    console.info(`\n## Chain ID: ${chainId}`);

    if (!client) {
      console.warn(
        `⚠️ Skipping validation: No RPC client available for chain ${chainId}.`,
      );
      continue;
    }

    const proposalIds = Object.keys(proposals)
      .map(Number)
      .sort((first, second) => first - second);

    if (proposalIds.length === 0) {
      console.info('No proposals found on this chain.');
      continue;
    }

    for (const proposalId of proposalIds) {
      await sleep(1000);

      const diffs = await collectProposalDiffs(
        proposalId,
        proposals[proposalId],
        client,
        contractAddresses[chainId].emergencyProtectedTimelock,
      );

      if (diffs.length === 0) {
        console.info(`[${proposalId}] ✅ Full entry matched on-chain`);
      } else {
        hasFailures = true;
        console.error(`[${proposalId}] ❌ ${diffs.length} mismatch(es):`);
        for (const message of diffs) {
          console.error(`    - ${message}`);
        }
      }
    }
  }

  return hasFailures;
};

const main = async () => {
  try {
    const eventsData = readEventsData();
    const clients = getClients();
    const hasFailures = await validateEvents(eventsData, clients);

    const hasMissingChunks = Object.values(eventsData).some(
      (chain) => chain.missingChunks && chain.missingChunks.length > 0,
    );
    if (hasMissingChunks) {
      console.error(
        '❌ Validation failed: manifest references chunks that are missing on disk.',
      );
      process.exit(1);
    }

    if (hasFailures) {
      console.error(
        '❌ Validation failed: cached entries diverge from on-chain.',
      );
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('Script execution failed:', error.message);
    process.exit(1);
  }
};

void main();
