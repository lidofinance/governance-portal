import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import { HISTORICAL_ADDRESSES } from '../../constants/historical-addresses.mjs';
import {
  PROPOSALS_PER_CHUNK,
  CONCURRENT_LIMIT,
} from '../../utils/proposals/constants.mjs';
import {
  FINAL_STATUSES,
  isCachedProposalFinal,
  isCachedProposalComplete,
} from '../../utils/cache/status.mjs';
import { isAddress } from 'viem';
import { getPublicClient } from '../../utils/public-rpc.mjs';
import {
  createReporter,
  checkManifestStructure,
  processInBatches,
  reportAndExit,
  getChainFilter,
} from '../cache-base-check.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const INPUT_ROOT = join(__dirname, '../../public/proposals-events');

const EmergencyProtectedTimelockAbi = JSON.parse(
  readFileSync(
    join(__dirname, '../../abi/EmergencyProtectedTimelock.abi.json'),
    'utf8',
  ),
);

const { failures, fail } = createReporter();

const serialize = (chunkData) => JSON.stringify(chunkData, null, 2);

const checkEntryShape = (scope, id, entry) => {
  if (!entry?.proposalSubmittedEvent) {
    fail(scope, `proposal ${id} missing proposalSubmittedEvent`);
  }
  const details = entry?.details;
  if (!details || typeof details !== 'object') {
    fail(scope, `proposal ${id} missing details`);
    return;
  }
  if (typeof details.status !== 'number') {
    fail(scope, `proposal ${id} details.status is not a number`);
  }
  if (details.id === undefined || details.id === null) {
    fail(scope, `proposal ${id} details.id missing`);
  }
  if (!isAddress(details.executor)) {
    fail(scope, `proposal ${id} details.executor is not an address`);
  }
};

const fetchProposalsCount = (client, address) =>
  client.readContract({
    address,
    abi: EmergencyProtectedTimelockAbi,
    functionName: 'getProposalsCount',
  });

const fetchProposalStatus = async (client, address, proposalId) => {
  const details = await client.readContract({
    address,
    abi: EmergencyProtectedTimelockAbi,
    functionName: 'getProposalDetails',
    args: [BigInt(proposalId)],
  });
  return details.status;
};

const checkChainCompleteness = async (chainId, proposalsById) => {
  const scope = `chain ${chainId}`;
  const client = getPublicClient(chainId);
  if (!client) {
    console.warn(
      `⚠️ ${scope}: no public RPC configured, skipping completeness`,
    );
    return;
  }
  const address =
    HISTORICAL_ADDRESSES[chainId]?.emergencyProtectedTimelockAddress;
  if (!address) {
    console.warn(`⚠️ ${scope}: no EPT address, skipping completeness`);
    return;
  }

  let count;
  try {
    count = Number(await fetchProposalsCount(client, address));
  } catch (error) {
    fail(scope, `failed to read getProposalsCount: ${error.message}`);
    return;
  }

  const idsToCheck = [];
  for (let proposalId = 1; proposalId <= count; proposalId++) {
    if (isCachedProposalFinal(proposalsById[proposalId])) {
      continue;
    }
    idsToCheck.push(proposalId);
  }

  await processInBatches(idsToCheck, CONCURRENT_LIMIT, async (proposalId) => {
    let status;
    try {
      status = await fetchProposalStatus(client, address, proposalId);
    } catch (error) {
      fail(scope, `failed to read proposal ${proposalId}: ${error.message}`);
      return;
    }
    if (!FINAL_STATUSES.has(status)) {
      return;
    }
    if (!isCachedProposalComplete(proposalsById[proposalId], { status })) {
      fail(
        scope,
        `proposal ${proposalId} is final (status ${status}) on-chain but missing/incomplete in cache — rebuild with "yarn build-dg-events"`,
      );
    }
  });
};

const main = async () => {
  const chainFilter = getChainFilter();
  const chainIds = Object.keys(HISTORICAL_ADDRESSES)
    .map(Number)
    .filter((chainId) => !chainFilter || chainFilter.has(chainId));

  for (const chainId of chainIds) {
    const chainDir = join(INPUT_ROOT, String(chainId));
    let proposalsById = {};
    if (existsSync(join(chainDir, 'manifest.json'))) {
      console.info(`chain ${chainId}: checking...`);
      proposalsById =
        checkManifestStructure({
          dir: chainDir,
          scope: `chain ${chainId}`,
          perChunk: PROPOSALS_PER_CHUNK,
          serialize,
          checkEntryShape,
          fail,
        }) ?? {};
    } else {
      console.warn(
        `⚠️ chain ${chainId}: no cache directory — verifying completeness against chain`,
      );
    }
    await checkChainCompleteness(chainId, proposalsById);
  }

  reportAndExit('Proposals cache check', failures);
};

void main();
