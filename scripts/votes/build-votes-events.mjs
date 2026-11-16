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
import { RPC_TIMEOUT_MS } from '../startup-checks/rpc.mjs';
import AragonVotingAbi from '../../abi/AragonVoting.abi.json' with { type: 'json' };
import {
  VOTING_ADDRESSES,
  VOTES_PER_CHUNK,
  APPROX_BLOCK_TIME_SECONDS,
  VOTE_END_BLOCK_BUFFER,
  BUILD_FETCH_CONCURRENCY,
} from '../../utils/votes/constants.mjs';
import {
  fetchStartVoteEvent,
  fetchExecuteVoteEvent,
  fetchCastVoteEvents,
} from '../../utils/votes/fetch-vote-events.mjs';
import { fetchIpfsDescription } from '../../utils/votes/fetch-ipfs-description.mjs';
import { canonicalStringify } from '../../utils/canonical-stringify.mjs';
import {
  isVoteClosed,
  isCachedVoteComplete,
} from '../../utils/cache/status.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_ROOT = join(__dirname, '../../public/votes-events');
const DURATIONS_PATH = join(OUTPUT_ROOT, 'durations.json');

const getChainDir = (chainId) => join(OUTPUT_ROOT, String(chainId));
const getAddressDir = (chainId, votingAddress) =>
  join(getChainDir(chainId), votingAddress);
const getManifestPath = (chainId, votingAddress) =>
  join(getAddressDir(chainId, votingAddress), 'manifest.json');
const getDescriptionsPath = (chainId, votingAddress) =>
  join(getAddressDir(chainId, votingAddress), 'descriptions.json');
const getChunkFileName = (chunkIndex, hash) =>
  `chunk-${chunkIndex}.${hash}.json`;

const hashChunk = (jsonString) =>
  createHash('sha256').update(jsonString).digest('hex').slice(0, 10);

const isCastVoteMoreRecent = (newVote, existing) => {
  if (!existing) {
    return true;
  }
  if (newVote.blockNumber > existing.blockNumber) {
    return true;
  }
  if (newVote.blockNumber === existing.blockNumber) {
    return newVote.transactionIndex > existing.transactionIndex;
  }
  return false;
};

const processCastVoteEvents = (castVoteEvents, delegateEvents) => {
  if (castVoteEvents.length === 0) {
    return [];
  }

  const votesMap = {};

  for (const event of castVoteEvents) {
    const key = event.args.voter.toLowerCase();
    if (isCastVoteMoreRecent(event, votesMap[key])) {
      votesMap[key] = {
        blockNumber: event.blockNumber,
        transactionIndex: event.transactionIndex ?? 0,
        voter: event.args.voter,
        supports: event.args.supports,
        stake: event.args.stake,
      };
    }
  }

  const delegatedVotesMap = {};

  for (const delegateEvent of delegateEvents) {
    const nestedVotes = [];

    for (const voter of delegateEvent.args.voters) {
      const key = voter.toLowerCase();
      const voteEvent = votesMap[key];

      if (!voteEvent) {
        continue;
      }

      if (
        voteEvent.blockNumber === delegateEvent.blockNumber &&
        voteEvent.transactionIndex === (delegateEvent.transactionIndex ?? 0)
      ) {
        nestedVotes.push({
          voter: voteEvent.voter,
          supports: voteEvent.supports,
          stake: voteEvent.stake,
        });

        delete votesMap[key];
      }
    }

    if (nestedVotes.length === 0) {
      continue;
    }

    const delegateSupports = nestedVotes[0].supports;
    const delegateKey = `${delegateEvent.args.delegate.toLowerCase()}-${delegateSupports}`;
    const existingDelegatedVote = delegatedVotesMap[delegateKey];

    let delegatedVotes = nestedVotes;
    if (existingDelegatedVote) {
      const merged = new Map();
      for (const delegatedVote of [
        ...(existingDelegatedVote.delegatedVotes ?? []),
        ...nestedVotes,
      ]) {
        merged.set(delegatedVote.voter.toLowerCase(), delegatedVote);
      }
      delegatedVotes = [...merged.values()];
    }

    const delegatedStake = delegatedVotes.reduce(
      (acc, delegatedVote) => acc + delegatedVote.stake,
      0n,
    );

    const sortedVotes = delegatedVotes.sort((first, second) =>
      first.stake > second.stake ? -1 : 1,
    );

    delegatedVotesMap[delegateKey] = {
      voter: delegateEvent.args.delegate,
      supports: delegateSupports,
      stake: delegatedStake,
      delegatedVotes: sortedVotes,
    };
  }

  return [
    ...Object.values(votesMap).map((voteEntry) => ({
      voter: voteEntry.voter,
      supports: voteEntry.supports,
      stake: voteEntry.stake,
    })),
    ...Object.values(delegatedVotesMap),
  ].sort((first, second) => (first.stake > second.stake ? -1 : 1));
};

