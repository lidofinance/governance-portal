import { Address, Log } from 'viem';
// TODO: Generate proper event types from ABI
type DGProposalSubmittedEvent = any;
import { BigNumber } from 'ethers';

type TimeStamp = number;

export type SubmitProposalCall = [string, BigNumber, string] & {
  target: string;
  value: BigNumber;
  payload: string;
};

export type ProposalDetails = {
  executor: Address;
  id: bigint;
  scheduledAt: TimeStamp;
  status: ProposalStatus;
  submittedAt: TimeStamp;
  calls: SubmitProposalCall[];
};

export type ProposalCombinedData = {
  proposalId: number;
  voteId?: number;
  DGEvent?: DGProposalSubmittedEvent;
  proposalDetails: ProposalDetails;
};

export type ProposalSubmittedLog = Log & {
  args: {
    proposerAccount: Address;
    proposalId: bigint;
    metadata: string;
  };
};

export type ProposalScheduledLog = Log & {
  args: {
    id: bigint;
  };
};

export type ProposalExecutedLog = Log & {
  args: {
    id: bigint;
  };
  blockTimestamp?: number;
};

export type EventsLogs = {
  proposalSubmittedEvent: ProposalSubmittedLog | null;
  proposalScheduledEvent: ProposalScheduledLog | null;
  proposalExecutedEvent: ProposalExecutedLog | null;
};

export type CachedEventsData = {
  [chainId: string]: {
    proposals: {
      [proposalId: string]: EventsLogs & { details?: ProposalDetails };
    };
  };
};

export type ProposalEventsSubset = CachedEventsData[string]['proposals'];

export type ProposalEventsManifest = {
  chunkSize: number;
  firstId: number;
  lastId: number;
  chunks: { [chunkIndex: string]: string };
};

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
