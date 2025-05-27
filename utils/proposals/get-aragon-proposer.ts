import { Address, PublicClient, parseAbiItem } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { Voting } from 'shared/blockchain/contracts';

const EVENT_ABI = parseAbiItem(
  'event StartVote(uint256 indexed voteId, address indexed creator, string metadata)',
);

type Props = {
  client: PublicClient;
  chainId: CHAINS;
  voteId: bigint;
};

const addressCache = new Map<CHAINS, Address>();

const withRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2 ** i * 1000));
    }
  }
  throw new Error('Unreachable');
};

export const getAragonProposer = async ({
  client,
  chainId,
  voteId,
}: Props): Promise<Address | null> => {
  let aragonAddress = addressCache.get(chainId);
  if (!aragonAddress) {
    aragonAddress = Voting.chainAddressMap[chainId]?.toLowerCase() as Address;
    if (aragonAddress) addressCache.set(chainId, aragonAddress);
  }

  if (!aragonAddress) {
    console.error(`No Aragon voting contract address for chainId: ${chainId}`);
    return null;
  }

  try {
    const fromBlock = 0n; // TODO: add snapshot block
    const logs = await withRetry(() =>
      client.getLogs({
        address: aragonAddress,
        event: EVENT_ABI,
        args: { voteId },
        fromBlock,
        toBlock: 'latest',
      }),
    );

    if (logs.length === 0) {
      console.warn(
        `No StartVote events found for voteId: ${voteId} on chainId: ${chainId}`,
      );
      return null;
    }

    const log = logs[0];
    if (!log.transactionHash) {
      console.warn(`No transaction hash found for voteId: ${voteId}`);
      return null;
    }

    const transaction = await withRetry(() =>
      client.getTransaction({ hash: log.transactionHash }),
    );
    return transaction.from;
  } catch (error) {
    console.error(`Error fetching proposer for voteId: ${voteId}`, error);
    return null;
  }
};
