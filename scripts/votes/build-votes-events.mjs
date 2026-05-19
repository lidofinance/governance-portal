import { createPublicClient, http } from 'viem';
import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import { RPC_TIMEOUT_MS } from '../startup-checks/rpc.mjs';
import AragonVotingAbi from '../../abi/AragonVoting.abi.json' assert { type: 'json' };
import { VOTING_ADDRESSES } from '../../utils/votes/constants.mjs';
import {
  fetchStartVoteEvent,
  fetchExecuteVoteEvent,
  fetchCastVoteEvents,
} from '../../utils/votes/fetch-vote-events.mjs';
import { fetchIpfsDescription } from '../../utils/votes/fetch-ipfs-description.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serializeBigInt = (key, value) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

/**
 * A vote is terminal (archived) once voting has closed (`open === false`).
 * At that point cast votes, metadata and start/execute events are frozen.
 * `executed` / `canExecute` may still flip if someone enacts a "Passed
 * waiting for enact" vote, but that window is bounded by the cache
 * rebuild cadence and worth the trade-off to keep the dashboard fully
 * served from JSON.
 */
const isVoteTerminal = (voteData) => !voteData.open;

// Skip a vote only when its CACHED entry is itself final and complete,
// not just because an entry exists — otherwise a vote enacted after being
// cached (open=false → executed) keeps stale data forever.
const canSkip = (cached) => {
  if (!cached?.voteDetails || !cached.startVoteEvent) {
    return false;
  }
  // executed → needs the ExecuteVote event; else → closed & unexecutable
  if (cached.voteDetails.executed) {
    return Boolean(cached.executeVoteEvent);
  }
  return (
    cached.voteDetails.open === false &&
    cached.voteDetails.canExecute === false
  );
};

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

/**
 * Pre-process CastVote and AttemptCastVoteAsDelegate events into the
 * UI VoteEvent[] shape. Mirrors the runtime logic in
 * features/vote/utils/get-cast-vote-events.ts so the client doesn't
 * have to redo this work.
 */
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
      for (const v of [
        ...(existingDelegatedVote.delegatedVotes ?? []),
        ...nestedVotes,
      ]) {
        merged.set(v.voter.toLowerCase(), v);
      }
      delegatedVotes = [...merged.values()];
    }

    const delegatedStake = delegatedVotes.reduce(
      (acc, v) => acc + v.stake,
      0n,
    );

    const sortedVotes = delegatedVotes.sort((a, b) =>
      a.stake > b.stake ? -1 : 1,
    );

    delegatedVotesMap[delegateKey] = {
      voter: delegateEvent.args.delegate,
      supports: delegateSupports,
      stake: delegatedStake,
      delegatedVotes: sortedVotes,
    };
  }

  return [
    ...Object.values(votesMap).map((v) => ({
      voter: v.voter,
      supports: v.supports,
      stake: v.stake,
    })),
    ...Object.values(delegatedVotesMap),
  ].sort((a, b) => (a.stake > b.stake ? -1 : 1));
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

    // rawVote tuple: [open, executed, startDate, snapshotBlock, supportRequired,
    //   minAcceptQuorum, yea, nay, votingPower, script, phase]
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

