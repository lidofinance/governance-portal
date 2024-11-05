import { Token } from 'shared/blockchain/types';
import { Wrap } from './style';
import {
  formatEth,
  formatEthFull,
  getTokenIcon,
} from 'shared/blockchain/utils';
import { Text, Tooltip } from '@lidofinance/lido-ui';

type Props = {
  token: Token;
  balance: bigint | undefined;
  showZeroBalance?: boolean;
};

export const TokenBalanceWithIcon = (props: Props) => {
  const { token, balance, showZeroBalance = true } = props;

  if (balance === undefined || (!showZeroBalance && balance === 0n)) {
    return null;
  }

  return (
    <Wrap>
      {getTokenIcon(token)}
      <Tooltip
        placement="topLeft"
        title={<span>{formatEthFull(balance)}</span>}
      >
        <Text as="span" size="md" strong>
          {formatEth(balance)} {token}
        </Text>
      </Tooltip>
    </Wrap>
  );
};
