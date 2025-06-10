import { findAbiItem } from 'utils/find-abi-item';
import { DualGovernanceStateChangeEventLog, GovernanceState } from '../types';
import { DualGovernance } from 'shared/blockchain/contracts';
import invariant from 'tiny-invariant';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { PublicClient } from 'viem';
import { CONTRACT_DEPLOYMENT_BLOCKS } from 'shared/blockchain/deployment-blocks';

type Props = {
  from?: GovernanceState;
  to?: GovernanceState;
  chainId: CHAINS;
  client: PublicClient;
};

const EVENT_NAME = 'DualGovernanceStateChanged';

export const getDGStateChangedEvents = async ({
  from,
  to,
  chainId,
  client,
}: Props): Promise<DualGovernanceStateChangeEventLog[]> => {
  const eventAbi = findAbiItem({
    abi: DualGovernance.abi,
    name: EVENT_NAME,
    type: 'event',
  });

  const contractAddress = DualGovernance.chainAddressMap[chainId];

  invariant(client, 'Client must be provided');
  invariant(eventAbi, 'Event ABI not found');

  try {
    const deploymentBlock =
      CONTRACT_DEPLOYMENT_BLOCKS[chainId]?.dualGovernance || 0n;

    const logs = await client.getLogs({
      address: contractAddress,
      event: eventAbi,
      args: {
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
      },
      fromBlock: deploymentBlock,
      toBlock: 'latest',
    });

    return logs.map((log) => {
      const args = log.args as DualGovernanceStateChangeEventLog['args'];

      return {
        ...log,
        args,
      };
    });
  } catch (e) {
    console.error('Error fetching events:', e);
    return [];
  }
};
