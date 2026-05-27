import type { Address, Hex } from 'viem';

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
  script: Hex;
  phase: number;
  canExecute: boolean;
};

export type ArchivedStartVoteEvent = {
  transactionHash: Hex;
  blockNumber: string;
  args: {
    voteId: string;
    creator: Address;
    metadata: string;
  };
};

export type ArchivedExecuteVoteEvent = {
  transactionHash: Hex;
  blockNumber: string;
  executedAt: number;
};

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

export type VoteEventsSubset = {
  [voteId: string]: ArchivedVote;
};

export type VoteEventsManifest = {
  chunkSize: number;
  firstId: number;
  lastId: number;
  chunks: { [chunkIndex: string]: string };
};
