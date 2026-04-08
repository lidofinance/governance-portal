import type { Log } from 'viem';

export type VoteEventLog = Log & {
  args?: Record<string, unknown>;
  blockTimestamp?: number;
};

export type CachedVoteEntry = {
  startVoteEvent: VoteEventLog | null;
  executeVoteEvent: (VoteEventLog & { blockTimestamp?: number }) | null;
  castVoteEvents: VoteEventLog[] | null;
  attemptCastVoteAsDelegateEvents: VoteEventLog[] | null;
  voteDetails: {
    id: number;
    open: boolean;
    executed: boolean;
    startDate: string;
    snapshotBlock: string;
    phase: number;
  };
};

export type CachedVoteEventsData = {
  [chainId: string]: {
    votes: {
      [voteId: string]: CachedVoteEntry;
    };
  };
};

// Returned by GET /api/votes/events — the votes-keyed slice for one chain
export type VoteEventsSubset = {
  [voteId: string]: CachedVoteEntry;
};
