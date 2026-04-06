import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { Voting } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { parseVote } from 'shared/votes/utils/parse-vote';
import { getEventStartVote } from 'shared/votes/utils/get-event-start-vote';
export const useVote = (voteId: number) => {
  const { chainId, rpcProvider } = useLidoSDK();
  const votingContract = useReadContract(Voting);

  return useQuery({
    queryKey: ['vote', voteId, chainId],
    staleTime: 5 * 60_000, // 5 minutes
    queryFn: async () => {
      const voteIdBigInt = BigInt(voteId);

      const voteRaw = await votingContract.readContract('getVote', [
        voteIdBigInt,
      ]);

      if (voteRaw === null) {
        return null;
      }

      const canExecute = await votingContract.readContract('canExecute', [
        voteIdBigInt,
      ]);

      const vote = parseVote(voteIdBigInt, voteRaw, canExecute);

      const eventStart = await getEventStartVote({
        address: votingContract.address,
        client: rpcProvider,
        voteId: voteIdBigInt,
        fromBlock: vote.snapshotBlock,
      });

      return {
        vote,
        canExecute,
        eventStart,
      };
    },
  });
};
