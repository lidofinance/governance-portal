import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import { createPublicClient, http, decodeEventLog } from 'viem';
import { RPC_TIMEOUT_MS } from '../startup-checks/rpc.mjs';
import AragonVotingAbi from '../../abi/AragonVoting.abi.json' assert { type: 'json' };
import { fetchCastVoteEvents } from '../../utils/votes/fetch-vote-events.mjs';
import {
  APPROX_BLOCK_TIME_SECONDS,
  VOTE_END_BLOCK_BUFFER,
} from '../../utils/votes/constants.mjs';
import { diffEntry } from '../cache-entry-diff.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_ROOT = join(__dirname, '../../public/votes-events');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const supportedChains = process.env.SUPPORTED_CHAINS
  ? process.env.SUPPORTED_CHAINS.split(',')
  : [];

const readAddressVotes = (chainId, votingAddress) => {
  const dir = join(OUTPUT_ROOT, String(chainId), votingAddress);
  const manifestFile = join(dir, 'manifest.json');
  if (!existsSync(manifestFile)) {
    return null;
  }
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
  const votesById = {};
  for (const file of Object.values(manifest.chunks || {})) {
    const chunkPath = join(dir, file);
    if (!existsSync(chunkPath)) {
      continue;
    }
    Object.assign(votesById, JSON.parse(readFileSync(chunkPath, 'utf8')));
  }
  return votesById;
};

const listAddressDirs = (chainId) => {
  const dir = join(OUTPUT_ROOT, String(chainId));
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir).filter((entry) =>
    statSync(join(dir, entry)).isDirectory(),
  );
};

const setupClients = () => {
  const clients = {};
  for (const chainIdStr of supportedChains) {
    const chainId = Number(chainIdStr);
    const rpcUrls = process.env[`EL_RPC_URLS_${chainId}`];
    if (rpcUrls) {
      console.info(`Setting up RPC client for chain ${chainId}...`);
      clients[chainId] = createPublicClient({
        transport: http(rpcUrls.split(',')[0], {
          retryCount: 3,
          timeout: RPC_TIMEOUT_MS,
        }),
      });
    } else {
      console.warn(
        `No RPC URL found for chain ${chainId}. This chain will be skipped for validation.`,
      );
    }
  }
  return clients;
};

const fetchVotePhaseBlocks = async (client, votingAddress) => {
  try {
    const [voteTime, objectionPhaseTime] = await Promise.all([
      client.readContract({
        address: votingAddress,
        abi: AragonVotingAbi,
        functionName: 'voteTime',
      }),
      client
        .readContract({
          address: votingAddress,
          abi: AragonVotingAbi,
          functionName: 'objectionPhaseTime',
        })
        .catch(() => 0n),
    ]);
    const totalSeconds = BigInt(voteTime) + BigInt(objectionPhaseTime);
    return totalSeconds / APPROX_BLOCK_TIME_SECONDS + VOTE_END_BLOCK_BUFFER;
  } catch (error) {
    console.warn(
      `Failed to read voteTime/objectionPhaseTime at ${votingAddress}: ${error.message}. Falling back to 100000 block window.`,
    );
    return 100000n;
  }
};

const collectDetailsDiffs = async (voteId, voteData, client, votingAddress) => {
  try {
    const [rawVote, canExecute] = await Promise.all([
      client.readContract({
        address: votingAddress,
        abi: AragonVotingAbi,
        functionName: 'getVote',
        args: [BigInt(voteId)],
      }),
      client.readContract({
        address: votingAddress,
        abi: AragonVotingAbi,
        functionName: 'canExecute',
        args: [BigInt(voteId)],
      }),
    ]);

    const chainVoteDetails = {
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

    const diffs = diffEntry(chainVoteDetails, voteData.voteDetails, {
      ignorePaths: ['canExecute'],
    }).map((message) => `voteDetails.${message}`);

    return { diffs, chainVoteDetails };
  } catch (error) {
    return { diffs: [`voteDetails: read failed: ${error.message}`], chainVoteDetails: null };
  }
};

const findVotingLog = (receipt, votingAddress, eventName, voteId) => {
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== votingAddress.toLowerCase()) {
      continue;
    }
    try {
      const decoded = decodeEventLog({
        abi: AragonVotingAbi,
        data: log.data,
        topics: log.topics,
      });
      if (
        decoded.eventName === eventName &&
        String(decoded.args.voteId) === String(voteId)
      ) {
        return decoded;
      }
    } catch {
      // log from another contract/event — skip
    }
  }
  return null;
};

