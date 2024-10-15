import { CHAINS } from '@lido-sdk/constants';
import { EVMScriptDecoder } from '@lidofinance/evm-script-decoder';
import { useLidoSWR } from '@lido-sdk/react';
import { useEVMScriptDecoder } from './useEvmScriptDecoder';
import { useLidoSDK } from '../../providers/lido-sdk';

export function useDecodedScript(script: string) {
  const {
    core: { chainId },
  } = useLidoSDK();
  const decoder = useEVMScriptDecoder();

  const { data, initialLoading } = useLidoSWR(
    ['swr:decode-script', chainId, decoder, script],
    (
      _key: string,
      _chainId: CHAINS,
      _decoder: EVMScriptDecoder,
      _script: string,
    ) => _decoder.decodeEVMScript(_script),
  );

  return {
    initialLoading,
    binary: script,
    decoded: data,
  };
}
