import { findAbiItem } from 'utils/find-abi-item';
import { aragonVotingAbi } from 'abi/generated';
import { getBlock } from 'viem/actions';
import { Address, PublicClient } from 'viem';
import { fetchLogsInParallelChunks } from 'utils/fetch-logs-in-parallel';
import { EventExecuteVote } from './get-event-execute-vote';

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

  const snapshotBlocks = votes.map((v) => v.snapshotBlock);
  const minSnapshotBlock = snapshotBlocks.reduce(
    (min, b) => (b < min ? b : min),
    snapshotBlocks[0],
  );

  const maxSnapshotBlock = snapshotBlocks.reduce(
    (max, b) => (b > max ? b : max),
    snapshotBlocks[0],
  );

  const executeVoteEventAbi = findAbiItem({
    abi: aragonVotingAbi,
    name: 'ExecuteVote',
    type: 'event',
  });

  const voteIds = votes.map((v) => BigInt(v.id));

  const executeEvents = await fetchLogsInParallelChunks<any>({
    client,
    address,
    event: executeVoteEventAbi,
    fromBlock: minSnapshotBlock,
    toBlock: maxSnapshotBlock + 1n,
    args: { voteId: voteIds },
  });

  const timestamps = new Map<string, bigint>();
  const uniqueBlocks = [...new Set(executeEvents.map((e) => e.blockNumber))];

  await Promise.all(
    uniqueBlocks.map(async (blockNum) => {
      const block = await getBlock(client, {
        blockNumber: blockNum,
      });
      timestamps.set(blockNum.toString(), block.timestamp);
    }),
  );

  const result: Record<string, EventExecuteVote | null> = {};

  // Initialize all to null
  for (const vote of votes) {
    result[vote.id.toString()] = null;
  }

  for (const event of executeEvents) {
    const vId = event.args.voteId.toString();
    result[vId] = {
      event,
      executedAt: timestamps.get(event.blockNumber.toString()),
    };
  }

  return result;
};
