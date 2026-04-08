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

        if (existingAddressData[voteData.id]) {
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
          console.debug(
            `    [vote ${voteData.id}] StartVote: ${startVoteEvent ? 'found' : 'not found'}`,
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
            const execStatus = executeVoteEvent
              ? 'found (block ' + executeVoteEvent.blockNumber + ')'
              : 'not found';
            console.debug(
              `    [vote ${voteData.id}] ExecuteVote: ${execStatus}`,
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
          console.debug(
            `    [vote ${voteData.id}] CastVote: ${castVoteData.castVoteEvents.length} votes, ${castVoteData.attemptCastVoteAsDelegateEvents.length} delegate events`,
          );

          return {
            id: voteData.id,
            data: {
              startVoteEvent,
              executeVoteEvent,
              castVoteEvents: castVoteData.castVoteEvents,
              attemptCastVoteAsDelegateEvents:
                castVoteData.attemptCastVoteAsDelegateEvents,
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
