import type { Address, Hex } from 'viem';

export type CachedVoteDetails = {
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
  script: Hex;
  phase: number;
  canExecute: boolean;
};

export type CachedStartVoteEvent = {
  transactionHash: Hex;
  blockNumber: string;
  args: {
    voteId: string;
    creator: Address;
    metadata: string;
  };
};

export type CachedExecuteVoteEvent = {
  transactionHash: Hex;
  blockNumber: string;
  executedAt: number;
};

export type CachedVoteEvent = {
  voter: Address;
  supports: boolean;
  stake: string;
  delegatedVotes?: Array<{
    voter: Address;
    supports: boolean;
    stake: string;
  }>;
};

export type CachedVote = {
  voteDetails: CachedVoteDetails;
  startVoteEvent: CachedStartVoteEvent | null;
  executeVoteEvent: CachedExecuteVoteEvent | null;
  voteEvents: CachedVoteEvent[];
  description: string | null;
};

export type CachedVoteEventsData = {
  [chainId: string]: {
    [votingAddress: string]: {
      votes: {
        [voteId: string]: CachedVote;
      };
    };
  };
};

export type VoteEventsSubset = {
  [voteId: string]: CachedVote;
};

export type VoteEventsManifest = {
  chunkSize: number;
  firstId: number;
  lastId: number;
  chunks: { [chunkIndex: string]: string };
};

export type VoteDescriptionEntry = {
  creator: Address | null;
  description: string | null;
  metadata: string;
};

export type VoteDescriptionsMap = {
  [voteId: string]: VoteDescriptionEntry;
};
