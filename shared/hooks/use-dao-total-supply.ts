import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from '../../providers/lido-sdk';
import { useReadContract } from '../blockchain/hooks/use-read-contract';
import { LDOToken } from '../blockchain/contracts';

export const useDaoTokenTotalSupply = () => {
  const { chainId } = useLidoSDK();
  const governanceToken = useReadContract(LDOToken);
  return useQuery({
    queryKey: ['dao-token-total-supply', chainId],
    queryFn: () => governanceToken.readContract('totalSupply'),
  });
};
