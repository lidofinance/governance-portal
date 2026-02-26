import { useQuery } from '@tanstack/react-query';
import { DaoToken, Voting } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useAccount } from 'wagmi';

export const useVoterState = (
  voteId: number | undefined,
  voteSnapshotBlock: bigint | undefined,
) => {
  const { address } = useAccount();

  const { readContract: readDaoTokenContract } = useReadContract(DaoToken);
  const { readContract: readVotingContract } = useReadContract(Voting);

  return useQuery({
    queryKey: ['voter-state', address, voteId],
    enabled:
      !!address && voteId !== undefined && voteSnapshotBlock !== undefined,
    staleTime: Infinity,
    queryFn: async () => {
      if (!address || voteId === undefined || voteSnapshotBlock === undefined) {
        return null;
      }

      const [voterState, voterDaoTokenBalance] = await Promise.all([
        readVotingContract('getVoterState', [BigInt(voteId), address]),
        readDaoTokenContract('balanceOfAt', [address, voteSnapshotBlock]),
      ]);

      return {
        voterState,
        voterDaoTokenBalance,
      };
    },
  });
};
