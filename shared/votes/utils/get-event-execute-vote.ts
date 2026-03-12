import { findAbiItem } from 'utils/find-abi-item';
import { aragonVotingAbi } from 'abi/generated';
import { getBlock } from 'viem/actions';
import { Address, PublicClient } from 'viem';
import { EventExecuteVote } from '../types';

type Args = {
  address: Address;
  client: PublicClient;
  voteId: bigint;
  fromBlock: bigint;
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
}: Args): Promise<EventExecuteVote | undefined> => {
  try {
    const events = await client.getLogs({
      address,
      event: executeVoteEventAbi,
      args: { voteId },
      fromBlock,
    });
    if (events.length === 0) {
      return;
    }

    const event = events[0];

    if (!event.blockNumber) {
      return;
    }

    const eventBlock = await getBlock(client, {
      blockNumber: event.blockNumber,
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
