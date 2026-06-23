import { useQuery } from '@tanstack/react-query';
import { useConfig } from 'config';
import { useLidoSDK } from 'providers/lido-sdk';
import { Voting } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { fetchCachedVotes } from 'shared/votes/utils/fetch-cached-votes';
import { fetchUncachedVotes } from 'shared/votes/utils/fetch-uncached-votes';
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
  const { useLocalCache } = useConfig().userConfig.savedUserConfig;
  const votingContract = useReadContract(Voting);

  return useQuery({
    queryKey: ['vote', voteId, chainId, useLocalCache],
    staleTime: 5 * 60_000, // 5 minutes
    enabled: !!voteTime,
    queryFn: async (): Promise<VoteFull | null> => {
      if (voteTime === undefined) {
        return null;
      }

      const cachedVotesMap = await fetchCachedVotes({
        chainId,
        votingAddress: votingContract.address,
        voteIds: [voteId],
        useLocalCache,
      });

      const cachedVote = cachedVotesMap[voteId.toString()];
      if (cachedVote) {
        return {
          vote: cachedVote,
          canExecute: cachedVote.canExecute,
          eventStart: cachedVote.startEvent,
          eventExecute: cachedVote.executeEvent,
          voteEvents: cachedVote.voteEvents,
          description: cachedVote.description,
        };
      }

      // Not in cache — fetch live state from chain.
      const votesLength = Number(
        await votingContract.readContract('votesLength'),
      );
      if (voteId >= votesLength) {
        return null;
      }

      const [uncachedVote] = await fetchUncachedVotes({
        votingContract,
        client: rpcProvider,
        voteIds: [voteId],
        voteTime,
        withExecuteEvent: true,
      });

      if (!uncachedVote) {
        return null;
      }

      return {
        vote: uncachedVote,
        canExecute: uncachedVote.canExecute,
        eventStart: uncachedVote.startEvent,
        eventExecute: uncachedVote.executeEvent,
        voteEvents: null,
        description: null,
      };
    },
  });
};
