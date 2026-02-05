import { findAbiItem } from 'utils/find-abi-item';
import { aragonVotingAbi } from 'abi/generated';
import { getBlock } from 'viem/actions';
import { Address, Log, PublicClient } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { fetchLogsInParallelChunks } from 'utils/fetch-logs-in-parallel';

type Args = {
  address: Address;
  client: PublicClient;
  voteId: bigint;
  block: bigint;
  chainId: CHAINS;
};

type LogReturnType = Log & {
  args: {
    voteId: bigint;
  };
};

export type EventExecuteVote = {
  event: Log;
  executedAt: bigint | undefined;
};

type GetEventExecuteVoteReturnType = Promise<EventExecuteVote | null>;

export const getEventExecuteVote = async ({
  client,
  address,
  voteId,
  block,
  chainId,
}: Args): GetEventExecuteVoteReturnType => {
  try {
    const executeVoteEventAbi = findAbiItem({
      abi: aragonVotingAbi,
      name: 'ExecuteVote',
      type: 'event',
    });

    const latestBlockNumber = await client.getBlockNumber();

    const events = await fetchLogsInParallelChunks<LogReturnType>({
      client,
      address,
      event: executeVoteEventAbi,
      args: {
        voteId,
      },
      fromBlock: block,
      toBlock: latestBlockNumber,
      chainId,
    });

    if (events.length === 0) {
      return null;
    }

    const event = events[0];

    const eventBlock = await getBlock(client, {
      blockNumber: event.blockNumber as bigint,
    });
    const executedAt = eventBlock.timestamp;

    return {
      event,
      executedAt,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};
