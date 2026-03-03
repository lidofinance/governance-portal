import { Script } from 'features/dual-governance/evm-script-parsed';
import { useLidoSDK } from 'providers/lido-sdk';
import { Hex } from 'viem';
import { decodeCalls, decodeEvmScript } from 'utils/decode-evm-script-calls';
import { useMemo } from 'react';

type Props = {
  script: Hex;
  metadata: string;
};
export const VoteScript = ({ script, metadata }: Props) => {
  const { chainId } = useLidoSDK();

  const decodedCalls = useMemo(
    () =>
      decodeCalls({
        calls: decodeEvmScript(script),
        chainId,
      }),
    [script, chainId],
  );

  return (
    <Script
      rawScript={script}
      decodedCalls={decodedCalls}
      metadata={metadata}
      tabVariant="voting"
    />
  );
};
