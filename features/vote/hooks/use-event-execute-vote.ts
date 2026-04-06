import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { Voting } from 'shared/blockchain/contracts';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { getEventExecuteVote } from 'shared/votes/utils/get-event-execute-vote';
import { estimateExecuteVoteBlockRange } from 'shared/votes/utils/estimate-execute-vote-block-range';
import { Vote } from 'shared/votes/types';

export const useEventExecuteVote = (
  vote: Vote | undefined,
  voteTime: number | undefined,
) => {
  const { chainId, rpcProvider } = useLidoSDK();
  const votingContractAddress = useContractAddress(Voting);

  return useQuery({
    queryKey: ['event-execute-vote', vote?.id, chainId],
    staleTime: Infinity,
    enabled: !!vote?.executed && !!voteTime,
    queryFn: async () => {
      if (!vote || !voteTime) {
        return null;
      }

      const latestBlock = await rpcProvider.getBlock({ blockTag: 'latest' });
      const { fromBlock, toBlock } = estimateExecuteVoteBlockRange({
        snapshotBlockNumber: vote.snapshotBlock,
        startDate: vote.startDate,
        voteTimeSecs: voteTime,
        latestBlock,
      });

      return getEventExecuteVote({
        address: votingContractAddress,
        client: rpcProvider,
        voteId: BigInt(vote.id),
        fromBlock,
        toBlock,
      });
    },
  });
};
