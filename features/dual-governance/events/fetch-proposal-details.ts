import { Address, PublicClient } from 'viem';
import { findAbiItem } from 'utils/find-abi-item';
import { DualGovernance } from 'shared/blockchain/contracts';
import { ProposalSubmittedEvent } from 'generated/DualGovernanceAbi';
import invariant from 'tiny-invariant';
import { fetchLogsInParallelChunks } from 'utils/fetch-logs-in-parallel';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

/**
 * Fetches proposal details from multiple DualGovernance contract addresses
 */
export const fetchProposalDetailsFromMultipleAddresses = async ({
  client,
  addresses,
  fromBlock,
  toBlock,
  proposalId,
  chainId,
}: {
  client: PublicClient;
  addresses: Address[];
  fromBlock: bigint;
  toBlock: bigint;
  proposalId?: number;
  chainId?: CHAINS;
}): Promise<ProposalSubmittedEvent[]> => {
  try {
    const eventAbi = findAbiItem({
      abi: DualGovernance.abi,
      name: 'ProposalSubmitted',
      type: 'event',
    });

    invariant(client, 'Client must be provided');
    invariant(eventAbi, 'Event ABI not found');

    const args =
      proposalId !== undefined ? { proposalId: BigInt(proposalId) } : undefined;

    const logs = await fetchLogsInParallelChunks<ProposalSubmittedEvent>({
      client,
      address: addresses,
      event: eventAbi,
      fromBlock,
      toBlock,
      args,
      chainId,
      chunkCount: 3, // Fetch in 3 parallel chunks
      returnOnFirstMatch: proposalId !== undefined, // Early return if we're looking for a specific proposal
    });

    console.debug(
      `Fetched ${logs.length} logs for proposal ${proposalId || 'all'} from blocks ${fromBlock}-${toBlock}`,
    );

    return logs;
  } catch (error) {
    console.error(
      'Error fetching proposal details from multiple addresses:',
      error,
    );
    return [];
  }
};
