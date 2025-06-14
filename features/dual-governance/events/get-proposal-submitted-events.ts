import invariant from 'tiny-invariant';
import { findAbiItem } from 'utils/find-abi-item';
import {
  DualGovernance,
  EmergencyProtectedTimelock,
} from 'shared/blockchain/contracts';
import { usePublicClient } from 'wagmi';
import { Address, parseAbiItem } from 'viem';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { ProposalSubmittedEvent as DGProposalSubmittedEvent } from 'generated/DualGovernanceAbi';
import { ProposalSubmittedEvent as EPTProposalSubmittedEvent } from 'generated/EmergencyProtectedTimelockAbi';
import { BigNumber } from 'ethers';
import { registerDynamicAddress } from 'utils/dynamic-addresses';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { CONTRACT_DEPLOYMENT_BLOCKS } from 'shared/blockchain/deployment-blocks';

type Props = {
  client: ReturnType<typeof usePublicClient>;
  EPTContract?: ReturnType<typeof useReadContract>;
  chainId: CHAINS;
  proposalId?: string | number; // Optional parameter passed from useProposal()
};

export type MergedProposalSubmittedEvent = {
  proposalId: BigNumber;
  DGEvent?: DGProposalSubmittedEvent;
  EPTEvent?: EPTProposalSubmittedEvent;
};

const PROPOSAL_SUBMITTED_EVENT = 'ProposalSubmitted';

const getGovernanceSetAddresses = async ({
  client,
  EPTContract,
  chainId,
}: Props): Promise<Address[]> => {
  const eventAbi = parseAbiItem('event GovernanceSet(address newGovernance)');

  invariant(client, 'Client must be provided');
  invariant(eventAbi, 'Event ABI not found');
  invariant(EPTContract, 'EPTContract not found');

  try {
    const contractAddress = EPTContract.address;
    const deploymentBlock =
      CONTRACT_DEPLOYMENT_BLOCKS[chainId]?.emergencyProtectedTimelock || 0n;

    const allLogs: any[] = [];

    try {
      const logs = await client.getLogs({
        address: contractAddress,
        event: eventAbi,
        fromBlock: deploymentBlock,
        toBlock: 'latest',
      });

      allLogs.push(...logs);
    } catch (error) {
      console.error(`Error fetching GovernanceSet logs`, error);
    }

    const governanceAddresses = allLogs
      .map((log: any) => log.args?.newGovernance as Address)
      .filter((addr: any): addr is Address => !!addr);

    // Whitelist governance addresses to bypass RPC validation
    if (chainId) {
      governanceAddresses.forEach((address: Address) => {
        registerDynamicAddress(chainId, address, 'governance').catch(
          (error) => {
            console.error(
              `Error registering governance address ${address}:`,
              error,
            );
          },
        );
      });
    }

    return governanceAddresses;
  } catch (error) {
    console.error('Error fetching GovernanceSet events:', error);
    return [];
  }
};

const getGovernanceProposalSubmittedEvents = async ({
  client,
  address,
  chainId,
  proposalId,
}: {
  client: ReturnType<typeof usePublicClient>;
  address: Address;
  chainId: CHAINS;
  proposalId?: string | number;
}): Promise<DGProposalSubmittedEvent[]> => {
  const eventAbi = findAbiItem({
    abi: DualGovernance.abi,
    name: PROPOSAL_SUBMITTED_EVENT,
    type: 'event',
  });

  invariant(client, 'Client must be provided');
  invariant(eventAbi, 'Event ABI not found');

  const deploymentBlock =
    CONTRACT_DEPLOYMENT_BLOCKS[chainId]?.dualGovernance || 0n;

  try {
    const allLogs: DGProposalSubmittedEvent[] = [];

    try {
      const filter: any = {
        address,
        event: eventAbi,
        fromBlock: deploymentBlock,
        toBlock: 'latest',
      };

      if (proposalId !== undefined) {
        filter.args = {
          proposalId: BigInt(proposalId),
        };
      }

      const logs = await client.getLogs(filter);

      allLogs.push(...(logs as unknown as DGProposalSubmittedEvent[]));
    } catch (error) {
      console.error(`Error fetching logs for address ${address}:`, error);
    }

    return allLogs;
  } catch (error) {
    console.error('Error fetching governance proposal events:', error);
    return [];
  }
};

