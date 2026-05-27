import { aragonVotingAbi } from 'abi/generated';
import type { ContractFunctionParameters, PublicClient } from 'viem';
import type { EventExecuteVote, RawVote, Vote, VoteEvent } from '../types';
import type { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { parseVote } from './parse-vote';
import { EventStartVote } from './get-event-start-vote';
import { getEventsStartVote } from './get-events-start-vote';
import { getEventsExecuteVote } from './get-events-execute-vote';

type VotingContract = ReturnType<
  typeof useReadContract<typeof aragonVotingAbi>
>;

export type UncachedVoteResult = Vote & {
  startEvent: EventStartVote | null;
  executeEvent: EventExecuteVote | null;
  voteEvents: VoteEvent[] | null;
  description: string | null;
};

type Args = {
  votingContract: VotingContract;
  client: PublicClient;
  voteIds: number[];
  withExecuteEvent: boolean;
};

/**
 * Pure RPC reader for votes NOT in the JSON cache — the fallback path
 * for fetchAragonVotes / useVote. Multicall getVote + canExecute, then
 * always the StartVote event (title/metadata) and — only when
 * withExecuteEvent is set — the heavier ExecuteVote scan, in parallel.
 */
export const fetchUncachedVotes = async ({
  votingContract,
  client,
  voteIds,
  withExecuteEvent,
}: Args): Promise<UncachedVoteResult[]> => {
  if (voteIds.length === 0) {
    return [];
  }

  const contractConfig = {
    address: votingContract.address,
    abi: aragonVotingAbi,
  } as const;

  const voteCalls: ContractFunctionParameters[] = voteIds.map((id) => ({
    ...contractConfig,
    functionName: 'getVote',
    args: [id],
  }));

  const executeCalls: ContractFunctionParameters[] = voteIds.map((id) => ({
    ...contractConfig,
    functionName: 'canExecute',
    args: [id],
  }));

  const results = await client.multicall({
    contracts: [...voteCalls, ...executeCalls],
  });

  const voteResults = results.slice(0, voteIds.length);
  const executeResults = results.slice(voteIds.length);

  const votes: Vote[] = voteIds.map((id, index) =>
    parseVote(
      id,
      voteResults[index].result as RawVote,
      executeResults[index].result as boolean,
    ),
  );

  const eventArgs = {
    votes: votes.map((v) => ({ id: v.id, snapshotBlock: v.snapshotBlock })),
    address: votingContract.address,
    client,
  };

  // StartVote carries the title/metadata and is required for every
  // returned vote (one indexed getLogs at snapshotBlock). The heavier
  // ExecuteVote scan runs only when the caller asks (withExecuteEvent)
  // — skipped for active-only callers, whose votes aren't executed.
  const [startEvents, executeEvents] = await Promise.all([
    getEventsStartVote(eventArgs),
    withExecuteEvent
      ? getEventsExecuteVote(eventArgs)
      : Promise.resolve({} as Record<string, EventExecuteVote | null>),
  ]);

  return votes.map((v) => ({
    ...v,
    startEvent: startEvents[v.id.toString()] ?? null,
    executeEvent: executeEvents[v.id.toString()] ?? null,
    voteEvents: null,
    description: null,
  }));
};
