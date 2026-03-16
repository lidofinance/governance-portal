// TODO: move to shared components
import { Script } from 'features/dual-governance/evm-script-parsed';
import { useLidoSDK } from 'providers/lido-sdk';
import { Hex } from 'viem';
import { decodeEvmScript } from 'utils/decode-evm-script-calls';
import { useMemo } from 'react';
import { useDecodedCalls } from 'shared/hooks';

type Props = {
  script: Hex;
  metadata: string;
};
export const VoteScript = ({ script, metadata }: Props) => {
  const { chainId } = useLidoSDK();

  const calls = useMemo(() => decodeEvmScript(script), [script]);
  const decodedCalls = useDecodedCalls(calls, chainId);

  return (
    <Script
      rawScript={script}
      decodedCalls={decodedCalls}
      metadata={metadata}
      tabVariant="voting"
    />
  );
};
