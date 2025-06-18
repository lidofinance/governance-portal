import {
  ProposalCombinedData,
  ProposalDetails,
  SubmitProposalCall,
} from 'features/dual-governance/proposals/types';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Address, PublicClient } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import {
  calculateAverageBlockTime,
  estimateBlockRangeFromTimestamp,
} from 'utils/estimate-block-range';
import { findAbiItem } from 'utils/find-abi-item';
import { DualGovernance } from 'shared/blockchain/contracts';
import { ProposalSubmittedEvent } from 'generated/DualGovernanceAbi';

type Props = {
  proposalsCount: bigint;
  EPTContract: ReturnType<typeof useReadContract>;
  publicClient: PublicClient;
  governanceAddresses: Address[];
  chainId: CHAINS;
};

type ProposalDataResult = [ProposalDetails, SubmitProposalCall[]];

export const fetchProposals = async ({
  proposalsCount,
  EPTContract,
  publicClient,
  governanceAddresses,
}: Props): Promise<(ProposalCombinedData | null)[]> => {
  const proposalIds = Array.from({ length: Number(proposalsCount) }, (_, i) =>
    BigInt(i + 1),
  );

  const getProposalPromises = proposalIds.map(async (propId) => {
    try {
      const proposalData = (await EPTContract.readContract('getProposal', [
        propId,
      ])) as ProposalDataResult;

      const proposal: ProposalCombinedData = {
        proposalId: Number(propId),
        proposalDetails: {
          ...proposalData[0],
          calls: proposalData[1],
        },
      };

      return proposal;
    } catch (e) {
      console.error(`Failed to fetch proposal ${propId}:`, e);
      return null;
    }
  });

  const getProposalsData = await Promise.all(getProposalPromises);

  const proposalsData = getProposalsData.filter(
    (proposal): proposal is ProposalCombinedData => proposal !== null,
  );

  const timestamps = proposalsData.map((proposal) => ({
    id: proposal.proposalId,
    submittedAt: proposal.proposalDetails.submittedAt,
    scheduledAt: proposal.proposalDetails.scheduledAt,
  }));

  console.debug(`Fetching events for ${timestamps.length} proposals`);

  const allProposalIds = proposalsData.map((proposal) => proposal.proposalId);
  console.debug(`Fetching events for proposals: ${allProposalIds.join(', ')}`);

  const proposalsMap = new Map<number, ProposalCombinedData>();

  proposalsData.forEach((proposal) => {
    proposalsMap.set(proposal.proposalId, proposal);
  });

  const eventAbi = findAbiItem({
    abi: DualGovernance.abi,
    name: 'ProposalSubmitted',
    type: 'event',
  });

  const averageBlockTime = await calculateAverageBlockTime(publicClient);

  try {
    for (const proposal of proposalsData) {
      try {
        const { fromBlock, toBlock } = await estimateBlockRangeFromTimestamp(
          proposal.proposalDetails.submittedAt,
          2499n, // Half of the RPC getLogs limit
          averageBlockTime,
          publicClient,
        );

        // Fetch events from all governance addresses
        const eventPromises = governanceAddresses.map((address) =>
          publicClient.getLogs({
            address,
            event: eventAbi,
            fromBlock,
            toBlock,
            args: {
              proposalId: BigInt(proposal.proposalId),
            },
          }),
        );

        const eventsResults = await Promise.all(eventPromises);
        const events =
          eventsResults.flat() as unknown as ProposalSubmittedEvent[];

        if (events.length > 0) {
          proposalsMap.set(proposal.proposalId, {
            ...proposal,
            DGEvent: events[0],
          });
        }
      } catch (error) {
        console.error(
          `Error fetching events for proposal ${proposal.proposalId}:`,
          error,
        );
      }
    }
  } catch (error) {
    console.error(`Error fetching or processing events:`, error);
  }

  return proposalsData.map(
    (proposal) => proposalsMap.get(proposal.proposalId) || proposal,
  );
};
