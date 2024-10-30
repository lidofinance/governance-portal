import { EVMScriptDecoder } from '@lidofinance/evm-script-decoder';
import { useEVMScriptDecoder } from './use-evm-script-decoder';
import { useLidoSWR, useSDK } from '@lido-sdk/react';

export const useDecodedScript = (script: string) => {
  const { chainId } = useSDK();
  const decoder = useEVMScriptDecoder();

  const { data, initialLoading } = useLidoSWR(
    ['swr:decode-script', chainId, decoder, script],
    (_, __, _decoder, _script) =>
      (_decoder as EVMScriptDecoder).decodeEVMScript(_script as string),
  );

  return {
    initialLoading,
    binary: script,
    decoded: data,
  };
};
