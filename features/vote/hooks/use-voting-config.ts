import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { Voting } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';

export const useVotingConfig = () => {
  const { chainId } = useLidoSDK();
  const { readContract: readVotingContract } = useReadContract(Voting);

  return useQuery({
    queryKey: ['voting-config', chainId],
    staleTime: Infinity,
    queryFn: async () => {
      const [voteTime, objectionPhaseTime] = await Promise.all([
        readVotingContract('voteTime'),
        readVotingContract('objectionPhaseTime'),
      ]);

      return {
        voteTime: Number(voteTime),
        objectionPhaseTime: Number(objectionPhaseTime),
      };
    },
  });
};
