import { findAbiItem } from 'utils/find-abi-item';
import { aragonVotingAbi } from 'abi/generated';
import { getBlock } from 'viem/actions';
import { Address, Log, PublicClient } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { fetchLogsInParallelChunks } from 'utils/fetch-logs-in-parallel';
import { EventExecuteVote } from '../types';

type Args = {
  address: Address;
  client: PublicClient;
  voteId: bigint;
  fromBlock: bigint;
  chainId: CHAINS;
};

type LogReturnType = Log & {
  args: {
    voteId: bigint;
  };
};

const executeVoteEventAbi = findAbiItem({
  abi: aragonVotingAbi,
  name: 'ExecuteVote',
  type: 'event',
});

export const getEventExecuteVote = async ({
  client,
  address,
  voteId,
  fromBlock,
  chainId,
}: Args): Promise<EventExecuteVote | undefined> => {
  try {
    const toBlock = await client.getBlockNumber();

    const events = await fetchLogsInParallelChunks<LogReturnType>({
      client,
      address,
      event: executeVoteEventAbi,
      args: { voteId },
      fromBlock,
      toBlock,
      chainId,
    });

    if (events.length === 0) {
      return;
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
    return;
  }
};
