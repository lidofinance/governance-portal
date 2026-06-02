import type { Address } from 'viem';
import type {
  CachedStartVoteEvent,
  CachedExecuteVoteEvent,
  CachedVote,
  CachedVoteEvent,
} from 'shared/votes/cache/types';
import { fetchCachedVoteEvents } from 'features/vote/utils/fetch-cached-vote-events';
import type { EventStartVote } from './get-event-start-vote';
import type { EventExecuteVote, Vote, VoteEvent } from '../types';
import { VotePhase } from '../types';
import { getVoteState } from './get-vote-state';

export type CachedVoteResult = Vote & {
  startEvent: EventStartVote | null;
  executeEvent: EventExecuteVote | null;
  voteEvents: VoteEvent[];
  description: string | null;
};

const PHASE_MAP: Record<number, VotePhase> = {
  0: VotePhase.Main,
  1: VotePhase.Objection,
  2: VotePhase.Closed,
};

const parseStartVoteEvent = (
  event: CachedStartVoteEvent | null,
): EventStartVote | null => {
  if (!event) {
    return null;
  }
  return {
    event: {
      transactionHash: event.transactionHash,
      blockNumber: BigInt(event.blockNumber),
    },
    args: {
      voteId: BigInt(event.args.voteId),
      creator: event.args.creator,
      metadata: event.args.metadata,
    },
  };
};

const parseExecuteVoteEvent = (
  event: CachedExecuteVoteEvent | null,
): EventExecuteVote | null => {
  if (!event) {
    return null;
  }
  return {
    event: {
      transactionHash: event.transactionHash,
      blockNumber: BigInt(event.blockNumber),
    },
    executedAt: BigInt(event.executedAt),
  };
};

const parseVoteEvent = (event: CachedVoteEvent): VoteEvent => ({
  voter: event.voter,
  supports: event.supports,
  stake: BigInt(event.stake),
  delegatedVotes: event.delegatedVotes?.map((delegated) => ({
    voter: delegated.voter,
    supports: delegated.supports,
    stake: BigInt(delegated.stake),
  })),
});

const parseCachedVote = (cached: CachedVote): CachedVoteResult => {
  const details = cached.voteDetails;
  const voteObject = {
    id: details.id,
    open: details.open,
    executed: details.executed,
    startDate: BigInt(details.startDate),
    snapshotBlock: BigInt(details.snapshotBlock),
    supportRequired: BigInt(details.supportRequired),
    minAcceptQuorum: BigInt(details.minAcceptQuorum),
    yea: BigInt(details.yea),
    nay: BigInt(details.nay),
    votingPower: BigInt(details.votingPower),
    script: details.script,
    phase: PHASE_MAP[details.phase] ?? VotePhase.Closed,
    canExecute: details.canExecute,
  };

  return {
    ...voteObject,
    state: getVoteState(voteObject, details.canExecute),
    startEvent: parseStartVoteEvent(cached.startVoteEvent),
    executeEvent: parseExecuteVoteEvent(cached.executeVoteEvent),
    voteEvents: cached.voteEvents.map(parseVoteEvent),
    description: cached.description ?? null,
  };
};

export const fetchCachedVotes = async ({
  chainId,
  votingAddress,
  voteIds,
  useLocalCache,
}: {
  chainId: number;
  votingAddress: Address;
  voteIds: (string | number)[];
  useLocalCache: boolean;
}): Promise<Record<string, CachedVoteResult>> => {
  if (!useLocalCache || voteIds.length === 0) {
    return {};
  }

  const subset = await fetchCachedVoteEvents(chainId, votingAddress, voteIds);

  const result: Record<string, CachedVoteResult> = {};
  for (const [id, cached] of Object.entries(subset)) {
    result[id] = parseCachedVote(cached);
  }
  return result;
};
