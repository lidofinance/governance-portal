import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { isContract } from 'shared/blockchain/is-contract';
import { useAccount } from 'wagmi';

export const useIsMultisig = () => {
  const { address } = useAccount();
  const { chainId, core } = useLidoSDK();

  return useQuery({
    queryKey: ['is-multisig', chainId],
    staleTime: Infinity,
    enabled: !!address,
    queryFn: async () => {
      if (!address) return false;

      return isContract(address, core);
    },
  });
};
