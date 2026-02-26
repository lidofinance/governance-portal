import { Address } from 'viem';
import { useLidoSDK } from '../../providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';

const IGNORE_GAIANETWORK_PATTERN = /https?:\/\/api\.gaianet\.ai(?=[:/?#]|$)/i;

export const useEnsNames = (addresses: Address[], voteId: number) => {
  const { chainId, rpcProvider } = useLidoSDK();

  return useQuery({
    queryKey: ['ens-names', chainId, voteId],
    enabled: addresses.length > 0,
    staleTime: Infinity,
    queryFn: async () => {
      const result: Record<string, string | null> = {};

      await Promise.all(
        addresses.map(async (address) => {
          try {
            const ensName = await rpcProvider.getEnsName({ address });
            result[address] = ensName;
          } catch (error) {
            const _error = error as Error;

            if (IGNORE_GAIANETWORK_PATTERN.test(_error.message)) {
              console.debug(
                'Ignoring CSP error for api.gaianet.ai -> request api.gaianet.ai blocked by CSP, GNS not supported',
              );
              result[address] = null;
            }
          }
        }),
      );

      return result;
    },
  });
};
