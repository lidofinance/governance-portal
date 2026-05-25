import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import { createPublicClient, http, decodeEventLog } from 'viem';
import { RPC_TIMEOUT_MS } from '../startup-checks/rpc.mjs';
import DualGovernanceAbi from '../../abi/DualGovernance.abi.json' assert { type: 'json' };
import EmergencyProtectedTimelockAbi from '../../abi/EmergencyProtectedTimelock.abi.json' assert { type: 'json' };
import { HISTORICAL_ADDRESSES } from '../../constants/historical-addresses.mjs';

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

const readChainData = (chainId) => {
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
    const chainData = readChainData(chainId);
    if (chainData) {
      eventsData[entry] = chainData;
    }
  }
  return eventsData;
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
        `⚠️ No RPC URL found for chain ${chainId}. This chain will be skipped for validation.`,
      );
    }
  }
  return clients;
};

const validateSubmissionEvent = (proposalId, submittedEventData, receipt) => {
  const { address, topics } = submittedEventData;
  let isValid = true;

  const log = receipt.logs.find(
    (l) =>
      l.address.toLowerCase() === address.toLowerCase() &&
      l.topics[0] === topics[0],
  );

  if (!log) {
    console.error(
      `[${proposalId}] ❌ Event Validation: Did not find expected 'ProposalSubmitted' log in receipt at address: ${address}`,
    );
    return false;
  }

  const decodedLog = decodeEventLog({
    abi: DualGovernanceAbi,
    data: log.data,
    topics: log.topics,
  });

  const onChainProposer = decodedLog.args.proposerAccount;
  const onChainMetadata = decodedLog.args.metadata;
  const jsonProposer = submittedEventData.args.proposerAccount;
  const jsonMetadata = submittedEventData.args.metadata;

  if (onChainProposer.toLowerCase() !== jsonProposer.toLowerCase()) {
    console.error(
      `[${proposalId}] ❌ Event Validation: Proposer mismatch! JSON: ${jsonProposer}, RPC: ${onChainProposer}`,
    );
    isValid = false;
  }

  if (onChainMetadata.trim() !== jsonMetadata.trim()) {
    console.error(
      `[${proposalId}] ❌ Event Validation: Metadata mismatch! JSON: "${jsonMetadata}", RPC: "${onChainMetadata}"`,
    );
    isValid = false;
  }

  if (isValid) {
    console.log(
      `[${proposalId}] ✅ Event Validation: Proposer & Metadata matched via transaction receipt`,
    );
  }

  return isValid;
};

const validateProposalDetails = async (
  proposalId,
  proposalData,
  client,
  contractAddress,
) => {
  let isValid = true;
  const jsonDetails = proposalData.details;

  try {
    const onChainDetails = await client.readContract({
      address: contractAddress,
      abi: EmergencyProtectedTimelockAbi,
      functionName: 'getProposalDetails',
      args: [BigInt(proposalId)],
    });

    const { executor, submittedAt, scheduledAt, status } = onChainDetails;

    if (executor.toLowerCase() !== jsonDetails.executor.toLowerCase()) {
      console.error(
        `[${proposalId}] ❌ Details Validation: Executor mismatch! JSON: ${jsonDetails.executor}, RPC: ${executor}`,
      );
      isValid = false;
    }

    if (submittedAt !== jsonDetails.submittedAt) {
      console.error(
        `[${proposalId}] ❌ Details Validation: SubmittedAt mismatch! JSON: ${jsonDetails.submittedAt}, RPC: ${submittedAt}`,
      );
      isValid = false;
    }

    if (scheduledAt !== jsonDetails.scheduledAt) {
      console.error(
        `[${proposalId}] ❌ Details Validation: ScheduledAt mismatch! JSON: ${jsonDetails.scheduledAt}, RPC: ${scheduledAt}`,
      );
      isValid = false;
    }

    if (status !== jsonDetails.status) {
      console.error(
        `[${proposalId}] ❌ Details Validation: Status mismatch! JSON: ${jsonDetails.status}, RPC: ${status}`,
      );
      isValid = false;
    }

    if (isValid) {
      console.log(
        `[${proposalId}] ✅ Details Validation: Core contract storage matched`,
      );
    }

    return isValid;
  } catch (error) {
    console.error(
      `[${proposalId}] ❌ Details Validation: Failed to read proposal details from contract: ${error.message}`,
    );
    return false;
  }
};

const validateEvents = async (eventsData, clients) => {
  for (const chainIdStr in eventsData) {
    if (Object.prototype.hasOwnProperty.call(eventsData, chainIdStr)) {
      const chainId = Number(chainIdStr);
      const { proposals } = eventsData[chainIdStr];
      const client = clients[chainId];

      console.log(`\n## Chain ID: ${chainId}`);

      if (!client) {
        console.warn(
          `⚠️ Skipping validation: No RPC client available for chain ${chainId}.`,
        );
        continue;
      }

      const proposalIds = Object.keys(proposals)
        .map(Number)
        .sort((a, b) => a - b);

      if (proposalIds.length === 0) {
        console.log('No proposals found on this chain.');
        continue;
      }

      for (const proposalId of proposalIds) {
        const proposal = proposals[proposalId];
        const submittedEvent = proposal.proposalSubmittedEvent;

        await sleep(1000);

        await validateProposalDetails(
          proposalId,
          proposal,
          client,
          contractAddresses[chainId].emergencyProtectedTimelock,
        );

        if (submittedEvent && submittedEvent.transactionHash) {
          const txHash = submittedEvent.transactionHash;

          try {
            const receipt = await client.getTransactionReceipt({
              hash: txHash,
            });

            if (receipt) {
              validateSubmissionEvent(proposalId, submittedEvent, receipt);
            } else {
              console.warn(
                `⚠️ Could not retrieve receipt for Proposal ${proposalId} (TX: ${txHash}).`,
              );
            }
          } catch (error) {
            console.error(
              `❌ Failed to fetch receipt for Proposal ${proposalId} (TX: ${txHash}): ${error.message}`,
            );
          }
        } else {
          console.warn(
            `⚠️ Proposal ${proposalId}: Missing submission event or transaction hash. Skipping receipt fetch.`,
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

    const hasMissingChunks = Object.values(eventsData).some(
      (chain) => chain.missingChunks && chain.missingChunks.length > 0,
    );
    if (hasMissingChunks) {
      console.error(
        '❌ Validation failed: manifest references chunks that are missing on disk.',
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
