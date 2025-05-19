import { Address, Hex, Log } from 'viem';

type TimeStamp = number;

export type SubmitProposalCall = {
  payload: Hex;
  target: Address;
  value: bigint;
};

export type SubmitProposalEventArgs = {
  metadata: string;
  id: bigint;
  proposer: Address;
  timestamp: TimeStamp;
  calls: any[];
};

export type ProposalDetails = {
  executor: Address;
  id: bigint;
  scheduledAt: TimeStamp;
  status: ProposalStatus;
  submittedAt: TimeStamp;
};

export type ProposalDualGovernanceDetails = {
  proposerAccount: Address;
  proposalId: bigint;
  metadata: string;
};

export type ProposalLog = Log & {
  args: SubmitProposalEventArgs;
};

export type ProposalDualGovernanceLog = Log & {
  args: ProposalDualGovernanceDetails;
};

export type ProposalCombinedData = {
  id: number;
  event: ProposalLog;
  proposalDetails: ProposalDetails & { calls: SubmitProposalCall[] };
  proposalDualGovernanceDetails?: ProposalDualGovernanceDetails;
  voteId?: number;
  aragonProposer?: Address;
};

export enum ProposalExtraStatus {
  ReadyToSchedule = 'ReadyToSchedule',
  ReadyToExecute = 'ReadyToExecute',
  Blocked = 'Blocked',
}

export enum ProposalStatus {
  NotExist,
  /// Proposal has been successfully submitted but not scheduled yet. This state is only reachable from NotExist
  Submitted,
  /// Proposal has been successfully scheduled after submission. This state is only reachable from Submitted
  Scheduled,
  /// Proposal has been successfully executed after being scheduled. This state is only reachable from Scheduled
  /// and is the final state of the proposal
  Executed,
  /// Proposal was cancelled before execution. Cancelled proposals cannot be resubmitted or rescheduled.
  /// This state is only reachable from Submitted or Scheduled and is the final state of the proposal.
  /// @dev A proposal is considered cancelled if it was not executed and its ID is less than the ID of the last
  /// submitted proposal at the time the cancelAll() method was called. To check if a proposal is in the Cancelled
  /// state, use the _isProposalMarkedCancelled() view function.
  Cancelled,
}
