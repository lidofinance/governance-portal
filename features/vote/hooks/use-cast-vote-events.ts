import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { Voting } from 'shared/blockchain/contracts';
import { getCastVoteEvents } from '../utils/get-cast-vote-events';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { Vote } from 'shared/votes/types';
import { estimateExecuteVoteBlockRange } from 'shared/votes/utils/estimate-execute-vote-block-range';

export const useCastVoteEvents = (
  vote: Vote | undefined,
  voteTime: number | undefined,
) => {
  const { chainId, rpcProvider } = useLidoSDK();
  const votingContractAddress = useContractAddress(Voting);

  return useQuery({
    queryKey: ['vote-cast-events', vote?.id, chainId],
    staleTime: Infinity,
    enabled: !!vote && !!voteTime,
    queryFn: async () => {
      if (!vote || !voteTime) {
        return [];
      }

      const latestBlock = await rpcProvider.getBlock({ blockTag: 'latest' });
      const { voteEndBlock } = estimateExecuteVoteBlockRange({
        snapshotBlockNumber: vote.snapshotBlock,
        startDate: vote.startDate,
        voteTimeSecs: voteTime,
        latestBlock,
      });

      // Cast votes only happen while the vote is open (before voteEndBlock).
      // Cap at latestBlock for votes that are still active.
      const toBlock =
        voteEndBlock < latestBlock.number ? voteEndBlock : latestBlock.number;

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
