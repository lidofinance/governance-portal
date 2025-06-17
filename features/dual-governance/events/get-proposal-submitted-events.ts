import invariant from 'tiny-invariant';
import { parseAbiItem } from 'viem';
import { usePublicClient } from 'wagmi';
import { Address } from 'viem';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { ProposalSubmittedEvent as DGProposalSubmittedEvent } from 'generated/DualGovernanceAbi';
import { ProposalSubmittedEvent as EPTProposalSubmittedEvent } from 'generated/EmergencyProtectedTimelockAbi';
import { CONTRACT_DEPLOYMENT_BLOCKS } from 'shared/blockchain/deployment-blocks';
import { registerDynamicAddressesBatch } from 'utils/dynamic-addresses';
import { getBatchedLogs } from 'utils/batched-logs';
import { findAbiItem } from 'utils/find-abi-item';
import {
  DualGovernance,
  EmergencyProtectedTimelock,
} from 'shared/blockchain/contracts';
import { BigNumber } from 'ethers';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

type Props = {
  client: ReturnType<typeof usePublicClient>;
  EPTContract: ReturnType<typeof useReadContract>;
  chainId: CHAINS;
  proposalId?: number;
  governanceAddresses?: Address[];
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
      const logs = await getBatchedLogs({
        publicClient: client,
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
      registerDynamicAddressesBatch(
        chainId,
        governanceAddresses,
        'governance',
      ).catch((error) => {
        console.error(`Error batch registering governance addresses:`, error);
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
  proposalId?: number;
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

      const logs = await getBatchedLogs({
        publicClient: client,
        ...filter,
      });

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

      const logs = await getBatchedLogs({
        publicClient: client,
        ...filter,
        onProgress: (current, total) => {
          const percentComplete = Number((current * 100n) / total);
          console.debug(
            `Loading EPT ProposalSubmitted logs: ${percentComplete}% complete`,
          );
        },
      });

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
  governanceAddresses,
}: Props): Promise<{
  mergedProposalSubmittedEvents: MergedProposalSubmittedEvent[];
}> => {
  const eptEventsPromise = getEPTProposalSubmittedEvents({
    client,
    EPTContract,
    chainId,
    proposalId,
  });

  // Start fetching governance addresses in parallel
  const governanceAddressesPromise = governanceAddresses
    ? Promise.resolve(governanceAddresses)
    : getGovernanceSetAddresses({
        client,
        EPTContract,
        chainId,
      });

  try {
    // Wait for governance addresses to start fetching governance events
    const governanceAddresses = await governanceAddressesPromise;

    // Register dynamic addresses if we're using cached governance addresses
    if (governanceAddresses && chainId) {
      // Batch register governance addresses to prevent rate limiting
      registerDynamicAddressesBatch(
        chainId,
        governanceAddresses,
        'governance',
      ).catch((error) => {
        console.error(`Error batch registering governance addresses:`, error);
      });
    }

    const governanceEventsPromise = (async () => {
      const governanceEventsArrays: DGProposalSubmittedEvent[][] = [];

      // Process governance addresses in smaller batches to prevent rate limiting
      const BATCH_SIZE = 3;
      for (let i = 0; i < governanceAddresses.length; i += BATCH_SIZE) {
        const batch = governanceAddresses.slice(i, i + BATCH_SIZE);

        const batchPromises = batch.map((address) =>
          getGovernanceProposalSubmittedEvents({
            client,
            address,
            chainId,
            proposalId,
          }),
        );

        try {
          const batchResults = await Promise.all(batchPromises);
          governanceEventsArrays.push(...batchResults);

          // Add delay between batches to prevent rate limiting
          if (i + BATCH_SIZE < governanceAddresses.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(
            `Error fetching governance events for batch starting at index ${i}:`,
            error,
          );
        }
      }

      const governanceEventsMap = new Map<string, DGProposalSubmittedEvent>();
      for (const events of governanceEventsArrays) {
        for (const event of events) {
          const proposalId = event.args.proposalId.toString();
          if (!governanceEventsMap.has(proposalId)) {
            governanceEventsMap.set(proposalId, event);
          }
        }
      }
      return Array.from(governanceEventsMap.values());
    })();

    // Wait for both EPT events and governance events to complete
    const [EPTEvents, governanceEvents] = await Promise.all([
      eptEventsPromise,
      governanceEventsPromise,
    ]);

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
