import { Address, PublicClient } from 'viem';
import { getEventStartVote, EventStartVote } from './get-event-start-vote';

type Args = {
  address: Address;
  client: PublicClient;
  votes: { id: string | number | bigint; snapshotBlock: bigint }[];
};

export const getEventsStartVote = async ({
  client,
  address,
  votes,
}: Args): Promise<Record<string, EventStartVote | null>> => {
  if (votes.length === 0) return {};

  const entries = await Promise.all(
    votes.map(async (vote) => {
      const event = await getEventStartVote({
        client,
        address,
        voteId: BigInt(vote.id),
        fromBlock: vote.snapshotBlock,
      });
      return [vote.id.toString(), event ?? null] as const;
    }),
  );

  return Object.fromEntries(entries);
};
