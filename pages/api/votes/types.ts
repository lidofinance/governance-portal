import type { Address } from 'viem';

/**
 * Types for the archived-vote cache. The build script produces this shape
 * from chain data, and the API serves slices of it by vote ID. BigInts are
 * serialized as strings (JSON limitation) and converted back on read.
 */

export type ArchivedVoteDetails = {
  id: number;
  open: boolean;
  executed: boolean;
  startDate: string;
  snapshotBlock: string;
  supportRequired: string;
  minAcceptQuorum: string;
  yea: string;
  nay: string;
  votingPower: string;
  script: string;
  phase: number;
  canExecute: boolean;
};

export type ArchivedStartVoteEvent = {
  transactionHash: string;
  blockNumber: string;
  args: {
    voteId: string;
    creator: Address;
    metadata: string;
  };
};

export type ArchivedExecuteVoteEvent = {
  transactionHash: string;
  blockNumber: string;
  executedAt: number;
};

/** Matches the UI VoteEvent shape, with bigints serialized as strings. */
export type ArchivedVoteEvent = {
  voter: Address;
  supports: boolean;
  stake: string;
  delegatedVotes?: Array<{
    voter: Address;
    supports: boolean;
    stake: string;
  }>;
};

export type ArchivedVote = {
  voteDetails: ArchivedVoteDetails;
  startVoteEvent: ArchivedStartVoteEvent | null;
  executeVoteEvent: ArchivedExecuteVoteEvent | null;
  voteEvents: ArchivedVoteEvent[];
  /**
   * IPFS description text resolved at build time from
   * `startVoteEvent.args.metadata`. `null` when the metadata has no CID or
   * the gateway fetch failed — callers should fall back to the on-chain
   * `metadata` string in that case. Stored separately so the two values can
   * legitimately diverge (and so search-by-description has a plain-text
   * corpus to scan).
   */
  description: string | null;
};

export type CachedVoteEventsData = {
  [chainId: string]: {
    [votingAddress: string]: {
      votes: {
        [voteId: string]: ArchivedVote;
      };
    };
  };
};

/** Returned by GET /api/votes/events — the votes-keyed slice for one chain + address. */
export type VoteEventsSubset = {
  [voteId: string]: ArchivedVote;
};
