import { aragonVotingAbi } from 'abi/generated';
import type { PublicClient } from 'viem';
import type { Vote, VoteEvent, EventExecuteVote } from '../types';
import { VoteStatus } from '../types';
import type { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import type { EventStartVote } from './get-event-start-vote';
import { fetchCachedVotes } from './fetch-cached-votes';
import { fetchUncachedVotes } from './fetch-uncached-votes';

type VotingContract = ReturnType<
  typeof useReadContract<typeof aragonVotingAbi>
>;

type FetchArgs = {
  votingContract: VotingContract;
  chainId: number;
  limit?: number;
  offset?: number;
  client: PublicClient;
  onlyActive?: boolean;
  voteIds?: number[];
  useLocalCache: boolean;
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

export const fetchAragonVotes = async ({
  votingContract,
  chainId,
  limit,
  offset = 0,
  client,
  onlyActive = true,
  voteIds: requestedVoteIds,
  useLocalCache,
}: FetchArgs): Promise<VoteResult[]> => {
  let voteIds = requestedVoteIds;

  if (!voteIds) {
    if (limit === undefined) {
      throw new Error('fetchAragonVotes requires either voteIds or limit');
    }
    const votesLength = Number(
      await votingContract.readContract('votesLength'),
    );
    const startId = votesLength - 1 - offset;
    const endId = Math.max(startId - limit + 1, 0);
    voteIds =
      votesLength === 0
        ? []
        : Array.from(
            { length: startId - endId + 1 },
            (_, index) => startId - index,
          );
  }

  if (voteIds.length === 0) {
    return [];
  }

  const cachedVotesMap = await fetchCachedVotes({
    chainId,
    votingAddress: votingContract.address,
    voteIds,
    useLocalCache,
  });

  const missingIds = voteIds.filter((id) => !(id.toString() in cachedVotesMap));

  const uncachedVotes = await fetchUncachedVotes({
    votingContract,
    client,
    voteIds: missingIds,
    withExecuteEvent: !onlyActive,
  });

  const voteMap = new Map<number, VoteResult>();
  for (const [id, vote] of Object.entries(cachedVotesMap)) {
    voteMap.set(Number(id), vote);
  }
  for (const vote of uncachedVotes) {
    voteMap.set(vote.id, vote);
  }

  const orderedVotes = voteIds
    .map((id) => voteMap.get(id))
    .filter((vote): vote is VoteResult => vote !== undefined);

  return onlyActive ? orderedVotes.filter(isVoteActive) : orderedVotes;
};
