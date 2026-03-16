import { useMemo } from 'react';
import { Motion, RawMotionSubgraph } from '../types';
import { decodeEvmScript } from 'utils/decode-evm-script-calls';
import { useLidoSDK } from 'providers/lido-sdk';
import { Script } from '../../dual-governance/evm-script-parsed';
import { useDecodedCalls } from 'shared/hooks';

type Props = {
  motion: Motion | RawMotionSubgraph;
};
export const MotionEvmScript = ({ motion }: Props) => {
  const { chainId } = useLidoSDK();

  const decoded = useMemo(
    () => (motion.evmScript ? decodeEvmScript(motion.evmScript) : []),
    [motion.evmScript],
  );
  const decodedEvmScriptCalls = useDecodedCalls(decoded, chainId);

  if (!motion.evmScript) {
    return null;
  }

  return (
    <Script
      rawScript={motion.evmScript}
      decodedCalls={decodedEvmScriptCalls || []}
      tabVariant="voting"
    />
  );
};
