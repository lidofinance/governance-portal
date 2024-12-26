import invariant from 'tiny-invariant';
import { findAbiItem } from 'utils/find-abi-item';
import {
  DualGovernance,
  EmergencyProtectedTimelock,
  Voting,
} from 'shared/blockchain/contracts';
import {
  ProposalDualGovernanceDetails,
  ProposalDualGovernanceLog,
  ProposalLog,
} from 'features/dual-governance/proposals/types';
import { usePublicClient } from 'wagmi';
import { CHAINS } from '@lido-sdk/constants';
import { Address } from 'viem';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';

type Props = {
  proposalId?: bigint;
  client: ReturnType<typeof usePublicClient>;
  chainId: CHAINS;
  EPTContract?: ReturnType<typeof useReadContract>;
};

const EVENT_NAME = 'ProposalSubmitted';

const getDGEvents = async ({
  proposalId,
  client,
  chainId,
}: Props): Promise<ProposalDualGovernanceLog[]> => {
  const eventAbi = findAbiItem({
    abi: DualGovernance.abi,
    name: EVENT_NAME,
    type: 'event',
  });

  invariant(client, 'Client must be provided');
  invariant(eventAbi, 'Event ABI not found');

  try {
    const contractAddress = DualGovernance.chainAddressMap[chainId];
    const proposerAccount = Voting.chainAddressMap[chainId];

    invariant(proposerAccount, 'Contract not found');

    let args = <{ proposerAccount: Address; proposalId?: string }>{
      proposerAccount,
    };

    if (proposalId) {
      args = {
        proposerAccount,
        ...(proposalId ? { proposalId: proposalId.toString() } : {}),
      };
    }

    const logs = await client.getLogs({
      address: contractAddress,
      event: eventAbi,
      args,
      fromBlock: 0n,
      toBlock: 'latest',
    });

    return logs.map((log) => {
      const args = log.args as ProposalDualGovernanceDetails;

      return {
        ...log,
        args,
      };
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

const getEPTEvents = async ({
  proposalId,
  client,
  EPTContract,
}: Props): Promise<ProposalLog[]> => {
  const eventAbi = findAbiItem({
    abi: EmergencyProtectedTimelock.abi,
    name: EVENT_NAME,
    type: 'event',
  });

  invariant(client, 'Client must be provided');
  invariant(eventAbi, 'Event ABI not found');
  invariant(EPTContract, 'Contract not found');

  try {
    const contractAddress = EPTContract.address;

    const adminExecutor = await EPTContract.readContract('getAdminExecutor');

    invariant(adminExecutor, 'Contract not found');

    let args: { executor?: Address; id?: bigint } = {
      executor: adminExecutor as Address,
    };

    if (proposalId) {
      args.id = proposalId;
    }

    const logs = await client.getLogs({
      address: contractAddress,
      event: eventAbi,
      args,
      fromBlock: 0n,
      toBlock: 'latest',
    });

    return logs.map((log) => {
      const args = log.args as ProposalLog['args'];

      return {
        ...log,
        args,
      };
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const useGetProposalSubmittedEvents = async ({
  proposalId,
  client,
  chainId,
  EPTContract,
}: Props): Promise<{
  DGEvents: ProposalDualGovernanceLog[];
  EPTEvents: ProposalLog[];
}> => {
  invariant(chainId, 'Chain id must be provided');
  try {
    const [DGEvents, EPTEvents] = await Promise.all([
      getDGEvents({ proposalId, client, chainId }),
      getEPTEvents({ proposalId, client, chainId, EPTContract }),
    ]);

    return {
      DGEvents,
      EPTEvents,
    };
  } catch (e) {
    console.error('Error fetching events:', e);
    return {
      DGEvents: [],
      EPTEvents: [],
    };
  }
};
