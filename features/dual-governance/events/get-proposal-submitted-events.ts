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
import { addDynamicGovernanceAddress } from 'utils/dynamic-addresses';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { CONTRACT_DEPLOYMENT_BLOCKS } from 'shared/blockchain/deployment-blocks';

type Props = {
  client: ReturnType<typeof usePublicClient>;
  EPTContract?: ReturnType<typeof useReadContract>;
  chainId: CHAINS;
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
    const BLOCK_RANGE = 4999n;

    const latestBlock = await client.getBlockNumber();

    let fromBlock = deploymentBlock;

    while (fromBlock <= latestBlock) {
      const toBlock =
        fromBlock + BLOCK_RANGE > latestBlock
          ? latestBlock
          : fromBlock + BLOCK_RANGE;

      try {
        const logs = await client.getLogs({
          address: contractAddress,
          event: eventAbi,
          fromBlock,
          toBlock,
        });

        allLogs.push(...logs);
      } catch (error) {
        console.error(
          `Error fetching GovernanceSet logs from ${fromBlock} to ${toBlock}:`,
          error,
        );
      }

      fromBlock = toBlock + 1n;
    }

    const governanceAddresses = allLogs
      .map((log: any) => log.args?.newGovernance as Address)
      .filter((addr: any): addr is Address => !!addr);

    // Whitelist governance addresses to bypass RPC validation
    if (chainId) {
      governanceAddresses.forEach((address: Address) => {
        addDynamicGovernanceAddress(chainId, address).catch((err) => {
          console.error('Error registering governance address:', err);
        });
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
}: {
  client: ReturnType<typeof usePublicClient>;
  address: Address;
  chainId: CHAINS;
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
    const BLOCK_RANGE = 4999n;

    const latestBlock = await client.getBlockNumber();

    let fromBlock = deploymentBlock;

    while (fromBlock <= latestBlock) {
      const toBlock =
        fromBlock + BLOCK_RANGE > latestBlock
          ? latestBlock
          : fromBlock + BLOCK_RANGE;

      try {
        const logs = await client.getLogs({
          address,
          event: eventAbi,
          fromBlock,
          toBlock,
        });

        allLogs.push(...(logs as unknown as DGProposalSubmittedEvent[]));
      } catch (error) {
        console.error(
          `Error fetching logs from ${fromBlock} to ${toBlock} for address ${address}:`,
          error,
        );
      }

      fromBlock = toBlock + 1n;
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
    const BLOCK_RANGE = 4999n;

    const latestBlock = await client.getBlockNumber();

    let fromBlock = deploymentBlock;

    while (fromBlock <= latestBlock) {
      const toBlock =
        fromBlock + BLOCK_RANGE > latestBlock
          ? latestBlock
          : fromBlock + BLOCK_RANGE;

      try {
        const logs = await client.getLogs({
          address: contractAddress,
          event: eventAbi,
          fromBlock,
          toBlock,
        });

        allLogs.push(...logs);
      } catch (error) {
        console.error(
          `Error fetching EPT proposal logs from ${fromBlock} to ${toBlock}:`,
          error,
        );
      }

      fromBlock = toBlock + 1n;
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
}: Props): Promise<{
  mergedProposalSubmittedEvents: MergedProposalSubmittedEvent[];
}> => {
  try {
    // Get all governance addresses from GovernanceSet events
    const governanceAddresses = await getGovernanceSetAddresses({
      client,
      EPTContract,
      chainId,
    });

    const governanceEventsPromises = governanceAddresses.map((address) =>
      getGovernanceProposalSubmittedEvents({ client, address, chainId }),
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
    });

    const mergedEventsMap = new Map<string, MergedProposalSubmittedEvent>();

    for (const event of governanceEvents) {
      const proposalId = event.args.proposalId.toString();
      mergedEventsMap.set(proposalId, {
        proposalId: event.args.proposalId,
        DGEvent: event,
      });
    }

    for (const event of EPTEvents) {
      const proposalId = event.args.id.toString();
      const existing = mergedEventsMap.get(proposalId) || {
        proposalId: event.args.id,
      };
      mergedEventsMap.set(proposalId, {
        ...existing,
        EPTEvent: event,
      });
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
