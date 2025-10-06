import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { findAbiItem } from 'utils/find-abi-item';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import invariant from 'tiny-invariant';
import { Log, PublicClient } from 'viem';
import { fetchLogsInParallelChunks } from 'utils/fetch-logs-in-parallel';
import { CONTRACT_DEPLOYMENT_BLOCKS } from 'shared/blockchain/deployment-blocks';
import { getContractAddress } from 'utils/get-contract-address';

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
    name: 'ProposalExecuted',
    type: 'event',
  });

  invariant(proposalId != null, 'proposalId must be provided');
  invariant(
    Object.values(CHAINS).includes(chainId),
    `Invalid chainId ${chainId}`,
  );
  invariant(client, 'Client must be provided');
  invariant(eventAbi, `Event ABI item ProposalExecuted not found`);

  const contractAddressConfig =
    EmergencyProtectedTimelock.chainAddressMap[chainId];
  const contractAddress = getContractAddress(contractAddressConfig, chainId);
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

    const logs = await fetchLogsInParallelChunks<Log>({
      client,
      address: contractAddress,
      event: eventAbi,
      args: eventArgs,
      fromBlock: deploymentBlock,
      toBlock: latestBlockNumber,
      chainId,
    });

    return logs.length > 0 ? logs[0] : null;
  } catch (e) {
    console.error(`Failed to fetch logs for proposal ${proposalId}:`, e);
    return null;
  }
};
