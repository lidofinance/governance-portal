import {
  ProposalCombinedData,
  ProposalDetails,
  SubmitProposalCall,
} from 'features/dual-governance/proposals/types';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Address, PublicClient } from 'viem';
import { fetchProposalDetailsFromMultipleAddresses } from '../events/fetch-proposal-details';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { CONTRACT_DEPLOYMENT_BLOCKS } from 'shared/blockchain/deployment-blocks';

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
  chainId,
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

  const latestBlock = await publicClient.getBlockNumber();

  const deploymentBlock =
    CONTRACT_DEPLOYMENT_BLOCKS[chainId]?.dualGovernance || 0n;

  console.debug(
    `Using deployment block ${deploymentBlock} and latest block ${latestBlock}`,
  );

  const allProposalIds = proposalsData.map((proposal) => proposal.proposalId);
  console.debug(`Fetching events for proposals: ${allProposalIds.join(', ')}`);

  const proposalsMap = new Map<number, ProposalCombinedData>();

  proposalsData.forEach((proposal) => {
    proposalsMap.set(proposal.proposalId, proposal);
  });

  try {
    // Fetch all events in parallel
    const events = await fetchProposalDetailsFromMultipleAddresses({
      client: publicClient,
      addresses: governanceAddresses,
      fromBlock: deploymentBlock,
      toBlock: latestBlock,
      chainId,
    });

    console.debug(
      `Found ${events.length} events in total from block ${deploymentBlock} to ${latestBlock}`,
    );

    for (const event of events) {
      const proposalId = Number(event.args.proposalId);
      if (allProposalIds.includes(proposalId)) {
        const proposal = proposalsMap.get(proposalId);
        if (proposal) {
          proposalsMap.set(proposalId, {
            ...proposal,
            DGEvent: event,
          });
          console.debug(
            `Matched event to proposal ${proposalId} from block ${event.blockNumber}`,
          );
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching or processing events:`, error);
  }

  return proposalsData.map(
    (proposal) => proposalsMap.get(proposal.proposalId) || proposal,
  );
};