const getEPTProposalSubmittedEvents = async ({
  client,
  EPTContract,
  chainId,
  proposalId,
}: Props): Promise<EPTProposalSubmittedEvent[]> => {
  const eventAbi = findAbiItem({
    abi: EmergencyProtectedTimelock.abi,
    name: PROPOSAL_SUBMITTED_EVENT,
    type: 'event',
  });

  invariant(client, 'Client must be provided');
  invariant(eventAbi, 'Event ABI not found');
  invariant(EPTContract, 'Contract not found');

  try {
    const contractAddress = EPTContract.address;

    const deploymentBlock =
      CONTRACT_DEPLOYMENT_BLOCKS[chainId]?.emergencyProtectedTimelock || 0n;

    const allLogs: any[] = [];

    try {
      const filter: any = {
        address: contractAddress,
        event: eventAbi,
        fromBlock: deploymentBlock,
        toBlock: 'latest',
      };

      if (proposalId !== undefined) {
        filter.args = {
          id: BigInt(proposalId),
        };
      }

      const logs = await client.getLogs(filter);

      allLogs.push(...logs);
    } catch (error) {
      console.error('Error fetching EPT proposal logs', error);
    }

    return allLogs as unknown as EPTProposalSubmittedEvent[];
  } catch (error) {
    console.error('Error fetching EPT ProposalSubmitted events:', error);
    return [];
  }
};

export const getProposalSubmittedEvents = async ({
  client,
  EPTContract,
  chainId,
  proposalId,
}: Props): Promise<{
  mergedProposalSubmittedEvents: MergedProposalSubmittedEvent[];
}> => {
  try {
    const governanceAddresses = await getGovernanceSetAddresses({
      client,
      EPTContract,
      chainId,
    });

    const governanceEventsPromises = governanceAddresses.map((address) =>
      getGovernanceProposalSubmittedEvents({
        client,
        address,
        chainId,
        proposalId,
      }),
    );
    const governanceEventsArrays = await Promise.all(governanceEventsPromises);

    const governanceEventsMap = new Map<string, DGProposalSubmittedEvent>();
    for (const events of governanceEventsArrays) {
      for (const event of events) {
        const proposalId = event.args.proposalId.toString();
        if (!governanceEventsMap.has(proposalId)) {
          governanceEventsMap.set(proposalId, event);
        }
      }
    }
    const governanceEvents = Array.from(governanceEventsMap.values());

    const EPTEvents = await getEPTProposalSubmittedEvents({
      client,
      EPTContract,
      chainId,
      proposalId,
    });

    const mergedEventsMap = new Map<string, MergedProposalSubmittedEvent>();

    for (const event of governanceEvents) {
      const eventProposalId = event.args.proposalId.toString();
      if (
        proposalId === undefined ||
        eventProposalId === proposalId.toString()
      ) {
        mergedEventsMap.set(eventProposalId, {
          proposalId: event.args.proposalId,
          DGEvent: event,
        });
      }
    }

    for (const event of EPTEvents) {
      const eventProposalId = event.args.id.toString();
      if (
        proposalId === undefined ||
        eventProposalId === proposalId.toString()
      ) {
        const existing = mergedEventsMap.get(eventProposalId) || {
          proposalId: event.args.id,
        };
        mergedEventsMap.set(eventProposalId, {
          ...existing,
          EPTEvent: event,
        });
      }
    }

    const mergedProposalSubmittedEvents = Array.from(mergedEventsMap.values());

    return {
      mergedProposalSubmittedEvents,
    };
  } catch (error) {
    console.error('Error fetching and merging proposal events:', error);
    return {
      mergedProposalSubmittedEvents: [],
    };
  }
};
