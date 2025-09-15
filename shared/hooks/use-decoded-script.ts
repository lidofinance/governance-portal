import { useEVMScriptDecoder } from './use-evm-script-decoder';
import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';

export const useDecodedScript = (script: string) => {
  const { chainId } = useLidoSDK();
  const decoder = useEVMScriptDecoder();

  const { data, isLoading } = useQuery({
    queryKey: ['useDecodedScript', chainId, decoder, script],
    queryFn: async () => await decoder.decodeEVMScript(script),
    enabled: !!script,
    staleTime: Infinity,
  });

  return {
    initialLoading: isLoading,
    binary: script,
    decoded: data,
  };
};
