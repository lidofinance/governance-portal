import { ReactNode } from 'react';
import { Tooltip, PopoverPlacements } from '@lidofinance/lido-ui';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { TooltipText } from '../vote-phases-tooltip/style';

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
  const { data: tokenData } = useGovernanceToken();

  return (
    <Tooltip
      placement={placement}
      title={
        <TooltipText>
          To reach quorum, more than 5% of the total {tokenData?.symbol} supply
          must vote for one option.
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
