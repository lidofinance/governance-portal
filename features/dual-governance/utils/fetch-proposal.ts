import {
  ProposalCombinedData,
  ProposalDetails,
  SubmitProposalCall,
} from '../proposals/types';
import { fetchProposalDetailsFromMultipleAddresses } from '../events/fetch-proposal-details';
import { isAragonProposal } from 'utils/proposals/is-aragon-proposal';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Address, Log, PublicClient } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { CONTRACT_DEPLOYMENT_BLOCKS } from 'shared/blockchain/deployment-blocks';

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

    try {
      const latestBlock = await publicClient.getBlockNumber();

      const deploymentBlock =
        CONTRACT_DEPLOYMENT_BLOCKS[chainId]?.dualGovernance || 0n;

      const events = await fetchProposalDetailsFromMultipleAddresses({
        client: publicClient,
        addresses: governanceAddresses,
        fromBlock: deploymentBlock,
        toBlock: latestBlock,
        proposalId: id,
        chainId,
      });

      console.debug(`Found ${events.length} events for proposal ${id}`);

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
