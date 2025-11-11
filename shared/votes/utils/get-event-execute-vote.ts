import { findAbiItem } from 'utils/find-abi-item';
import { votingAbi } from 'abi/generated';
import { getBlock, getLogs } from 'viem/actions';
import { Address, Log, PublicClient } from 'viem';

type Args = {
  address: Address;
  client: PublicClient;
  voteId: bigint;
  block: bigint;
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

const GET_LOGS_RANGE = 2000n;

export const getEventExecuteVote = async ({
  client,
  address,
  voteId,
  block,
}: Args): GetEventExecuteVoteReturnType => {
  try {
    const executeVoteEventAbi = findAbiItem({
      abi: votingAbi,
      name: 'ExecuteVote',
      type: 'event',
    });

    const events = (await getLogs(client, {
      address,
      event: executeVoteEventAbi,
      args: {
        voteId,
      },
      fromBlock: block - GET_LOGS_RANGE,
      toBlock: block + GET_LOGS_RANGE,
    })) as LogReturnType[];

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
