import { Script } from 'shared/components/evm-script-parsed';
import { Hex } from 'viem';
import { decodeEvmScript } from 'shared/blockchain/utils/decode-evm-script';
import { useMemo } from 'react';
import { useDecodedCalls } from 'shared/hooks';
import { useIsVoteApproved } from 'shared/votes/hooks/use-is-vote-approved';
import { AragonVoting } from 'shared/blockchain/contracts';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';

type Props = {
  voteId: number;
  script: Hex;
  metadata: string;
};
export const VoteScript = ({ voteId, script, metadata }: Props) => {
  const isApproved = useIsVoteApproved(voteId);
  const votingAddress = useContractAddress(AragonVoting);
  const calls = useMemo(() => decodeEvmScript(script), [script]);
  const decodedCalls = useDecodedCalls(
    isApproved ? calls : [],
    `vote-${votingAddress}-${voteId}`,
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
