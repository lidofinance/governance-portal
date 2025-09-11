import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Voting } from 'shared/blockchain/contracts';
import { usePublicClient } from 'wagmi';
import { useLidoSDK } from 'providers/lido-sdk';
import { fetchAragonVotes } from '../utils/fetch-aragon-votes';

type Props = {
  limit: number;
  shouldGetActive?: boolean;
};

export const useActiveVotes = ({ limit, shouldGetActive = true }: Props) => {
  const votingContract = useReadContract(Voting);
  const client = usePublicClient();
  const { chainId } = useLidoSDK();

  return useQuery({
    queryKey: ['active-votes', limit, chainId],
    queryFn: async () => {
      try {
        const votes = await fetchAragonVotes({
          votingContract,
          limit,
          client,
          onlyActive: shouldGetActive,
        });

        if (votes.length === 0) {
          return { votes: [] };
        }

        const [voteTime, objectionPhaseTime] = await Promise.all([
          votingContract.readContract('voteTime'),
          votingContract.readContract('objectionPhaseTime'),
        ]);

        const parsedVotes = votes.map((vote) => {
          return {
            voteId: vote.id,
            proposalId: vote.id,
            vote,
            canExecute: vote.canExecute,
            event: vote.startEvent,
            state: vote.state,
            voteTime: Number(voteTime),
            objectionPhaseTime: Number(objectionPhaseTime),
          };
        });

        return {
          votes: parsedVotes,
        };
      } catch (e) {
        console.error('Error in useActiveVotes:', e);
        return { votes: [] };
      }
    },
  });
};
