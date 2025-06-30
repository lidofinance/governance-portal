import {
  ProposalCombinedData,
  ProposalDetails,
  SubmitProposalCall,
} from '../proposals/types';
import { isAragonProposal } from 'utils/proposals/is-aragon-proposal';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Address, Log, PublicClient } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import {
  calculateAverageBlockTime,
  estimateBlockRangeFromTimestamp,
} from 'utils/estimate-block-range';
import { findAbiItem } from 'utils/find-abi-item';
import { DualGovernance } from 'shared/blockchain/contracts';
import { ProposalSubmittedEvent } from 'generated/DualGovernanceAbi';
import { expandGetLogsSearchWindow } from '../../../utils/expand-get-logs-search-window';

type Props = {
  id: number;
  EPTContract: ReturnType<typeof useReadContract>;
  publicClient: PublicClient;
  governanceAddresses: Address[];
  chainId: CHAINS;
};

type ProposalDataResult = [ProposalDetails, SubmitProposalCall[]];

export const fetchProposal = async ({
  id,
  EPTContract,
  publicClient,
  governanceAddresses,
  chainId,
}: Props) => {
  const proposalId = BigInt(id);

  try {
    const proposalInfo = (await EPTContract.readContract('getProposal', [
      proposalId,
    ])) as ProposalDataResult;

    const result: ProposalCombinedData = {
      proposalId: id,
      proposalDetails: {
        ...proposalInfo[0],
        calls: proposalInfo[1],
      },
    };

    const eventAbi = findAbiItem({
      abi: DualGovernance.abi,
      name: 'ProposalSubmitted',
      type: 'event',
    });

    const averageBlockTime = await calculateAverageBlockTime(publicClient);

    try {
      const { fromBlock, toBlock } = await estimateBlockRangeFromTimestamp(
        proposalInfo[0].submittedAt,
        2499n, // Half of the RPC getLogs limit
        averageBlockTime,
        publicClient,
      );

      // Three ranges for log fetching to expand the search window up to ~15000 blocks
      const ranges = expandGetLogsSearchWindow({ fromBlock, toBlock });

      const eventPromises = governanceAddresses.flatMap((address) =>
        ranges.map((range) =>
          publicClient.getLogs({
            address,
            event: eventAbi,
            fromBlock: range.fromBlock,
            toBlock: range.toBlock,
            args: {
              proposalId: proposalId,
            },
          }),
        ),
      );

      const eventsResults = await Promise.all(eventPromises);
      const events =
        eventsResults.flat() as unknown as ProposalSubmittedEvent[];

      if (events.length > 0) {
        result.DGEvent = events[0];

        const voteId = await isAragonProposal({
          client: publicClient,
          proposalLog: events[0] as unknown as Log,
          chainId,
        });

        if (voteId) {
          result.voteId = Number(voteId);
        }

        return result;
      }
    } catch (error) {
      console.error(
        `Error fetching additional data for proposal ${id}:`,
        error,
      );
    }

    return result;
  } catch (error) {
    console.error(`Failed to fetch proposal with ID ${id}:`, error);
    throw new Error(`Failed to fetch proposal with ID ${id}`);
  }
};
