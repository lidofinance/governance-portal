import { Address } from 'viem';
import { useLidoSDK } from '../../providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';

export const useEnsNames = (addresses: Address[], voteId: number) => {
  const { chainId, rpcProvider } = useLidoSDK();

  return useQuery({
    queryKey: ['ens-names', chainId, voteId, addresses],
    enabled: addresses.length > 0,
    staleTime: Infinity,
    queryFn: async () => {
      const result: Record<string, string | null> = {};

      await Promise.all(
        addresses.map(async (address) => {
          try {
            const ensName = await rpcProvider.getEnsName({ address });
            result[address] = ensName;
          } catch {
            result[address] = null;
          }
        }),
      );

      return result;
    },
  });
};