const collectStartVoteDiffs = async (voteId, cachedEvent, client, votingAddress) => {
  if (!cachedEvent.transactionHash) {
    return [`startVoteEvent: missing transactionHash`];
  }

  let receipt;
  try {
    receipt = await client.getTransactionReceipt({
      hash: cachedEvent.transactionHash,
    });
  } catch (error) {
    return [`startVoteEvent: receipt fetch failed: ${error.message}`];
  }

  const decoded = findVotingLog(receipt, votingAddress, 'StartVote', voteId);
  if (!decoded) {
    return [
      `startVoteEvent: no matching StartVote in receipt ${cachedEvent.transactionHash}`,
    ];
  }

  const diffs = [];

  if (BigInt(receipt.blockNumber) !== BigInt(cachedEvent.blockNumber)) {
    diffs.push(
      `startVoteEvent.blockNumber: ${cachedEvent.blockNumber} !== ${receipt.blockNumber}`,
    );
  }

  if (
    decoded.args.creator.toLowerCase() !==
    String(cachedEvent.args.creator).toLowerCase()
  ) {
    diffs.push(
      `startVoteEvent.args.creator: ${cachedEvent.args.creator} !== ${decoded.args.creator}`,
    );
  }

  if (String(decoded.args.metadata).trim() !== String(cachedEvent.args.metadata).trim()) {
    diffs.push(
      `startVoteEvent.args.metadata: ${JSON.stringify(cachedEvent.args.metadata)} !== ${JSON.stringify(decoded.args.metadata)}`,
    );
  }

  return diffs;
};

const collectExecuteVoteDiffs = async (voteId, cachedEvent, client, votingAddress) => {
  if (!cachedEvent.transactionHash) {
    return [`executeVoteEvent: missing transactionHash`];
  }

  let receipt;
  try {
    receipt = await client.getTransactionReceipt({
      hash: cachedEvent.transactionHash,
    });
  } catch (error) {
    return [`executeVoteEvent: receipt fetch failed: ${error.message}`];
  }

  const decoded = findVotingLog(receipt, votingAddress, 'ExecuteVote', voteId);
  if (!decoded) {
    return [
      `executeVoteEvent: no matching ExecuteVote in receipt ${cachedEvent.transactionHash}`,
    ];
  }

  const diffs = [];

  if (BigInt(receipt.blockNumber) !== BigInt(cachedEvent.blockNumber)) {
    diffs.push(
      `executeVoteEvent.blockNumber: ${cachedEvent.blockNumber} !== ${receipt.blockNumber}`,
    );
  }

  if (cachedEvent.executedAt != null) {
    try {
      const block = await client.getBlock({
        blockNumber: BigInt(cachedEvent.blockNumber),
      });
      if (Number(block.timestamp) !== Number(cachedEvent.executedAt)) {
        diffs.push(
          `executeVoteEvent.executedAt: ${cachedEvent.executedAt} !== ${block.timestamp}`,
        );
      }
    } catch (error) {
      diffs.push(`executeVoteEvent.executedAt: block fetch failed: ${error.message}`);
    }
  }

  return diffs;
};

const flattenIndividualVotes = (voteEvents) => {
  const individualVotes = [];
  for (const event of voteEvents || []) {
    if (Array.isArray(event.delegatedVotes)) {
      for (const nested of event.delegatedVotes) {
        individualVotes.push({
          voter: nested.voter,
          supports: nested.supports,
          stake: nested.stake,
        });
      }
    } else {
      individualVotes.push({
        voter: event.voter,
        supports: event.supports,
        stake: event.stake,
      });
    }
  }
  return individualVotes;
};

const isCastVoteMoreRecent = (candidate, existing) => {
  if (candidate.blockNumber > existing.blockNumber) {
    return true;
  }
  if (candidate.blockNumber === existing.blockNumber) {
    return (candidate.transactionIndex ?? 0) > (existing.transactionIndex ?? 0);
  }
  return false;
};

