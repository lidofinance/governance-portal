import { useQuery } from '@tanstack/react-query';
import { useConfig } from 'config';
import { useLidoSDK } from 'providers/lido-sdk';
import {
  BaseCall,
  decodeCalls,
  DecodedCall,
} from 'utils/decode-evm-script-calls';

export const useDecodedCalls = <Call extends BaseCall>(
  calls: Call[],
  queryKey: string,
): DecodedCall[] => {
  const { chainId, rpcProvider } = useLidoSDK();
  const { userConfig } = useConfig();
  const { useBundledAbi, etherscanApiKey } = userConfig.savedUserConfig;

  const { data } = useQuery<DecodedCall[]>({
    queryKey: [`decoded-calls`, queryKey, chainId, useBundledAbi],
    staleTime: Infinity,
    enabled: calls.length > 0,
    queryFn: async () =>
      decodeCalls(calls, {
        chainId,
        fetchPolicy: useBundledAbi ? 'local-first' : 'etherscan-only',
        etherscanApiKey,
        client: rpcProvider,
      }),
  });

  return data ?? [];
};
