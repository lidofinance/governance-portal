import { Address } from 'viem';
import { votingAbi } from 'abi/ts';
import { ContractReadFunctionReturnType } from 'shared/types';

/**
 * VotePhase.Main if one can vote 'yes' or 'no',
 * VotePhase.Objection if one can vote only 'no' or
 * VotePhase.Closed if no votes are accepted
 */

export enum VotePhase {
  Main,
  Objection,
  Closed,
}

export type RawVote = ContractReadFunctionReturnType<
  typeof votingAbi,
  'getVote'
>;

export type Vote = {
  id: number;
  open: boolean;
  executed: boolean;
  startDate: bigint;
  snapshotBlock: bigint;
  supportRequired: bigint;
  minAcceptQuorum: bigint;
  yea: bigint;
  nay: bigint;
  votingPower: bigint;
  script: string;
  phase: VotePhase;
  state: { status: VoteStatus; isQuorumReached: boolean };
  canExecute: boolean;
};

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
  proposalId: number;
  vote: any;
  canExecute: boolean;
  event?: {
    creator: Address;
    metadata: string;
    voteId: bigint;
  } | null;
  state: {
    status: VoteStatus;
    isQuorumReached: boolean;
  };
  voteTime: number;
  objectionPhaseTime: number;
};
