import {
  External,
  Link,
  PopoverPlacements,
  Tooltip,
} from '@lidofinance/lido-ui';
import { LinkWrap, TooltipText } from './style';

import { useLidoSDK } from 'providers/lido-sdk';
import { VotePhase } from 'shared/votes/types';
import { getEtherscanTxLink } from 'utils/etherscan';

type Props = {
  placement: PopoverPlacements;
  children: React.ReactNode;
  executedTxHash?: string | null;
  votePhase?: VotePhase;
};

export const VotePhasesTooltip = ({
  placement = 'bottomLeft',
  executedTxHash,
  children,
  votePhase,
}: Props) => {
  const { chainId } = useLidoSDK();
  return (
    <Tooltip
      placement={placement}
      title={
        <TooltipText>
          {votePhase !== VotePhase.Closed && (
            <>
              Each voting comes in two phases.
              <br />
              In the first phase (or&nbsp;Main&nbsp;phase), participants can
              either vote pro or contra, whereas in the second phase only
              objections can be submitted.
            </>
          )}
          {executedTxHash && (
            <LinkWrap>
              Executed. See on Etherscan:
              <Link href={getEtherscanTxLink(chainId, executedTxHash)}>
                <External />
              </Link>
            </LinkWrap>
          )}
        </TooltipText>
      }
    >
      {/* Wrapped with div to make tooltip work properly with any children */}
      <p>{children}</p>
    </Tooltip>
  );
};