export const buildVotesEvents = async () => {
  console.debug('Starting votes events build...');

  const supportedChains = process.env.SUPPORTED_CHAINS
    ? process.env.SUPPORTED_CHAINS.split(',')
    : [];
  console.debug(`Building for chains: ${supportedChains.join(', ') || 'None'}`);

  if (supportedChains.length === 0) {
    console.warn('No SUPPORTED_CHAINS environment variable set. Aborting.');
    return {};
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
  console.debug(
    'Loaded voting addresses for chains:',
    Object.keys(chainVotingAddresses),
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

  const outputPath = join(__dirname, '../../public/votes-events-data.json');

  let existingData = {};
  try {
    existingData = JSON.parse(readFileSync(outputPath, 'utf8'));
    console.debug('Loaded existing votes-events-data.json');
  } catch {
    console.debug('No existing votes-events-data.json found, starting fresh');
  }

  const eventsData = {};

  for (const chainIdStr of supportedChains) {
    const chainId = Number(chainIdStr);

    if (!clients[chainId]) {
      console.debug(
        `No RPC client available for chain ${chainId}, skipping...`,
      );
      continue;
    }

    if (!chainVotingAddresses[chainId]) {
      console.debug(
        `No voting address configured for chain ${chainId}, skipping...`,
      );
      continue;
    }

    console.debug(`Processing chain ${chainId}...`);

    const addresses = chainVotingAddresses[chainId];
    const existingChainData = existingData[chainId] ?? {};
    eventsData[chainId] = {};

    for (const votingAddress of addresses) {
      console.debug(`  Processing voting contract ${votingAddress}...`);

      const votesLength = await fetchVotesLength(
        clients[chainId],
        votingAddress,
      );

      if (votesLength === null || votesLength === undefined) {
        console.warn(
          `Could not obtain votes count for ${votingAddress} on chain ${chainId}, skipping.`,
        );
        if (!eventsData[chainId][votingAddress]) {
          eventsData[chainId][votingAddress] = { votes: {} };
        }
        continue;
      }

      const votesCount = Number(votesLength);
      console.debug(`  Found ${votesCount} votes at ${votingAddress}`);

      if (votesCount === 0) {
        if (!eventsData[chainId][votingAddress]) {
          eventsData[chainId][votingAddress] = { votes: {} };
        }
        continue;
      }

      // Vote IDs are 0-indexed
      const voteIds = Array.from({ length: votesCount }, (_, i) => i);

      console.debug(`  Fetching vote data for ${votingAddress}...`);
      const voteDataResults = await Promise.allSettled(
        voteIds.map((id) => fetchVoteData(clients[chainId], votingAddress, id)),
      );

      const allVoteData = [];
      voteDataResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          allVoteData.push(result.value);
        } else if (result.status === 'rejected') {
          console.warn(
            `Failed to fetch vote data for ID ${voteIds[index]} at ${votingAddress}:`,
            result.reason.message,
          );
        }
      });

      console.debug(
        `  Successfully fetched ${allVoteData.length} vote data entries`,
      );

      const existingAddressData =
        existingChainData[votingAddress]?.votes ?? {};
      eventsData[chainId][votingAddress] = {
        votes: { ...existingAddressData },
      };

      // eslint-disable-next-line unicorn/consistent-function-scoping
      const processVote = async (voteData) => {
        if (!voteData) {
          return null;
        }

        const cachedEntry = existingAddressData[voteData.id];

        if (cachedEntry && canSkip(cachedEntry)) {
          // Final + complete. Only the IPFS description may still be
          // missing — back-fill it cheaply without re-scanning events.
          if (cachedEntry.description == null) {
            const description = await fetchIpfsDescription(
              cachedEntry.startVoteEvent?.args?.metadata ?? '',
            );
            if (description != null) {
              console.debug(
                `    [vote ${voteData.id}] Back-filled description (${description.length} chars).`,
              );
              return {
                id: voteData.id,
                data: { ...cachedEntry, description },
              };
            }
          }
          console.debug(
            `    [vote ${voteData.id}] Cached + complete (executed=${cachedEntry.voteDetails.executed}), skipping.`,
          );
          return null;
        }

        if (cachedEntry) {
          console.debug(
            `    [vote ${voteData.id}] Cached but incomplete (e.g. enacted after caching), re-fetching.`,
          );
        }

        if (!isVoteTerminal(voteData)) {
          console.debug(
            `    [vote ${voteData.id}] Not terminal (open=${voteData.open}, executed=${voteData.executed}, canExecute=${voteData.canExecute}), skipping.`,
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
            clients[chainId],
          );

          let executeVoteEvent = null;
          if (voteData.executed) {
            console.debug(`    [vote ${voteData.id}] Fetching ExecuteVote...`);
            executeVoteEvent = await fetchExecuteVoteEvent(
              voteData.id,
              snapshotBlock,
              votingAddress,
              clients[chainId],
            );
          }

          const executeBlock = executeVoteEvent?.blockNumber
            ? BigInt(executeVoteEvent.blockNumber)
            : null;

          console.debug(
            `    [vote ${voteData.id}] Fetching CastVote events...`,
          );
          const castVoteData = await fetchCastVoteEvents(
            voteData.id,
            snapshotBlock,
            executeBlock,
            votingAddress,
            clients[chainId],
          );

          const voteEvents = processCastVoteEvents(
            castVoteData.castVoteEvents,
            castVoteData.attemptCastVoteAsDelegateEvents,
          );

          console.debug(
            `    [vote ${voteData.id}] Processed: ${voteEvents.length} vote entries (from ${castVoteData.castVoteEvents.length} raw votes, ${castVoteData.attemptCastVoteAsDelegateEvents.length} delegate events)`,
          );

          console.debug(`    [vote ${voteData.id}] Fetching IPFS description...`);
          const description = await fetchIpfsDescription(
            startVoteEvent?.args?.metadata ?? '',
          );

          return {
            id: voteData.id,
            data: {
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
            },
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

      console.debug(
        `  Processing ${allVoteData.length} votes sequentially for ${votingAddress}...`,
      );

      for (const [index, voteData] of allVoteData.entries()) {
        console.debug(
          `  Processing vote ${index + 1}/${allVoteData.length} (ID: ${voteData.id})`,
        );
        try {
          const result = await processVote(voteData);
          if (result) {
            const { id, data } = result;
            eventsData[chainId][votingAddress].votes[id] = data;
            writeFileSync(
              outputPath,
              JSON.stringify(eventsData, serializeBigInt, 2),
            );
          }
        } catch (error) {
          console.error(
            `A critical error occurred processing vote ${voteData.id} at ${votingAddress}:`,
            error.message,
            error.stack,
          );
        }
      }
      console.debug(`  All votes for ${votingAddress} processed.`);
    }
    console.debug(`All voting contracts for chain ${chainId} processed.`);
  }

  console.debug('Votes events build completed successfully');
  console.debug('Built data for chains:', Object.keys(eventsData));

  return eventsData;
};

void (async () => {
  try {
    await buildVotesEvents();
    console.log('Script buildVotesEvents completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Script failed:', error.message, error.stack);
    process.exit(1);
  }
})();
