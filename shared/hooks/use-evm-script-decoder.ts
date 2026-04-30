import {
  ABIProvider,
  ABIElement as ABIElementImported,
} from '@lidofinance/evm-script-decoder/lib/types';

import {
  EVMScriptDecoder,
  abiProviders,
} from '@lidofinance/evm-script-decoder';

import { useGetRpcUrlByChainId } from 'config/rpc';
import { useLidoSDK } from 'providers/lido-sdk';
import { fetcherEtherscan } from 'utils/fetcher-etherscan';
import { useConfig } from 'config';
import { Address, createPublicClient, getContract, http } from 'viem';
import { useAbiMap } from './use-abi-map';
import { useMemo } from 'react';

/**
 The only reason we still keep EVMScriptDecoder is to check whether the ongoing Aragon vote item has Unknown contracts.
 We need later to move on to Viem parsing as we do for the parsed calls of the DG Items
 */

export const useEVMScriptDecoder = (): EVMScriptDecoder => {
  const { chainId } = useLidoSDK();
  const { userConfig } = useConfig();
  const { etherscanApiKey, useBundledAbi } = userConfig.savedUserConfig;
  const getRpcUrlByChainId = useGetRpcUrlByChainId();
  const rpcUrl = getRpcUrlByChainId(chainId);
  const abiMap = useAbiMap();

  return useMemo(() => {
    const localDecoder = new abiProviders.Local(
      abiMap as Record<string, ABIElementImported[]>,
    );

    const etherscanDecoder = new abiProviders.Base({
      fetcher: async (address) => {
        const res = await fetcherEtherscan<string>({
          chainId,
          address,
          module: 'contract',
          action: 'getabi',
          apiKey: etherscanApiKey,
        });
        return JSON.parse(res);
      },
      middlewares: [
        abiProviders.middlewares.ProxyABIMiddleware({
          implMethodNames: [
            ...abiProviders.middlewares.ProxyABIMiddleware
              .DefaultImplMethodNames,
            '__Proxy_implementation',
            'proxy__getImplementation',
          ],
          loadImplAddress: async (_proxyAddress, _abiElement) => {
            try {
              const publicClient = createPublicClient({
                transport: http(rpcUrl),
              });

              const contract = getContract({
                address: _proxyAddress as Address,
                abi: [_abiElement],
                client: publicClient,
              });

              const result = await contract.read[_abiElement.name]();
              return typeof result === 'string' ? result : undefined;
            } catch (error) {
              return undefined;
            }
          },
        }),
      ],
    });

    return new EVMScriptDecoder(
      ...([useBundledAbi && localDecoder, etherscanDecoder].filter(
        Boolean,
      ) as ABIProvider[]),
    );
  }, [abiMap, chainId, etherscanApiKey, rpcUrl, useBundledAbi]);
};
