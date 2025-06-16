import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { findAbiItem } from 'utils/find-abi-item';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import invariant from 'tiny-invariant';
import { Log, PublicClient } from 'viem';
import { getBatchedLogs } from '../../../utils/batched-logs';
import { CONTRACT_DEPLOYMENT_BLOCKS } from 'shared/blockchain/deployment-blocks';

const EVENT_NAME = 'ProposalExecuted';
const MAX_BLOCK_RANGE = 49999n;

type Props = {
  proposalId: number;
  client: PublicClient;
  chainId: CHAINS;
};

type ProposalExecutedEventArgs = {
  id: bigint;
};

export const getProposalExecutedEvent = async ({
  proposalId,
  client,
  chainId,
}: Props): Promise<Log | null> => {
  const eventAbi = findAbiItem({
    abi: EmergencyProtectedTimelock.abi,
    name: EVENT_NAME,
    type: 'event',
  });

  invariant(proposalId != null, 'proposalId must be provided');
  invariant(
    Object.values(CHAINS).includes(chainId),
    `Invalid chainId ${chainId}`,
  );
  invariant(client, 'Client must be provided');
  invariant(eventAbi, `Event ABI item '${EVENT_NAME}' not found`);

  const contractAddress = EmergencyProtectedTimelock.chainAddressMap[chainId];
  invariant(
    contractAddress,
    `Contract address not found for chainId ${chainId}`,
  );

  const deploymentBlock =
    CONTRACT_DEPLOYMENT_BLOCKS[chainId]?.emergencyProtectedTimelock || 0n;
  const eventArgs: ProposalExecutedEventArgs = {
    id: BigInt(proposalId),
  };

  try {
    const latestBlockNumber = await client.getBlockNumber();

    for (
      let currentToBlock = latestBlockNumber;
      currentToBlock >= deploymentBlock;
      currentToBlock -= MAX_BLOCK_RANGE
    ) {
      const currentFromBlock =
        currentToBlock - MAX_BLOCK_RANGE + 1n > deploymentBlock
          ? currentToBlock - MAX_BLOCK_RANGE + 1n
          : deploymentBlock;

      if (currentFromBlock > currentToBlock) {
        break;
      }

      const logs = await getBatchedLogs({
        publicClient: client,
        address: contractAddress,
        event: eventAbi,
        args: eventArgs,
        fromBlock: currentFromBlock,
        toBlock: currentToBlock,
      });

      if (logs.length > 0) {
        return logs[0];
      }
    }

    return null;
  } catch (e) {
    throw new Error(`Failed to fetch logs for proposal ${proposalId}: ${e}`);
  }
};
