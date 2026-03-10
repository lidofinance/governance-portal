import { Motion, RawMotionSubgraph } from '../types';
import { decodeCalls, decodeEvmScript } from 'utils/decode-evm-script-calls';
import { useLidoSDK } from 'providers/lido-sdk';
import { Script } from '../../dual-governance/evm-script-parsed';

type Props = {
  motion: Motion | RawMotionSubgraph;
};
export const MotionEvmScript = ({ motion }: Props) => {
  const { chainId } = useLidoSDK();

  if (!motion.evmScript) return null;

  const decoded = decodeEvmScript(motion.evmScript);
  const decodedEvmScriptCalls = decodeCalls({
    calls: decoded,
    chainId,
  });

  return (
    <Script
      rawScript={motion.evmScript}
      decodedCalls={decodedEvmScriptCalls || []}
      tabVariant="voting"
    />
  );
};
