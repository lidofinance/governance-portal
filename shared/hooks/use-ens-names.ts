import { useLidoSDK } from '../../providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { Address, createPublicClient, http } from 'viem';
import { mainnet, hoodi } from 'viem/chains';
import { useGetRpcUrlByChainId } from '../../config/rpc';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

const IGNORE_GAIANETWORK_PATTERN = /https?:\/\/api\.gaianet\.ai(?=[:/?#]|$)/i;

const ENS_NAME_ADDRESS: Address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

const getChainWithCustomEns = (chainId: number) => {
  switch (chainId) {
    case CHAINS.Mainnet:
      return mainnet;
    case CHAINS.Hoodi:
      return {
        ...hoodi,
        contracts: {
          ...hoodi.contracts,
          ensRegistry: {
            address: ENS_NAME_ADDRESS,
          },
        },
      };
    default:
      return mainnet;
  }
};

export const useEnsNames = (addresses: string[]) => {
  const { chainId } = useLidoSDK();
  const getRpcUrl = useGetRpcUrlByChainId();

  const { data: ensNameList, isLoading: initialLoading } = useQuery({
    queryKey: ['ensNames', addresses, chainId],
    queryFn: async () => {
      const publicClient = createPublicClient({
        chain: getChainWithCustomEns(chainId || CHAINS.Mainnet),
        transport: http(getRpcUrl(chainId || CHAINS.Mainnet)),
      });

      const result: Record<string, string | null> = {};

      await Promise.all(
        addresses.map(async (address) => {
          try {
            const ensName = await publicClient.getEnsName({
              address: address as `0x${string}`,
            });
            result[address] = ensName;
          } catch (error) {
            const _error = error as Error;

            if (IGNORE_GAIANETWORK_PATTERN.test(_error.message)) {
              console.debug(
                'Ignoring CSP error for api.gaianet.ai -> request api.gaianet.ai blocked by CSP, GNS not supported',
              );
              result[address] = null;
              return;
            }
            throw error;
          }
        }),
      );

      return result;
    },
    enabled: addresses.length > 0,
  });

  return {
    data: ensNameList,
    initialLoading,
  };
};
