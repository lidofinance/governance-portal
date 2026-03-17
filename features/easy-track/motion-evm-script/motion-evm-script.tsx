import { useMemo } from 'react';
import { Motion, RawMotionSubgraph } from '../types';
import { decodeEvmScript } from 'shared/blockchain/utils/decode-evm-script';
import { Script } from '../../dual-governance/evm-script-parsed';
import { useDecodedCalls } from 'shared/hooks';

type Props = {
  motion: Motion | RawMotionSubgraph;
};
export const MotionEvmScript = ({ motion }: Props) => {
  const decoded = useMemo(
    () => (motion.evmScript ? decodeEvmScript(motion.evmScript) : []),
    [motion.evmScript],
  );
  const decodedEvmScriptCalls = useDecodedCalls(decoded, `motion-${motion.id}`);

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