const collectVoteEventsDiffs = async (
  voteId,
  voteData,
  chainVoteDetails,
  client,
  votingAddress,
  votePhaseBlocks,
) => {
  const diffs = [];
  const individualVotes = flattenIndividualVotes(voteData.voteEvents);

  let yeaSum = 0n;
  let naySum = 0n;
  const cacheByVoter = new Map();
  for (const individualVote of individualVotes) {
    const key = individualVote.voter.toLowerCase();
    if (cacheByVoter.has(key)) {
      diffs.push(`voteEvents: duplicate voter ${individualVote.voter} in cache`);
    }
    cacheByVoter.set(key, individualVote);
    const stake = BigInt(individualVote.stake);
    if (individualVote.supports) {
      yeaSum += stake;
    } else {
      naySum += stake;
    }
  }

  if (chainVoteDetails) {
    if (yeaSum !== BigInt(chainVoteDetails.yea)) {
      diffs.push(
        `voteEvents: yea sum ${yeaSum} !== getVote.yea ${chainVoteDetails.yea}`,
      );
    }
    if (naySum !== BigInt(chainVoteDetails.nay)) {
      diffs.push(
        `voteEvents: nay sum ${naySum} !== getVote.nay ${chainVoteDetails.nay}`,
      );
    }
  }

  let castVoteData;
  try {
    const snapshotBlock = BigInt(voteData.voteDetails.snapshotBlock);
    castVoteData = await fetchCastVoteEvents(
      voteId,
      snapshotBlock,
      snapshotBlock + votePhaseBlocks,
      votingAddress,
      client,
    );
  } catch (error) {
    diffs.push(`voteEvents: CastVote fetch failed: ${error.message}`);
    return diffs;
  }

  const latestByVoter = new Map();

  for (const event of castVoteData.castVoteEvents) {
    const key = event.args.voter.toLowerCase();
    const existing = latestByVoter.get(key);
    if (!existing || isCastVoteMoreRecent(event, existing)) {
      latestByVoter.set(key, event);
    }
  }

  for (const [voter, raw] of latestByVoter) {
    const individualVote = cacheByVoter.get(voter);
    if (!individualVote) {
      diffs.push(`voteEvents: voter ${raw.args.voter} on-chain but missing from cache`);
      continue;
    }
    if (Boolean(individualVote.supports) !== Boolean(raw.args.supports)) {
      diffs.push(
        `voteEvents[${raw.args.voter}].supports: ${individualVote.supports} !== ${raw.args.supports}`,
      );
    }
    if (String(individualVote.stake) !== raw.args.stake.toString()) {
      diffs.push(
        `voteEvents[${raw.args.voter}].stake: ${individualVote.stake} !== ${raw.args.stake}`,
      );
    }
  }

  for (const [voter, individualVote] of cacheByVoter) {
    if (!latestByVoter.has(voter)) {
      diffs.push(`voteEvents: voter ${individualVote.voter} in cache but not in chain logs`);
    }
  }

  return diffs;
};

const validateAddress = async (votingAddress, votes, client) => {
  console.info(`\n### Voting contract: ${votingAddress}`);

  const voteIds = Object.keys(votes)
    .map(Number)
    .sort((first, second) => first - second);

  if (voteIds.length === 0) {
    console.info('No votes found.');
    return false;
  }

  const votePhaseBlocks = await fetchVotePhaseBlocks(client, votingAddress);

  let hasFailures = false;

  for (const voteId of voteIds) {
    await sleep(1000);

    const vote = votes[voteId];
    const { diffs: detailsDiffs, chainVoteDetails } = await collectDetailsDiffs(
      voteId,
      vote,
      client,
      votingAddress,
    );

    const diffs = [...detailsDiffs];

    if (chainVoteDetails?.open) {
      diffs.push('vote is open on-chain but present in cache (should be closed)');
    }

    if (vote.startVoteEvent) {
      diffs.push(
        ...(await collectStartVoteDiffs(
          voteId,
          vote.startVoteEvent,
          client,
          votingAddress,
        )),
      );
    } else {
      diffs.push('startVoteEvent: required but missing in cache');
    }

    if (chainVoteDetails?.executed && !vote.executeVoteEvent) {
      diffs.push('executeVoteEvent: required (vote executed) but missing in cache');
    }

    if (vote.executeVoteEvent) {
      diffs.push(
        ...(await collectExecuteVoteDiffs(
          voteId,
          vote.executeVoteEvent,
          client,
          votingAddress,
        )),
      );
    }

    diffs.push(
      ...(await collectVoteEventsDiffs(
        voteId,
        vote,
        chainVoteDetails,
        client,
        votingAddress,
        votePhaseBlocks,
      )),
    );

    if (diffs.length === 0) {
      console.info(`[${voteId}] ✅ Full entry matched on-chain`);
    } else {
      hasFailures = true;
      console.error(`[${voteId}] ❌ ${diffs.length} mismatch(es):`);
      for (const message of diffs) {
        console.error(`    - ${message}`);
      }
    }
  }

  return hasFailures;
};

const main = async () => {
  try {
    const clients = setupClients();
    let hasFailures = false;

    for (const chainIdStr of supportedChains) {
      const chainId = Number(chainIdStr);
      const client = clients[chainId];

      console.info(`\n## Chain ID: ${chainId}`);

      if (!client) {
        console.warn(
          `Skipping validation: No RPC client available for chain ${chainId}.`,
        );
        continue;
      }

      const addresses = listAddressDirs(chainId);
      if (addresses.length === 0) {
        console.info('No address directories found.');
        continue;
      }

      for (const votingAddress of addresses) {
        const votes = readAddressVotes(chainId, votingAddress);
        if (!votes) {
          console.info(`No manifest for ${votingAddress}`);
          continue;
        }
        if (await validateAddress(votingAddress, votes, client)) {
          hasFailures = true;
        }
      }
    }

    if (hasFailures) {
      console.error('❌ Validation failed: cached entries diverge from on-chain.');
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('Script execution failed:', error.message);
    process.exit(1);
  }
};

void main();
