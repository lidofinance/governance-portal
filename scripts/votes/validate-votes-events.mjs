import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import { createPublicClient, http, decodeEventLog } from 'viem';
import { RPC_TIMEOUT_MS } from '../startup-checks/rpc.mjs';
import AragonVotingAbi from '../../abi/AragonVoting.abi.json' assert { type: 'json' };
import { VOTING_ADDRESSES } from '../../utils/votes/constants.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const INPUT_FILE_PATH = join(
  __dirname,
  '../../public/votes-events-data.json',
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const supportedChains = process.env.SUPPORTED_CHAINS
  ? process.env.SUPPORTED_CHAINS.split(',')
  : [];

const readEventsData = () => {
  try {
    const rawData = readFileSync(INPUT_FILE_PATH, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(
      `Error reading or parsing file at ${INPUT_FILE_PATH}:`,
      error.message,
    );
    throw new Error('Failed to load votes data file.');
  }
};

const setupClients = () => {
  const clients = {};

  for (const chainIdStr of supportedChains) {
    const chainId = Number(chainIdStr);
    const rpcUrl = process.env[`EL_RPC_URLS_${chainId}`];

    if (rpcUrl) {
      console.log(`Setting up RPC client for chain ${chainId}...`);
      clients[chainId] = createPublicClient({
        transport: http(rpcUrl, {
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

const validateStartVoteEvent = (voteId, startVoteEventData, receipt) => {
  const { address, topics } = startVoteEventData;
  let isValid = true;

  const log = receipt.logs.find(
    (l) =>
      l.address.toLowerCase() === address.toLowerCase() &&
      l.topics[0] === topics[0],
  );

  if (!log) {
    console.error(
      `[${voteId}] Event Validation: Did not find expected 'StartVote' log in receipt at address: ${address}`,
    );
    return false;
  }

  const decodedLog = decodeEventLog({
    abi: AragonVotingAbi,
    data: log.data,
    topics: log.topics,
  });

  const onChainCreator = decodedLog.args.creator;
  const onChainMetadata = decodedLog.args.metadata;
  const jsonCreator = startVoteEventData.args.creator;
  const jsonMetadata = startVoteEventData.args.metadata;

  if (onChainCreator.toLowerCase() !== jsonCreator.toLowerCase()) {
    console.error(
      `[${voteId}] Event Validation: Creator mismatch! JSON: ${jsonCreator}, RPC: ${onChainCreator}`,
    );
    isValid = false;
  }

  if (onChainMetadata.trim() !== jsonMetadata.trim()) {
    console.error(
      `[${voteId}] Event Validation: Metadata mismatch! JSON: "${jsonMetadata}", RPC: "${onChainMetadata}"`,
    );
    isValid = false;
  }

  if (isValid) {
    console.log(
      `[${voteId}] Event Validation: Creator & Metadata matched via transaction receipt`,
    );
  }

  return isValid;
};

const validateVoteDetails = async (
  voteId,
  voteData,
  client,
  votingAddress,
) => {
  let isValid = true;
  const jsonDetails = voteData.voteDetails;

  try {
    const rawVote = await client.readContract({
      address: votingAddress,
      abi: AragonVotingAbi,
      functionName: 'getVote',
      args: [BigInt(voteId)],
    });

    // rawVote tuple: [open, executed, startDate, snapshotBlock, ...]
    const onChainOpen = rawVote[0];
    const onChainExecuted = rawVote[1];
    const onChainStartDate = rawVote[2].toString();
    const onChainSnapshotBlock = rawVote[3].toString();

    if (onChainOpen !== jsonDetails.open) {
      console.error(
        `[${voteId}] Details Validation: open mismatch! JSON: ${jsonDetails.open}, RPC: ${onChainOpen}`,
      );
      isValid = false;
    }

    if (onChainExecuted !== jsonDetails.executed) {
      console.error(
        `[${voteId}] Details Validation: executed mismatch! JSON: ${jsonDetails.executed}, RPC: ${onChainExecuted}`,
      );
      isValid = false;
    }

    if (onChainStartDate !== jsonDetails.startDate.toString()) {
      console.error(
        `[${voteId}] Details Validation: startDate mismatch! JSON: ${jsonDetails.startDate}, RPC: ${onChainStartDate}`,
      );
      isValid = false;
    }

    if (onChainSnapshotBlock !== jsonDetails.snapshotBlock.toString()) {
      console.error(
        `[${voteId}] Details Validation: snapshotBlock mismatch! JSON: ${jsonDetails.snapshotBlock}, RPC: ${onChainSnapshotBlock}`,
      );
      isValid = false;
    }

    if (isValid) {
      console.log(
        `[${voteId}] Details Validation: Core contract storage matched`,
      );
    }

    return isValid;
  } catch (error) {
    console.error(
      `[${voteId}] Details Validation: Failed to read vote details from contract: ${error.message}`,
    );
    return false;
  }
};

const validateEvents = async (eventsData, clients) => {
  for (const chainIdStr in eventsData) {
    if (Object.prototype.hasOwnProperty.call(eventsData, chainIdStr)) {
      const chainId = Number(chainIdStr);
      const { votes } = eventsData[chainIdStr];
      const client = clients[chainId];

      console.log(`\n## Chain ID: ${chainId}`);

      if (!client) {
        console.warn(
          `Skipping validation: No RPC client available for chain ${chainId}.`,
        );
        continue;
      }

      const address = VOTING_ADDRESSES[chainId];
      if (!address) {
        console.warn(
          `Skipping validation: No voting address for chain ${chainId}.`,
        );
        continue;
      }

      const voteIds = Object.keys(votes)
        .map(Number)
        .sort((a, b) => a - b);

      if (voteIds.length === 0) {
        console.log('No votes found on this chain.');
        continue;
      }

      for (const voteId of voteIds) {
        const vote = votes[voteId];
        const startVoteEvent = vote.startVoteEvent;

        await sleep(1000);

        await validateVoteDetails(voteId, vote, client, address);

        if (startVoteEvent && startVoteEvent.transactionHash) {
          const txHash = startVoteEvent.transactionHash;

          try {
            const receipt = await client.getTransactionReceipt({
              hash: txHash,
            });

            if (receipt) {
              validateStartVoteEvent(voteId, startVoteEvent, receipt);
            } else {
              console.warn(
                `Could not retrieve receipt for Vote ${voteId} (TX: ${txHash}).`,
              );
            }
          } catch (error) {
            console.error(
              `Failed to fetch receipt for Vote ${voteId} (TX: ${txHash}): ${error.message}`,
            );
          }
        } else {
          console.warn(
            `Vote ${voteId}: Missing start vote event or transaction hash. Skipping receipt fetch.`,
          );
        }
      }
    }
  }
};

const main = async () => {
  try {
    const eventsData = readEventsData();
    const clients = setupClients();
    await validateEvents(eventsData, clients);

    process.exit(0);
  } catch (error) {
    console.error('Script execution failed:', error.message);
    process.exit(1);
  }
};

void main();
