import { findAbiItem } from 'utils/find-abi-item';
import { aragonVotingAbi } from 'abi/generated';
import { Address, PublicClient } from 'viem';
import { fetchLogsInParallelChunks } from 'utils/fetch-logs-in-parallel';
import { EventStartVote } from './get-event-start-vote';

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

  const snapshotBlocks = votes.map((v) => v.snapshotBlock);
  const minSnapshotBlock = snapshotBlocks.reduce(
    (min, b) => (b < min ? b : min),
    snapshotBlocks[0],
  );
  const maxSnapshotBlock = snapshotBlocks.reduce(
    (max, b) => (b > max ? b : max),
    snapshotBlocks[0],
  );

  const startVoteEventAbi = findAbiItem({
    abi: aragonVotingAbi,
    name: 'StartVote',
    type: 'event',
  });

  const voteIds = votes.map((v) => BigInt(v.id));

  const startEvents = await fetchLogsInParallelChunks<any>({
    client,
    address,
    event: startVoteEventAbi,
    fromBlock: minSnapshotBlock,
    toBlock: maxSnapshotBlock + 1n,
    args: { voteId: voteIds },
  });

  const result: Record<string, EventStartVote | null> = {};

  // Initialize all to null
  for (const vote of votes) {
    result[vote.id.toString()] = null;
  }

  for (const event of startEvents) {
    const vId = event.args.voteId.toString();
    result[vId] = {
      event,
      args: event.args,
    };
  }

  return result;
};
