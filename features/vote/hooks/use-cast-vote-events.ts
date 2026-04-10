import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { Voting } from 'shared/blockchain/contracts';
import { getCastVoteEvents } from '../utils/get-cast-vote-events';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { Vote, VoteEvent } from 'shared/votes/types';

/**
 * Resolves the voters list for a vote. For archived votes the data is
 * already embedded in the parent `useVote` result — pass it via
 * `archivedVoteEvents` to short-circuit. For active votes this hook
 * does the chunked RPC scan.
 */
export const useCastVoteEvents = (
  vote: Vote | undefined,
  archivedVoteEvents: VoteEvent[] | null | undefined,
  eventExecuteBlockNumber: bigint | null | undefined,
) => {
  const { chainId, rpcProvider } = useLidoSDK();
  const votingContractAddress = useContractAddress(Voting);

  return useQuery({
    queryKey: ['vote-cast-events', vote?.id, chainId],
    staleTime: Infinity,
    enabled: !!vote && !archivedVoteEvents,
    initialData: archivedVoteEvents ?? undefined,
    queryFn: async () => {
      if (!vote) {
        return [];
      }

      const toBlock =
        eventExecuteBlockNumber ?? (await rpcProvider.getBlockNumber());

      return getCastVoteEvents({
        votingContractAddress,
        client: rpcProvider,
        voteId: BigInt(vote.id),
        fromBlock: vote.snapshotBlock,
        toBlock,
      });
    },
  });
};
