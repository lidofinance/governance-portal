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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serializeBigInt = (key, value) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
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
      phase: rawVote[10],
      canExecute,
    };
  } catch (error) {
    console.error(`Failed to fetch vote ${voteId}:`, error.message);
    return null;
  }
};

/**
 * A vote is terminal (events won't change) when:
 * - executed === true (enacted)
 * - open === false && phase === 2 (Closed — rejected/expired)
 */
const isVoteTerminal = (voteData) => {
  // phase 2 = Closed
  return voteData.executed || (!voteData.open && voteData.phase === 2);
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
    console.debug(
      'Loaded existing votes-events-data.json for incremental update',
    );
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

    const votingAddress = chainVotingAddresses[chainId];

    const votesLength = await fetchVotesLength(
      clients[chainId],
      votingAddress,
    );

    if (votesLength === null || votesLength === undefined) {
      console.warn(
        `Could not obtain votes count for chain ${chainId}, skipping.`,
      );
      eventsData[chainId] = { votes: {} };
      continue;
    }

    const votesCount = Number(votesLength);
    console.debug(`Found ${votesCount} votes on chain ${chainId}`);

    if (votesCount === 0) {
      eventsData[chainId] = { votes: {} };
      continue;
    }

    // Vote IDs are 0-indexed
    const voteIds = Array.from({ length: votesCount }, (_, i) => i);

    console.debug(`Fetching vote data for chain ${chainId}...`);
    const voteDataResults = await Promise.allSettled(
      voteIds.map((id) =>
        fetchVoteData(clients[chainId], votingAddress, id),
      ),
    );

    const allVoteData = [];
    voteDataResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        allVoteData.push(result.value);
      } else if (result.status === 'rejected') {
        console.warn(
          `Failed to fetch vote data for ID ${voteIds[index]} on chain ${chainId}:`,
          result.reason.message,
        );
      }
    });

    console.debug(
      `Successfully fetched ${allVoteData.length} vote data entries for chain ${chainId}`,
    );

    const existingChainData = existingData[chainId]?.votes ?? {};
    eventsData[chainId] = { votes: { ...existingChainData } };

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const processVote = async (voteData) => {
      if (!voteData) {
        return null;
      }

      const cached = existingChainData[voteData.id];
      if (cached && isVoteTerminal(voteData)) {
        console.debug(
          `Vote ${voteData.id} is terminal and already cached, skipping`,
        );
        return null;
      }

      console.debug(
        `Processing event fetches for vote ${voteData.id} on chain ${chainId}...`,
      );

      try {
        const snapshotBlock = BigInt(voteData.snapshotBlock);

        const startVoteEvent = await fetchStartVoteEvent(
          voteData.id,
          snapshotBlock,
          votingAddress,
          clients[chainId],
        );

        let executeVoteEvent = null;
        if (voteData.executed) {
          executeVoteEvent = await fetchExecuteVoteEvent(
            voteData.id,
            snapshotBlock,
            votingAddress,
            clients[chainId],
          );
        }

        // Only fetch cast vote events for terminal votes (active votes change)
        let castVoteData = null;
        if (isVoteTerminal(voteData)) {
          const executeBlock = executeVoteEvent?.blockNumber
            ? BigInt(executeVoteEvent.blockNumber)
            : null;

          castVoteData = await fetchCastVoteEvents(
            voteData.id,
            snapshotBlock,
            executeBlock,
            votingAddress,
            clients[chainId],
          );
        }

        return {
          id: voteData.id,
          data: {
            startVoteEvent,
            executeVoteEvent,
            castVoteEvents: castVoteData?.castVoteEvents ?? null,
            attemptCastVoteAsDelegateEvents:
              castVoteData?.attemptCastVoteAsDelegateEvents ?? null,
            voteDetails: {
              id: voteData.id,
              open: voteData.open,
              executed: voteData.executed,
              startDate: voteData.startDate,
              snapshotBlock: voteData.snapshotBlock,
              phase: voteData.phase,
            },
          },
        };
      } catch (error) {
        console.error(
          `Error fetching events for vote ${voteData.id} on chain ${chainId}:`,
          error.message,
          error.stack,
        );
        return null;
      }
    };

    console.debug(
      `Processing ${allVoteData.length} votes sequentially for chain ${chainId}...`,
    );

    for (const [index, voteData] of allVoteData.entries()) {
      console.debug(
        `Processing vote ${index + 1}/${allVoteData.length} (ID: ${voteData.id}) on chain ${chainId}`,
      );
      try {
        const result = await processVote(voteData);
        if (result) {
          const { id, data } = result;
          eventsData[chainId].votes[id] = data;
        }
      } catch (error) {
        console.error(
          `A critical error occurred processing vote ${voteData.id} on chain ${chainId}:`,
          error.message,
          error.stack,
        );
      }
    }
    console.debug(`All votes for chain ${chainId} processed.`);
  }

  console.debug('Votes events build completed successfully');
  console.debug('Built data for chains:', Object.keys(eventsData));

  writeFileSync(outputPath, JSON.stringify(eventsData, serializeBigInt, 2));
  console.debug(`eventsData written to ${outputPath}`);

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
