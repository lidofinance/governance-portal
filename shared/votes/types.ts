import { UnwrapPromise } from 'next/dist/lib/coalesced-function';
import { AragonVotingAbi } from 'generated';

export type Vote = UnwrapPromise<ReturnType<AragonVotingAbi['getVote']>>;

export enum VoteStatus {
  ActiveMain,
  ActiveObjection,
  Executed,
  Pending,
  Passed,
  Rejected,
}
