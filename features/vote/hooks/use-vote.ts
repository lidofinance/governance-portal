import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { Voting } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { parseVote } from 'shared/votes/utils/parse-vote';
import { getEventStartVote } from 'shared/votes/utils/get-event-start-vote';
import { getEventExecuteVote } from 'shared/votes/utils/get-event-execute-vote';

export const useVote = (voteId: number, voteTime: number | undefined) => {
  const { chainId, rpcProvider } = useLidoSDK();
  const votingContract = useReadContract(Voting);

  return useQuery({
    queryKey: ['vote', voteId, chainId],
    staleTime: 5 * 60_000, // 5 minutes
    enabled: !!voteTime,
    queryFn: async () => {
      const votesLength = Number(
        await votingContract.readContract('votesLength'),
      );

      if (voteId >= votesLength) {
        return null;
      }

      const voteIdBigInt = BigInt(voteId);

      const [voteRaw, canExecute] = await Promise.all([
        votingContract.readContract('getVote', [voteIdBigInt]),
        votingContract.readContract('canExecute', [voteIdBigInt]),
      ]);

      const vote = parseVote(voteIdBigInt, voteRaw, canExecute);

      const { snapshotBlock, executed } = vote;

      const [eventStart, eventExecute] = await Promise.all([
        getEventStartVote({
          address: votingContract.address,
          client: rpcProvider,
          voteId: voteIdBigInt,
          fromBlock: snapshotBlock,
        }),
        executed
          ? getEventExecuteVote({
              address: votingContract.address,
              client: rpcProvider,
              voteId: voteIdBigInt,
              fromBlock: snapshotBlock,
            })
          : null,
      ]);

      return {
        vote,
        canExecute,
        eventStart,
        eventExecute,
      };
    },
  });
};
