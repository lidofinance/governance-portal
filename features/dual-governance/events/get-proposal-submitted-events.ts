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
import { addDynamicGovernanceAddress } from '../../../utils/dynamic-addresses';

type Props = {
  client: ReturnType<typeof usePublicClient>;
  EPTContract?: ReturnType<typeof useReadContract>;
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
}: Props): Promise<Address[]> => {
  const eventAbi = parseAbiItem('event GovernanceSet(address newGovernance)');

  invariant(client, 'Client must be provided');
  invariant(eventAbi, 'Event ABI not found');
  invariant(EPTContract, 'EPTContract not found');

  try {
    const contractAddress = EPTContract.address;

    const logs = await client.getLogs({
      address: contractAddress,
      event: eventAbi,
      fromBlock: 252997n,
      toBlock: 'latest',
    });

    const governanceAddresses = logs
      .map((log) => log.args.newGovernance as Address)
      .filter((addr): addr is Address => !!addr);

    // Whitelist governance addresses to bypass RPC validation
    const chainId = client.chain?.id;
    if (chainId) {
      governanceAddresses.forEach((address) => {
        addDynamicGovernanceAddress(chainId, address).catch((err) => {
          console.error(
            `Error registering governance address ${address}:`,
            err,
          );
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
}: {
  client: ReturnType<typeof usePublicClient>;
  address: Address;
}): Promise<DGProposalSubmittedEvent[]> => {
  const eventAbi = findAbiItem({
    abi: DualGovernance.abi,
    name: PROPOSAL_SUBMITTED_EVENT,
    type: 'event',
  });

  invariant(client, 'Client must be provided');
  invariant(eventAbi, 'Event ABI not found');

  try {
    const logs = await client.getLogs({
      address,
      event: eventAbi,
      fromBlock: 252997n,
      toBlock: 'latest',
    });
    return logs as unknown as DGProposalSubmittedEvent[];
  } catch (error) {
    console.error(
      `Error fetching ProposalSubmitted events for ${address}:`,
      error,
    );
    return [];
  }
};

const getEPTProposalSubmittedEvents = async ({
  client,
  EPTContract,
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

    const logs = await client.getLogs({
      address: contractAddress,
      event: eventAbi,
      fromBlock: 252997n,
      toBlock: 'latest',
    });

    return logs as unknown as EPTProposalSubmittedEvent[];
  } catch (error) {
    console.error('Error fetching EPT ProposalSubmitted events:', error);
    return [];
  }
};

export const getProposalSubmittedEvents = async ({
  client,
  EPTContract,
}: Props): Promise<{
  mergedProposalSubmittedEvents: MergedProposalSubmittedEvent[];
}> => {
  try {
    // Get all governance addresses from GovernanceSet events
    const governanceAddresses = await getGovernanceSetAddresses({
      client,
      EPTContract,
    });

    // Fetch ProposalSubmitted events from governance addresses
    const governanceEventsPromises = governanceAddresses.map((address) =>
      getGovernanceProposalSubmittedEvents({ client, address }),
    );
    const governanceEventsArrays = await Promise.all(governanceEventsPromises);

    // Deduplicate governance events by proposalId
    const governanceEventsMap = new Map<string, DGProposalSubmittedEvent>();
    for (const events of governanceEventsArrays) {
      for (const event of events) {
        const proposalId = event.args.proposalId.toString();
        // Keep the first occurrence of each proposalId
        if (!governanceEventsMap.has(proposalId)) {
          governanceEventsMap.set(proposalId, event);
        }
      }
    }
    const governanceEvents = Array.from(governanceEventsMap.values());

    // Fetch ProposalSubmitted events from EPT contract
    const EPTEvents = await getEPTProposalSubmittedEvents({
      client,
      EPTContract,
    });

    // Merge events based on proposalId (governance) and id (EPT)
    const mergedEventsMap = new Map<string, MergedProposalSubmittedEvent>();

    // Process governance events
    for (const event of governanceEvents) {
      const proposalId = event.args.proposalId.toString();
      mergedEventsMap.set(proposalId, {
        proposalId: event.args.proposalId,
        DGEvent: event,
      });
    }

    // Process EPT events and merge with governance events
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
