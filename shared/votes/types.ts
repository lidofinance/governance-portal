import { UnwrapPromise } from 'next/dist/lib/coalesced-function';
import { AragonVotingAbi } from 'generated';
import { Address } from 'viem';

export type Vote = UnwrapPromise<ReturnType<AragonVotingAbi['getVote']>>;

export enum VoteStatus {
  ActiveMain,
  ActiveObjection,
  Executed,
  Pending,
  Passed,
  Rejected,
}

export type VoteData = {
  voteId: number;
  id: number;
  vote: any;
  canExecute: boolean;
  event?: {
    creator: Address;
    metadata: string;
    voteId: bigint;
  };
  state: {
    status: VoteStatus;
    isQuorumReached: boolean;
  };
  voteTime: number;
  objectionPhaseTime: number;
};
