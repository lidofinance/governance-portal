// TODO: move to shared components
import { Script } from 'features/dual-governance/evm-script-parsed';
import { Hex } from 'viem';
import { decodeEvmScript } from 'shared/blockchain/utils/decode-evm-script';
import { useMemo } from 'react';
import { useDecodedCalls } from 'shared/hooks';

type Props = {
  voteId: number;
  script: Hex;
  metadata: string;
};
export const VoteScript = ({ voteId, script, metadata }: Props) => {
  const calls = useMemo(() => decodeEvmScript(script), [script]);
  const decodedCalls = useDecodedCalls(calls, `vote-${voteId}`);

  return (
    <Script
      rawScript={script}
      decodedCalls={decodedCalls}
      metadata={metadata}
      tabVariant="voting"
    />
  );
};
