import { Script } from 'features/dual-governance/evm-script-parsed';
import { useLidoSDK } from 'providers/lido-sdk';
import { Hex } from 'viem';
import { decodeCalls, decodeEvmScript } from 'utils/decode-evm-script-calls';

type Props = {
  script: Hex;
};
export const VoteScript = ({ script }: Props) => {
  const { chainId } = useLidoSDK();
  const decodedEvmScript = decodeEvmScript(script);
  const decodedEvmScriptCalls = decodeCalls({
    calls: decodedEvmScript,
    chainId,
  });

  return (
    <Script
      rawScript={script}
      decodedCalls={decodedEvmScriptCalls || []}
      tabVariant="voting"
    />
  );
};