const readExistingAddressData = (chainId, votingAddress) => {
  const manifestFile = getManifestPath(chainId, votingAddress);
  if (!existsSync(manifestFile)) {
    return {};
  }
  try {
    const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
    const votesById = {};
    for (const file of Object.values(manifest.chunks || {})) {
      const chunkPath = join(getAddressDir(chainId, votingAddress), file);
      if (!existsSync(chunkPath)) {
        continue;
      }
      const chunkData = JSON.parse(readFileSync(chunkPath, 'utf8'));
      Object.assign(votesById, chunkData);
    }
    return votesById;
  } catch (error) {
    console.warn(
      `Failed to read existing cache for ${chainId}/${votingAddress}:`,
      error.message,
    );
    return {};
  }
};

const partitionByChunk = (votesMap, firstId) => {
  const chunks = new Map();
  for (const [idStr, entry] of Object.entries(votesMap)) {
    const id = Number(idStr);
    if (!Number.isFinite(id)) {
      continue;
    }
    const idx = Math.floor((id - firstId) / VOTES_PER_CHUNK);
    if (!chunks.has(idx)) {
      chunks.set(idx, {});
    }
    chunks.get(idx)[idStr] = entry;
  }
  return chunks;
};

const writeAddressChunks = (chainId, votingAddress, votesMap) => {
  const dir = getAddressDir(chainId, votingAddress);
  mkdirSync(dir, { recursive: true });

  let firstId = 0;
  let lastId = 0;
  let hasIds = false;
  for (const key of Object.keys(votesMap)) {
    const id = Number(key);
    if (!Number.isFinite(id)) {
      continue;
    }
    if (!hasIds) {
      firstId = id;
      lastId = id;
      hasIds = true;
    } else {
      if (id < firstId) {
        firstId = id;
      }
      if (id > lastId) {
        lastId = id;
      }
    }
  }

  const partitioned = partitionByChunk(votesMap, firstId);
  const newChunkFiles = new Map();

  for (const [idx, chunkData] of partitioned) {
    const json = canonicalStringify(chunkData, 2);
    const hash = hashChunk(json);
    const filename = getChunkFileName(idx, hash);
    const filepath = join(dir, filename);
    if (!existsSync(filepath)) {
      writeFileSync(filepath, `${json}\n`);
      console.debug(`    wrote ${filename}`);
    } else {
      console.debug(`    unchanged ${filename}`);
    }
    newChunkFiles.set(idx, filename);
  }

  const manifest = {
    chunkSize: VOTES_PER_CHUNK,
    firstId,
    lastId,
    chunks: Object.fromEntries(
      [...newChunkFiles].sort(
        ([indexA], [indexB]) => indexA - indexB,
      ),
    ),
  };
  writeFileSync(
    getManifestPath(chainId, votingAddress),
    `${canonicalStringify(manifest, 2)}\n`,
  );
  console.debug(`    wrote manifest.json`);

  const keep = new Set(newChunkFiles.values());
  keep.add('manifest.json');
  keep.add('descriptions.json');
  for (const file of readdirSync(dir)) {
    if (!keep.has(file) && file.startsWith('chunk-') && file.endsWith('.json')) {
      unlinkSync(join(dir, file));
      console.debug(`    removed orphan ${file}`);
    }
  }
};

const writeAddressDescriptions = (chainId, votingAddress, votesMap) => {
  const dir = getAddressDir(chainId, votingAddress);
  mkdirSync(dir, { recursive: true });

  const descriptions = {};
  for (const [idStr, entry] of Object.entries(votesMap)) {
    descriptions[idStr] = {
      creator: entry?.startVoteEvent?.args?.creator ?? null,
      metadata: entry?.startVoteEvent?.args?.metadata ?? null,
      description: entry?.description ?? null,
    };
  }

  writeFileSync(
    getDescriptionsPath(chainId, votingAddress),
    `${canonicalStringify(descriptions, 2)}\n`,
  );
  console.debug(`    wrote descriptions.json (${Object.keys(descriptions).length} entries)`);
};

