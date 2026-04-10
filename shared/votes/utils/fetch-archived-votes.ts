import type { Address, Hex } from 'viem';
import type {
  ArchivedStartVoteEvent,
  ArchivedExecuteVoteEvent,
  ArchivedVote,
  ArchivedVoteEvent,
  VoteEventsSubset,
} from 'pages/api/votes/types';
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

const BATCH_SIZE = 12;

const PHASE_MAP: Record<number, VotePhase> = {
  0: VotePhase.Main,
  1: VotePhase.Objection,
  2: VotePhase.Closed,
};

const parseStartVoteEvent = (
  e: ArchivedStartVoteEvent | null,
): EventStartVote | null => {
  if (!e) {
    return null;
  }
  return {
    event: {
      transactionHash: e.transactionHash as Hex,
      blockNumber: BigInt(e.blockNumber),
    },
    args: {
      voteId: BigInt(e.args.voteId),
      creator: e.args.creator,
      metadata: e.args.metadata,
    },
  };
};

const parseExecuteVoteEvent = (
  e: ArchivedExecuteVoteEvent | null,
): EventExecuteVote | null => {
  if (!e) {
    return null;
  }
  return {
    event: {
      transactionHash: e.transactionHash as Hex,
      blockNumber: BigInt(e.blockNumber),
    },
    executedAt: BigInt(e.executedAt),
  };
};

const parseVoteEvent = (e: ArchivedVoteEvent): VoteEvent => ({
  voter: e.voter,
  supports: e.supports,
  stake: BigInt(e.stake),
  delegatedVotes: e.delegatedVotes?.map((d) => ({
    voter: d.voter,
    supports: d.supports,
    stake: BigInt(d.stake),
  })),
});

const parseArchivedVote = (archived: ArchivedVote): ArchivedVoteResult => {
  const d = archived.voteDetails;
  const voteObject = {
    id: d.id,
    open: d.open,
    executed: d.executed,
    startDate: BigInt(d.startDate),
    snapshotBlock: BigInt(d.snapshotBlock),
    supportRequired: BigInt(d.supportRequired),
    minAcceptQuorum: BigInt(d.minAcceptQuorum),
    yea: BigInt(d.yea),
    nay: BigInt(d.nay),
    votingPower: BigInt(d.votingPower),
    script: d.script as Hex,
    phase: PHASE_MAP[d.phase] ?? VotePhase.Closed,
    canExecute: d.canExecute,
  };

  return {
    ...voteObject,
    state: getVoteState(voteObject, d.canExecute),
    startEvent: parseStartVoteEvent(archived.startVoteEvent),
    executeEvent: parseExecuteVoteEvent(archived.executeVoteEvent),
    voteEvents: archived.voteEvents.map(parseVoteEvent),
    description: archived.description ?? null,
  };
};

const fetchArchivedVoteEventsBatched = async (
  chainId: number,
  votingAddress: Address,
  voteIds: (string | number)[],
): Promise<VoteEventsSubset> => {
  const batches: (string | number)[][] = [];
  for (let i = 0; i < voteIds.length; i += BATCH_SIZE) {
    batches.push(voteIds.slice(i, i + BATCH_SIZE));
  }

  const results = await Promise.all(
    batches.map(async (batch) => {
      const ids = batch.map(String).join(',');

      try {
        const response = await fetch(
          `/api/votes/events?chainId=${chainId}&votingAddress=${votingAddress}&voteIds=${encodeURIComponent(ids)}`,
        );

        if (!response.ok) {
          if (response.status !== 404) {
            console.warn(
              'fetchArchivedVotes: unexpected status',
              response.status,
            );
          }
          return {};
        }

        return (await response.json()) as VoteEventsSubset;
      } catch (err) {
        console.warn('fetchArchivedVotes: network error', err);
        return {};
      }
    }),
  );

  return Object.assign({}, ...results) as VoteEventsSubset;
};

/**
 * Pure JSON reader for archived votes. Returns a map keyed by vote ID.
 * Votes not present in the archive are silently omitted — callers detect
 * cache misses by checking which IDs are missing from the result.
 *
 * No RPC, no fallback, no type converters interleaved with logic.
 */
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

  const subset = await fetchArchivedVoteEventsBatched(
    chainId,
    votingAddress,
    voteIds,
  );

  const result: Record<string, ArchivedVoteResult> = {};
  for (const [id, archived] of Object.entries(subset)) {
    result[id] = parseArchivedVote(archived);
  }
  return result;
};
