import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { Voting } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { fetchArchivedVotes } from 'shared/votes/utils/fetch-archived-votes';
import { fetchActiveVotes } from 'shared/votes/utils/fetch-active-votes';
import type { EventStartVote } from 'shared/votes/utils/get-event-start-vote';
import type { EventExecuteVote, Vote, VoteEvent } from 'shared/votes/types';

export type VoteFull = {
  vote: Vote;
  canExecute: boolean;
  eventStart: EventStartVote | null;
  eventExecute: EventExecuteVote | null;
  voteEvents: VoteEvent[] | null;
  description: string | null;
};

/**
 * Thin orchestrator. Tries the archived (JSON) path first; falls back to
 * the active (RPC) path if the vote is not in the cache. The two paths
 * are pure functions — this hook is just the React Query wrapper.
 */
export const useVote = (voteId: number, voteTime: number | undefined) => {
  const { chainId, rpcProvider } = useLidoSDK();
  const votingContract = useReadContract(Voting);

  return useQuery({
    queryKey: ['vote', voteId, chainId],
    staleTime: 5 * 60_000,
    enabled: !!voteTime,
    queryFn: async (): Promise<VoteFull | null> => {
      const archived = await fetchArchivedVotes({
        chainId,
        votingAddress: votingContract.address,
        voteIds: [voteId],
      });

      const archivedVote = archived[voteId.toString()];
      if (archivedVote) {
        return {
          vote: archivedVote,
          canExecute: archivedVote.canExecute,
          eventStart: archivedVote.startEvent,
          eventExecute: archivedVote.executeEvent,
          voteEvents: archivedVote.voteEvents,
          description: archivedVote.description,
        };
      }

      // Not in archive — fetch live state from chain.
      const votesLength = Number(
        await votingContract.readContract('votesLength'),
      );
      if (voteId >= votesLength) {
        return null;
      }

      const [active] = await fetchActiveVotes({
        votingContract,
        client: rpcProvider,
        voteIds: [voteId],
        withEvents: true,
      });

      if (!active) {
        return null;
      }

      return {
        vote: active,
        canExecute: active.canExecute,
        eventStart: active.startEvent,
        eventExecute: active.executeEvent,
        voteEvents: null,
        description: null,
      };
    },
  });
};
