import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import {
  VOTING_ADDRESSES,
  VOTES_PER_CHUNK,
  CONCURRENT_LIMIT,
} from '../../utils/votes/constants.mjs';
import { getPublicClient } from '../../utils/public-rpc.mjs';
import { canonicalStringify } from '../../utils/canonical-stringify.mjs';
import {
  createReporter,
  checkManifestStructure,
  processInBatches,
  reportAndExit,
} from '../cache-base-check.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const INPUT_ROOT = join(__dirname, '../../public/votes-events');

const AragonVotingAbi = JSON.parse(
  readFileSync(join(__dirname, '../../abi/AragonVoting.abi.json'), 'utf8'),
);

const { failures, fail } = createReporter();

const serialize = (chunkData) => canonicalStringify(chunkData, 2);

const checkEntryShape = (scope, id, entry) => {
  if (!entry?.voteDetails || typeof entry.voteDetails !== 'object') {
    fail(scope, `vote ${id} missing voteDetails`);
    return;
  }
  if (typeof entry.voteDetails.open !== 'boolean') {
    fail(scope, `vote ${id} voteDetails.open is not a boolean`);
  }
  if (typeof entry.voteDetails.executed !== 'boolean') {
    fail(scope, `vote ${id} voteDetails.executed is not a boolean`);
  }
  if (!entry.startVoteEvent) {
    fail(scope, `vote ${id} missing startVoteEvent`);
  }
  if (!Array.isArray(entry.voteEvents)) {
    fail(scope, `vote ${id} voteEvents is not an array`);
  }
};

const fetchVotesLength = (client, votingAddress) =>
  client.readContract({
    address: votingAddress,
    abi: AragonVotingAbi,
    functionName: 'votesLength',
  });

const fetchVoteState = async (client, votingAddress, voteId) => {
  const rawVote = await client.readContract({
    address: votingAddress,
    abi: AragonVotingAbi,
    functionName: 'getVote',
    args: [BigInt(voteId)],
  });
  return { open: rawVote[0], executed: rawVote[1] };
};

const hasCachedVoteEvents = (cached, onChainExecuted) => {
  if (!cached?.voteDetails || !cached.startVoteEvent) {
    return false;
  }
  return onChainExecuted ? Boolean(cached.executeVoteEvent) : true;
};

const checkAddressCompleteness = async (chainId, votingAddress, votesById) => {
  const scope = `${chainId}/${votingAddress}`;
  const client = getPublicClient(chainId);
  if (!client) {
    console.warn(
      `⚠️ ${scope}: no public RPC configured, skipping completeness`,
    );
    return;
  }

  let count;
  try {
    count = Number(await fetchVotesLength(client, votingAddress));
  } catch (error) {
    fail(scope, `failed to read votesLength: ${error.message}`);
    return;
  }

  const idsToCheck = [];
  for (let voteId = 0; voteId < count; voteId++) {
    const cached = votesById[voteId];
    if (cached?.voteDetails?.executed === true && cached.executeVoteEvent) {
      continue;
    }
    idsToCheck.push(voteId);
  }

  await processInBatches(idsToCheck, CONCURRENT_LIMIT, async (voteId) => {
    let state;
    try {
      state = await fetchVoteState(client, votingAddress, voteId);
    } catch (error) {
      fail(scope, `failed to read vote ${voteId}: ${error.message}`);
      return;
    }
    if (state.open) {
      return;
    }
    if (!hasCachedVoteEvents(votesById[voteId], state.executed)) {
      fail(
        scope,
        `vote ${voteId} is closed on-chain (executed=${state.executed}) but missing/incomplete in cache — rebuild with "yarn build-vote-events"`,
      );
    }
  });
};

const main = async () => {
  for (const [chainIdStr, votingAddresses] of Object.entries(
    VOTING_ADDRESSES,
  )) {
    const chainId = Number(chainIdStr);
    for (const votingAddress of votingAddresses) {
      const addressDir = join(INPUT_ROOT, String(chainId), votingAddress);
      let votesById = {};
      if (existsSync(join(addressDir, 'manifest.json'))) {
        console.info(`${chainId}/${votingAddress}: checking...`);
        votesById =
          checkManifestStructure({
            dir: addressDir,
            scope: `${chainId}/${votingAddress}`,
            perChunk: VOTES_PER_CHUNK,
            serialize,
            checkEntryShape,
            fail,
          }) ?? {};
      } else {
        console.warn(
          `⚠️ ${chainId}/${votingAddress}: no cache directory — verifying completeness against chain`,
        );
      }
      await checkAddressCompleteness(chainId, votingAddress, votesById);
    }
  }

  reportAndExit('Votes cache check', failures);
};

void main();