const fetchLiveDurations = async (publicClient, votingAddress) => {
  const read = (functionName) =>
    publicClient.readContract({
      address: votingAddress,
      abi: AragonVotingAbi,
      functionName,
    });
  const [voteTime, objectionPhaseTime] = await Promise.all([
    read('voteTime'),
    read('objectionPhaseTime'),
  ]);
  return {
    voteTime: Number(voteTime),
    objectionPhaseTime: Number(objectionPhaseTime),
  };
};

// The contract keeps only the current durations, so past ones are recorded
// here. The last range is open-ended and holds the live pair. When the live
// pair changes, the open range closes at the last closed vote: a vote still
// open during the change runs under the new pair.
const updateVoteDurations = (ranges, liveDurations, allVoteData) => {
  const current = ranges.at(-1);
  if (
    current?.voteTime === liveDurations.voteTime &&
    current?.objectionPhaseTime === liveDurations.objectionPhaseTime
  ) {
    return ranges;
  }

  const closedRanges = ranges.slice(0, -1);
  const lastClosedVoteId = Math.max(
    -1,
    ...allVoteData.filter(isVoteClosed).map((voteData) => voteData.id),
  );
  if (current && lastClosedVoteId > (closedRanges.at(-1)?.lastVoteId ?? -1)) {
    closedRanges.push({ ...current, lastVoteId: lastClosedVoteId });
  }

  return [...closedRanges, liveDurations];
};

const getVotePhaseBlocks = (liveDurations) => {
  if (!liveDurations) {
    return 100000n;
  }
  const totalSeconds = BigInt(
    liveDurations.voteTime + liveDurations.objectionPhaseTime,
  );
  return totalSeconds / APPROX_BLOCK_TIME_SECONDS + VOTE_END_BLOCK_BUFFER;
};

const fetchVotesLength = async (publicClient, votingAddress) => {
  try {
    console.debug('Fetching votes count...');
    const count = await publicClient.readContract({
      address: votingAddress,
      abi: AragonVotingAbi,
      functionName: 'votesLength',
    });
    console.debug(`Successfully fetched votes count: ${count}`);
    return count;
  } catch (error) {
    console.error('Failed to fetch votes count:', error.message);
    return null;
  }
};

const fetchVoteData = async (publicClient, votingAddress, voteId) => {
  try {
    const [rawVote, canExecute] = await Promise.all([
      publicClient.readContract({
        address: votingAddress,
        abi: AragonVotingAbi,
        functionName: 'getVote',
        args: [BigInt(voteId)],
      }),
      publicClient.readContract({
        address: votingAddress,
        abi: AragonVotingAbi,
        functionName: 'canExecute',
        args: [BigInt(voteId)],
      }),
    ]);

    return {
      id: voteId,
      open: rawVote[0],
      executed: rawVote[1],
      startDate: rawVote[2],
      snapshotBlock: rawVote[3],
      supportRequired: rawVote[4],
      minAcceptQuorum: rawVote[5],
      yea: rawVote[6],
      nay: rawVote[7],
      votingPower: rawVote[8],
      script: rawVote[9],
      phase: rawVote[10],
      canExecute,
    };
  } catch (error) {
    console.error(`Failed to fetch vote ${voteId}:`, error.message);
    return null;
  }
};

