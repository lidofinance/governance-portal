import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EasyTrack } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { Motion } from '../types';

export const useActiveMotions = () => {
  const easyTrack = useReadContract(EasyTrack);
  const { chainId } = useLidoSDK();

  return useQuery({
    queryKey: ['active-motions', chainId],
    queryFn: async () => {
      return (await easyTrack.readContract('getMotions')) as Motion[];
    },
  });
};
