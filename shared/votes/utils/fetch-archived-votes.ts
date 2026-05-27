import type { Address } from 'viem';
import type {
  ArchivedStartVoteEvent,
  ArchivedExecuteVoteEvent,
  ArchivedVote,
  ArchivedVoteEvent,
} from 'shared/votes/cache/types';
import { fetchCachedVoteEvents } from 'features/vote/utils/fetch-cached-vote-events';
import type { EventStartVote } from './get-event-start-vote';
import type { EventExecuteVote, Vote, VoteEvent } from '../types';
import { VotePhase } from '../types';
import { getVoteState } from './get-vote-state';

export type ArchivedVoteResult = Vote & {
  startEvent: EventStartVote | null;
  executeEvent: EventExecuteVote | null;
  voteEvents: VoteEvent[];
  description: string | null;
};

const PHASE_MAP: Record<number, VotePhase> = {
  0: VotePhase.Main,
  1: VotePhase.Objection,
  2: VotePhase.Closed,
};

const parseStartVoteEvent = (
  event: ArchivedStartVoteEvent | null,
): EventStartVote | null => {
  if (!event) {
    return null;
  }
  return {
    event: {
      transactionHash: event.transactionHash,
      blockNumber: BigInt(event.blockNumber),
    },
    args: {
      voteId: BigInt(event.args.voteId),
      creator: event.args.creator,
      metadata: event.args.metadata,
    },
  };
};

const parseExecuteVoteEvent = (
  event: ArchivedExecuteVoteEvent | null,
): EventExecuteVote | null => {
  if (!event) {
    return null;
  }
  return {
    event: {
      transactionHash: event.transactionHash,
      blockNumber: BigInt(event.blockNumber),
    },
    executedAt: BigInt(event.executedAt),
  };
};

const parseVoteEvent = (event: ArchivedVoteEvent): VoteEvent => ({
  voter: event.voter,
  supports: event.supports,
  stake: BigInt(event.stake),
  delegatedVotes: event.delegatedVotes?.map((delegated) => ({
    voter: delegated.voter,
    supports: delegated.supports,
    stake: BigInt(delegated.stake),
  })),
});

const parseArchivedVote = (archived: ArchivedVote): ArchivedVoteResult => {
  const details = archived.voteDetails;
  const voteObject = {
    id: details.id,
    open: details.open,
    executed: details.executed,
    startDate: BigInt(details.startDate),
    snapshotBlock: BigInt(details.snapshotBlock),
    supportRequired: BigInt(details.supportRequired),
    minAcceptQuorum: BigInt(details.minAcceptQuorum),
    yea: BigInt(details.yea),
    nay: BigInt(details.nay),
    votingPower: BigInt(details.votingPower),
    script: details.script,
    phase: PHASE_MAP[details.phase] ?? VotePhase.Closed,
    canExecute: details.canExecute,
  };

  return {
    ...voteObject,
    state: getVoteState(voteObject, details.canExecute),
    startEvent: parseStartVoteEvent(archived.startVoteEvent),
    executeEvent: parseExecuteVoteEvent(archived.executeVoteEvent),
    voteEvents: archived.voteEvents.map(parseVoteEvent),
    description: archived.description ?? null,
  };
};

export const fetchArchivedVotes = async ({
  chainId,
  votingAddress,
  voteIds,
}: {
  chainId: number;
  votingAddress: Address;
  voteIds: (string | number)[];
}): Promise<Record<string, ArchivedVoteResult>> => {
  if (voteIds.length === 0) {
    return {};
  }

  const subset = await fetchCachedVoteEvents(chainId, votingAddress, voteIds);

  const result: Record<string, ArchivedVoteResult> = {};
  for (const [id, archived] of Object.entries(subset)) {
    result[id] = parseArchivedVote(archived);
  }
  return result;
};