const processVote = async (
  voteData,
  existingAddressData,
  votingAddress,
  publicClient,
  votePhaseBlocks,
) => {
  if (!voteData) {
    return null;
  }

  const cachedEntry = existingAddressData[voteData.id];

  if (cachedEntry && isCachedVoteComplete(cachedEntry)) {
    if (cachedEntry.description == null) {
      const description = await fetchIpfsDescription(
        cachedEntry.startVoteEvent?.args?.metadata ?? '',
      );
      if (description != null) {
        console.debug(
          `    [vote ${voteData.id}] Back-filled description (${description.length} chars).`,
        );
        return { ...cachedEntry, description };
      }
    }
    console.debug(
      `    [vote ${voteData.id}] Cached + complete (executed=${cachedEntry.voteDetails.executed}), skipping.`,
    );
    return cachedEntry;
  }

  if (cachedEntry) {
    console.debug(
      `    [vote ${voteData.id}] Cached but incomplete (e.g. enacted after caching), re-fetching.`,
    );
  }

  if (!isVoteClosed(voteData)) {
    console.debug(
      `    [vote ${voteData.id}] Still open (open=${voteData.open}, executed=${voteData.executed}, canExecute=${voteData.canExecute}), skipping.`,
    );
    return null;
  }

  try {
    const snapshotBlock = BigInt(voteData.snapshotBlock);

    console.debug(
      `    [vote ${voteData.id}] Fetching StartVote (snapshotBlock: ${snapshotBlock})...`,
    );
    const startVoteEvent = await fetchStartVoteEvent(
      voteData.id,
      snapshotBlock,
      votingAddress,
      publicClient,
    );

    let executeVoteEvent = null;
    if (voteData.executed) {
      console.debug(`    [vote ${voteData.id}] Fetching ExecuteVote...`);
      executeVoteEvent = await fetchExecuteVoteEvent(
        voteData.id,
        snapshotBlock,
        votingAddress,
        publicClient,
      );
    }

    // CastVote scan upper bound: voting closes at snapshotBlock + voteTime +
    // objectionPhaseTime regardless of when (or if) it was executed, so this
    // is always tighter than executeBlock and covers non-executed closed
    // votes too.
    const voteEndBlock = snapshotBlock + votePhaseBlocks;

    console.debug(`    [vote ${voteData.id}] Fetching CastVote events...`);
    const castVoteData = await fetchCastVoteEvents(
      voteData.id,
      snapshotBlock,
      voteEndBlock,
      votingAddress,
      publicClient,
    );

    const voteEvents = processCastVoteEvents(
      castVoteData.castVoteEvents,
      castVoteData.attemptCastVoteAsDelegateEvents,
    );

    console.debug(
      `    [vote ${voteData.id}] Processed: ${voteEvents.length} vote entries.`,
    );

    console.debug(`    [vote ${voteData.id}] Fetching IPFS description...`);
    const description = await fetchIpfsDescription(
      startVoteEvent?.args?.metadata ?? '',
    );

    return {
      voteDetails: {
        id: voteData.id,
        open: voteData.open,
        executed: voteData.executed,
        startDate: voteData.startDate,
        snapshotBlock: voteData.snapshotBlock,
        supportRequired: voteData.supportRequired,
        minAcceptQuorum: voteData.minAcceptQuorum,
        yea: voteData.yea,
        nay: voteData.nay,
        votingPower: voteData.votingPower,
        script: voteData.script,
        phase: voteData.phase,
        canExecute: voteData.canExecute,
      },
      startVoteEvent,
      executeVoteEvent,
      voteEvents,
      description,
    };
  } catch (error) {
    console.error(
      `Error fetching events for vote ${voteData.id} at ${votingAddress}:`,
      error.message,
      error.stack,
    );
    return null;
  }
};

