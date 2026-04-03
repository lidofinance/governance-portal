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
  toBlock: bigint;
};

const MAX_BLOCKS_PER_QUERY = 5000n;

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
  toBlock,
}: Args): Promise<EventExecuteVote | null> => {
  try {
    // Search in sequential chunks from fromBlock forward.
    // Execute events happen shortly after vote ends, so the first chunk
    // almost always finds it. This avoids RPC timeouts on large ranges.
    for (
      let start = fromBlock;
      start <= toBlock;
      start += MAX_BLOCKS_PER_QUERY
    ) {
      const end =
        start + MAX_BLOCKS_PER_QUERY - 1n < toBlock
          ? start + MAX_BLOCKS_PER_QUERY - 1n
          : toBlock;

      const events = await client.getLogs({
        address,
        event: executeVoteEventAbi,
        args: { voteId },
        fromBlock: start,
        toBlock: end,
      });

      if (events.length > 0) {
        const event = events[0];

        if (!event.blockNumber) {
          return null;
        }

        const eventBlock = await getBlock(client, {
          blockNumber: event.blockNumber,
        });

        return { event, executedAt: eventBlock.timestamp };
      }
    }

    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};
