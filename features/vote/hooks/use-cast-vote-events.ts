import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { Voting } from 'shared/blockchain/contracts';
import { getCastVoteEvents } from '../utils/get-cast-vote-events';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { Vote } from 'shared/votes/types';

export const useCastVoteEvents = (
  vote: Vote | undefined,
  eventExecuteBlockNumber: bigint | null | undefined,
) => {
  const { chainId, rpcProvider } = useLidoSDK();
  const votingContractAddress = useContractAddress(Voting);

  return useQuery({
    queryKey: ['vote-cast-events', vote?.id, chainId],
    staleTime: Infinity,
    enabled: !!vote,
    queryFn: async () => {
      if (!vote) {
        return [];
      }
      let toBlock = eventExecuteBlockNumber;
      if (!toBlock) {
        toBlock = await rpcProvider.getBlockNumber();
      }

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
