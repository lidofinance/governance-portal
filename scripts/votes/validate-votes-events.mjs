import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import { createPublicClient, http, decodeEventLog } from 'viem';
import { RPC_TIMEOUT_MS } from '../startup-checks/rpc.mjs';
import AragonVotingAbi from '../../abi/AragonVoting.abi.json' assert { type: 'json' };

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
  const merged = {};
  for (const file of Object.values(manifest.chunks || {})) {
    const chunkPath = join(dir, file);
    if (!existsSync(chunkPath)) {
      continue;
    }
    Object.assign(merged, JSON.parse(readFileSync(chunkPath, 'utf8')));
  }
  return merged;
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
      console.log(`Setting up RPC client for chain ${chainId}...`);
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

const validateStartVoteEvent = (
  voteId,
  startVoteEventData,
  receipt,
  votingAddress,
) => {
  let isValid = true;

  let decodedLog = null;
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
        decoded.eventName === 'StartVote' &&
        String(decoded.args.voteId) === String(voteId)
      ) {
        decodedLog = decoded;
        break;
      }
    } catch {
      // Log from another contract/event — skip.
    }
  }

  if (!decodedLog) {
    console.error(
      `[${voteId}] Event Validation: No matching 'StartVote' log in receipt for ${votingAddress}`,
    );
    return false;
  }

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

const validateVoteDetails = async (voteId, voteData, client, votingAddress) => {
  let isValid = true;
  const jsonDetails = voteData.voteDetails;

  try {
    const rawVote = await client.readContract({
      address: votingAddress,
      abi: AragonVotingAbi,
      functionName: 'getVote',
      args: [BigInt(voteId)],
    });

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

const validateAddress = async (chainId, votingAddress, votes, client) => {
  console.log(`\n### Voting contract: ${votingAddress}`);

  const voteIds = Object.keys(votes)
    .map(Number)
    .sort((first, second) => first - second);

  if (voteIds.length === 0) {
    console.log('No votes found.');
    return;
  }

  for (const voteId of voteIds) {
    const vote = votes[voteId];
    const startVoteEvent = vote.startVoteEvent;

    await sleep(1000);

    await validateVoteDetails(voteId, vote, client, votingAddress);

    if (startVoteEvent && startVoteEvent.transactionHash) {
      const txHash = startVoteEvent.transactionHash;
      try {
        const receipt = await client.getTransactionReceipt({ hash: txHash });
        if (receipt) {
          validateStartVoteEvent(
            voteId,
            startVoteEvent,
            receipt,
            votingAddress,
          );
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
};

const main = async () => {
  try {
    const clients = setupClients();

    for (const chainIdStr of supportedChains) {
      const chainId = Number(chainIdStr);
      const client = clients[chainId];

      console.log(`\n## Chain ID: ${chainId}`);

      if (!client) {
        console.warn(
          `Skipping validation: No RPC client available for chain ${chainId}.`,
        );
        continue;
      }

      const addresses = listAddressDirs(chainId);
      if (addresses.length === 0) {
        console.log('No address directories found.');
        continue;
      }

      for (const votingAddress of addresses) {
        const votes = readAddressVotes(chainId, votingAddress);
        if (!votes) {
          console.log(`No manifest for ${votingAddress}`);
          continue;
        }
        await validateAddress(chainId, votingAddress, votes, client);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Script execution failed:', error.message);
    process.exit(1);
  }
};

void main();