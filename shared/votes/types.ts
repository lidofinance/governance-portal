import type { Address, Hex, Log } from 'viem';
import { aragonVotingAbi } from 'abi/generated';
import { ContractReadFunctionReturnType } from 'shared/types';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { EventStartVote } from './utils/get-event-start-vote';

// Narrow event shape — only fields the UI reads.
type MinimalEventLog = {
  transactionHash: Hex | null;
  blockNumber: bigint | null;
};

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
  typeof aragonVotingAbi,
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
  script: Hex;
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
  event: EventStartVote | null;
  state: {
    status: VoteStatus;
    isQuorumReached: boolean;
  };
  voteTime: number;
  objectionPhaseTime: number;
};

export type VoteInfo = {
  stake: bigint;
  voter: Address;
  supports: boolean;
};

export type VoteMetadata = {
  blockNumber: number;
  transactionIndex: number;
};

export type AttemptCastVoteAsDelegateEventLogArgs = {
  delegate: Address;
  voteId: bigint;
  voters: Address[];
};

export type AttemptCastVoteAsDelegateEventLog = Log & {
  args: AttemptCastVoteAsDelegateEventLogArgs;
};

export type VoteCastEventLogArgs = {
  stake: bigint;
  supports: boolean;
  voteId: bigint;
  voter: Address;
};

export type VoteCastEventLog = Log & {
  args: VoteCastEventLogArgs;
};

export type VoteEvent = VoteInfo & {
  delegatedVotes?: VoteInfo[];
};

export type EventExecuteVote = {
  event: MinimalEventLog;
  executedAt: bigint | undefined;
};

export type DelegationInfo = {
  aragonDelegateAddress: string | null | undefined;
  aragonPublicDelegate: PublicDelegate | null | undefined;
  snapshotDelegateAddress: string | null | undefined;
  snapshotPublicDelegate: PublicDelegate | null | undefined;
};

export type DelegationFormInput = {
  delegateAddress: Address | null;
};

export type DelegationFormLoading = {
  isDaoTokenBalanceLoading: boolean;
  isDelegationInfoLoading: boolean;
};

export type DelegationFormNetworkData = {
  daoTokenBalance: number | undefined;
  loading: DelegationFormLoading;
  refetch: () => Promise<void>;
} & DelegationInfo;

export type DelegationType = 'aragon' | 'snapshot';

export type DelegationFormMode = 'simple' | DelegationType;

export type DelegationFormContextValue = DelegationFormNetworkData & {
  mode: DelegationFormMode;
  onRevoke: (type: DelegationType) => Promise<boolean>;
  register: UseFormRegister<DelegationFormInput>;
  watch: UseFormWatch<DelegationFormInput>;
};

export type PublicDelegate = {
  name: string;
  avatar: string;
  address: Address;
  lido: string;
  twitter: string;
};

export enum VoterState {
  Absent,
  Yea,
  Nay,
  DelegateYea,
  DelegateNay,
}
