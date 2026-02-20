import { useMemo } from 'react';
import { useLidoSDK } from 'providers/lido-sdk';
import { RewardProgramRegistry } from 'shared/blockchain/contracts';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';

type RewardProgram = {
  title: string;
  address: string;
};

/**
 * @deprecated
 */
const useRewardProgramsMap = (
  programs: UseQueryResult<RewardProgram[] | null>,
) => {
  const result = useMemo(() => {
    if (!programs.data) return null;
    return programs.data.reduce(
      (res, p) => ({ [p.address]: p.title, ...res }),
      {} as Record<string, string>,
    );
  }, [programs.data]);

  return {
    ...programs,
    data: result,
  };
};

/**
 * @deprecated
 */
export const useRewardProgramsAll = () => {
  const { chainId } = useLidoSDK();
  const rewardProgramRegistry = useReadContract(RewardProgramRegistry);

  return useQuery({
    queryKey: ['reward-programs-all', chainId, rewardProgramRegistry.address],
    queryFn: async () => {
      const programs =
        await rewardProgramRegistry.readContract('getRewardPrograms');
      return programs.map((address) => ({
        title: address,
        address,
      }));
    },
    retry: true,
    retryDelay: 5000,
  });
};

/**
 * @deprecated
 */
export const useRewardProgramsMapAll = () => {
  const partners = useRewardProgramsAll();
  return useRewardProgramsMap(partners);
};
