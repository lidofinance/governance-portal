import { ReactNode } from 'react';
import { Tooltip, PopoverPlacements } from '@lidofinance/lido-ui';
import { TooltipText } from '../vote-phases-tooltip/style';
import { KnownToken } from 'shared/blockchain/tokens';

type Props = {
  placement: PopoverPlacements;
  totalSupply: number;
  minQuorumSupply: number;
  children: ReactNode;
};

export const VoteQuorumStatusTooltip = ({
  placement = 'bottomLeft',
  totalSupply,
  minQuorumSupply,
  children,
}: Props) => {
  return (
    <Tooltip
      placement={placement}
      title={
        <TooltipText>
          To reach quorum, more than 5% of the total {KnownToken.LDO.symbol}{' '}
          supply must vote for one option.
          <br />
          Total Supply: {totalSupply.toLocaleString()}
          <br />
          Quorum: {minQuorumSupply.toLocaleString()}
        </TooltipText>
      }
    >
      <div>{children}</div>
    </Tooltip>
  );
};
