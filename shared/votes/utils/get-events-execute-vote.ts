import { Address, PublicClient } from 'viem';
import { EventExecuteVote } from '../types';
import { getEventExecuteVote } from './get-event-execute-vote';

type Args = {
  address: Address;
  client: PublicClient;
  votes: {
    id: string | number | bigint;
    fromBlock: bigint;
    toBlock: bigint;
  }[];
};

const CHUNK_SIZE = 2;

export const getEventsExecuteVote = async ({
  client,
  address,
  votes,
}: Args): Promise<Record<string, EventExecuteVote | null>> => {
  if (votes.length === 0) {
    return {};
  }

  const result: Record<string, EventExecuteVote | null> = {};
  for (const vote of votes) {
    result[vote.id.toString()] = null;
  }

  for (let i = 0; i < votes.length; i += CHUNK_SIZE) {
    const chunk = votes.slice(i, i + CHUNK_SIZE);
    await Promise.all(
      chunk.map(async (vote) => {
        const event = await getEventExecuteVote({
          address,
          client,
          voteId: BigInt(vote.id),
          fromBlock: vote.fromBlock,
          toBlock: vote.toBlock,
        });

        if (event) {
          result[vote.id.toString()] = event;
        }
      }),
    );
  }

  return result;
};
