import { Motion, RawMotionSubgraph } from '../types';
import { decodeCalls, decodeEvmScript } from 'utils/decode-evm-script-calls';
import { Hex } from 'viem';
import { useLidoSDK } from 'providers/lido-sdk';
import { Script } from '../../dual-governance/evm-script-parsed';

type Props = {
  motion: Motion | RawMotionSubgraph;
};
export const MotionEvmScript = ({ motion }: Props) => {
  const { chainId } = useLidoSDK();
  const decoded = decodeEvmScript(motion.evmScriptHash as Hex);
  const decodedEvmScriptCalls = decodeCalls({
    calls: decoded,
    chainId,
  });

  return (
    <Script
      rawScript={motion.evmScriptHash as Hex}
      decodedCalls={decodedEvmScriptCalls || []}
      tabVariant="voting"
    />
  );
};
