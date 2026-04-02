import { Address, Log } from 'viem';
// TODO: Generate proper event types from ABI
type DGProposalSubmittedEvent = any;
import { BigNumber } from 'ethers';
import { ProposalStatus } from 'shared/types';

export { ProposalStatus };

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

// Returned by GET /api/proposals/events — the proposals-keyed slice for one chain
export type ProposalEventsSubset = {
  [proposalId: string]: EventsLogs & { details?: ProposalDetails };
};
