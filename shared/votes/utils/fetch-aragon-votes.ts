import { aragonVotingAbi } from 'abi/generated';
import type { PublicClient } from 'viem';
import type { Vote, VoteEvent, EventExecuteVote } from '../types';
import { VoteStatus } from '../types';
import type { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import type { EventStartVote } from './get-event-start-vote';
import { fetchArchivedVotes } from './fetch-archived-votes';
import { fetchUncached } from './fetch-uncached';

type VotingContract = ReturnType<
  typeof useReadContract<typeof aragonVotingAbi>
>;

type FetchArgs = {
  votingContract: VotingContract;
  chainId: number;
  limit: number;
  offset?: number;
  client: PublicClient;
  onlyActive?: boolean;
};

type VoteResult = Vote & {
  startEvent: EventStartVote | null;
  executeEvent: EventExecuteVote | null;
  voteEvents: VoteEvent[] | null;
  description: string | null;
};

const isVoteActive = (vote: Vote) => {
  if (
    vote.state.status === VoteStatus.ActiveObjection &&
    !vote.state.isQuorumReached
  ) {
    return false;
  }
  return (
    vote.state.status === VoteStatus.ActiveMain ||
    vote.state.status === VoteStatus.ActiveObjection ||
    vote.canExecute
  );
};

/**
 * Thin orchestrator: reads a page of vote IDs from the archived JSON
 * first, then fetches whatever is missing from RPC (the uncached path),
 * and merges by ID descending. Sequential by necessity — the RPC set
 * is exactly the IDs absent from the archive.
 */
export const fetchAragonVotes = async ({
  votingContract,
  chainId,
  limit,
  offset = 0,
  client,
  onlyActive = true,
}: FetchArgs): Promise<VoteResult[]> => {
  const votesLengthBn = await votingContract.readContract('votesLength');
  const votesLength = Number(votesLengthBn);

  if (votesLength === 0) {
    return [];
  }

  const startId = votesLength - 1 - offset;
  const endId = Math.max(startId - limit + 1, 0);
  const voteIds = Array.from(
    { length: startId - endId + 1 },
    (_, i) => startId - i,
  );

  const archived = await fetchArchivedVotes({
    chainId,
    votingAddress: votingContract.address,
    voteIds,
  });

  const missingIds = voteIds.filter((id) => !(id.toString() in archived));

  const uncached = await fetchUncached({
    votingContract,
    client,
    voteIds: missingIds,
    withExecuteEvent: !onlyActive,
  });

  const voteMap = new Map<number, VoteResult>();
  for (const [id, vote] of Object.entries(archived)) {
    voteMap.set(Number(id), vote);
  }
  for (const vote of uncached) {
    voteMap.set(vote.id, vote);
  }

  const merged = voteIds
    .map((id) => voteMap.get(id))
    .filter((v): v is VoteResult => v !== undefined);

  return onlyActive ? merged.filter(isVoteActive) : merged;
};
