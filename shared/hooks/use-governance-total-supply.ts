import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from '../../providers/lido-sdk';
import { useReadContract } from '../blockchain/hooks/use-read-contract';
import { DaoToken } from '../blockchain/contracts';

export const useGovernanceTotalSupply = () => {
  const { chainId } = useLidoSDK();
  const governanceToken = useReadContract(DaoToken);
  return useQuery({
    queryKey: ['governanceTotalSupply', chainId],
    queryFn: () => {
      return governanceToken.readContract('totalSupply');
    },
  });
};