export const buildVotesEvents = async () => {
  console.debug('Starting votes events build...');

  const supportedChains = process.env.SUPPORTED_CHAINS
    ? process.env.SUPPORTED_CHAINS.split(',')
    : [];
  console.debug(`Building for chains: ${supportedChains.join(', ') || 'None'}`);

  if (supportedChains.length === 0) {
    console.warn('No SUPPORTED_CHAINS environment variable set. Aborting.');
    return;
  }

  const chainVotingAddresses = {};
  for (const chainIdStr of supportedChains) {
    const chainId = Number(chainIdStr);
    if (VOTING_ADDRESSES[chainId]) {
      chainVotingAddresses[chainId] = VOTING_ADDRESSES[chainId];
    } else {
      console.warn(`No voting address found for chain ${chainId}.`);
    }
  }

  const clients = {};
  for (const chainIdStr of supportedChains) {
    const chainId = Number(chainIdStr);
    const rpcUrls = process.env[`EL_RPC_URLS_${chainId}`];

    if (rpcUrls) {
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
    console.error('Aborting build to prevent empty data files.');
    console.error('----------------------------------------------------');
    throw new Error('No RPC clients configured.');
  }

  const voteDurations = existsSync(DURATIONS_PATH)
    ? JSON.parse(readFileSync(DURATIONS_PATH, 'utf8'))
    : {};

  for (const chainIdStr of supportedChains) {
    const chainId = Number(chainIdStr);

    if (!clients[chainId] || !chainVotingAddresses[chainId]) {
      continue;
    }

    console.debug(`Processing chain ${chainId}...`);

    for (const votingAddress of chainVotingAddresses[chainId]) {
      console.debug(`  Processing voting contract ${votingAddress}...`);

      const votesLength = await fetchVotesLength(
        clients[chainId],
        votingAddress,
      );

      if (votesLength === null || votesLength === undefined) {
        console.warn(
          `Could not obtain votes count for ${votingAddress} on chain ${chainId}, skipping.`,
        );
        continue;
      }

      const votesCount = Number(votesLength);
      console.debug(`  Found ${votesCount} votes at ${votingAddress}`);

      let liveDurations = null;
      try {
        liveDurations = await fetchLiveDurations(
          clients[chainId],
          votingAddress,
        );
      } catch (error) {
        console.warn(
          `  Failed to read voteTime/objectionPhaseTime: ${error.message}. Keeping durations.json as is and falling back to a 100000 block window.`,
        );
      }

      const votePhaseBlocks = getVotePhaseBlocks(liveDurations);
      console.debug(`  Vote phase length: ${votePhaseBlocks} blocks`);

      const existingAddressData = readExistingAddressData(
        chainId,
        votingAddress,
      );

      if (votesCount === 0) {
        const existingCount = Object.keys(existingAddressData).length;
        if (existingCount > 0) {
          console.warn(
            `⚠️ ${chainId}/${votingAddress}: contract reports 0 votes but cache has ${existingCount} entries. Wiping — verify intentional (devnet reset?).`,
          );
        }
        writeAddressChunks(chainId, votingAddress, {});
        writeAddressDescriptions(chainId, votingAddress, {});
        if (liveDurations) {
          voteDurations[chainId] = {
            ...voteDurations[chainId],
            [votingAddress]: [liveDurations],
          };
        }
        continue;
      }

      const voteIds = Array.from({ length: votesCount }, (_, index) => index);

      console.debug(`  Fetching vote data for ${votingAddress}...`);
      const allVoteData = [];
      for (
        let batchStart = 0;
        batchStart < voteIds.length;
        batchStart += BUILD_FETCH_CONCURRENCY
      ) {
        const batchIds = voteIds.slice(
          batchStart,
          batchStart + BUILD_FETCH_CONCURRENCY,
        );
        const batchResults = await Promise.allSettled(
          batchIds.map((voteId) =>
            fetchVoteData(clients[chainId], votingAddress, voteId),
          ),
        );
        batchResults.forEach((result, batchIndex) => {
          if (result.status === 'fulfilled' && result.value) {
            allVoteData.push(result.value);
          } else if (result.status === 'rejected') {
            console.warn(
              `Failed to fetch vote data for ID ${batchIds[batchIndex]} at ${votingAddress}:`,
              result.reason.message,
            );
          }
        });
      }

      console.debug(
        `  Successfully fetched ${allVoteData.length} vote data entries`,
      );

      const freshVoteIds = new Set(
        allVoteData.map((voteData) => String(voteData.id)),
      );
      const finalAddressData = {};
      for (const [idStr, cached] of Object.entries(existingAddressData)) {
        if (!freshVoteIds.has(idStr)) {
          finalAddressData[idStr] = cached;
        }
      }

      for (const [index, voteData] of allVoteData.entries()) {
        console.debug(
          `  Processing vote ${index + 1}/${allVoteData.length} (ID: ${voteData.id})`,
        );
        try {
          const entry = await processVote(
            voteData,
            existingAddressData,
            votingAddress,
            clients[chainId],
            votePhaseBlocks,
          );
          if (entry) {
            finalAddressData[voteData.id] = entry;
          }
        } catch (error) {
          console.error(
            `A critical error occurred processing vote ${voteData.id} at ${votingAddress}:`,
            error.message,
            error.stack,
          );
        }
      }

      console.debug(`  Writing chunks for ${chainId}/${votingAddress}...`);
      writeAddressChunks(chainId, votingAddress, finalAddressData);
      writeAddressDescriptions(chainId, votingAddress, finalAddressData);

      // A missing vote could be the last one under the old durations.
      if (allVoteData.length !== votesCount) {
        console.warn(
          `  Read ${allVoteData.length}/${votesCount} votes, keeping durations.json as is.`,
        );
      } else if (liveDurations) {
        voteDurations[chainId] = {
          ...voteDurations[chainId],
          [votingAddress]: updateVoteDurations(
            voteDurations[chainId]?.[votingAddress] ?? [],
            liveDurations,
            allVoteData,
          ),
        };
      }
    }
  }

  writeFileSync(DURATIONS_PATH, `${canonicalStringify(voteDurations, 2)}\n`);
  console.debug('  wrote durations.json');

  console.debug('Votes events build completed successfully');
};

void (async () => {
  try {
    await buildVotesEvents();
    console.debug('Script buildVotesEvents completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Script failed:', error.message, error.stack);
    process.exit(1);
  }
})();