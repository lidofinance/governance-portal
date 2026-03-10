import { findAbiItem } from 'utils/find-abi-item';
import { aragonVotingAbi } from 'abi/generated';
import { getBlock } from 'viem/actions';
import { Address, PublicClient } from 'viem';
import { EventExecuteVote } from '../types';

type Args = {
  address: Address;
  client: PublicClient;
  votes: { id: string | number | bigint; snapshotBlock: bigint }[];
};

export const getEventsExecuteVote = async ({
  client,
  address,
  votes,
}: Args): Promise<Record<string, EventExecuteVote | null>> => {
  if (votes.length === 0) return {};

  const executeVoteEventAbi = findAbiItem({
    abi: aragonVotingAbi,
    name: 'ExecuteVote',
    type: 'event',
  });

  const result: Record<string, EventExecuteVote | null> = {};
  for (const vote of votes) {
    result[vote.id.toString()] = null;
  }

  await Promise.all(
    votes.map(async (vote) => {
      try {
        const logs = await client.getLogs({
          address,
          event: executeVoteEventAbi,
          fromBlock: vote.snapshotBlock,
          args: { voteId: BigInt(vote.id) },
        });

        if (logs.length === 0) {
          return;
        }

        const event = logs[0];
        if (!event.blockNumber) {
          return;
        }

        let executedAt: bigint | undefined;

        try {
          const block = await getBlock(client, {
            blockNumber: event.blockNumber,
          });
          executedAt = block.timestamp;
        } catch (e) {
          console.error('Failed to get block for ExecuteVote event', e);
        }

        result[vote.id.toString()] = { event, executedAt };
      } catch (e) {
        console.error(
          `Failed to fetch ExecuteVote event for vote ${vote.id}`,
          e,
        );
      }
    }),
  );

  return result;
};
