import { Token } from 'shared/blockchain/types';
import { TokenLabel, TokenBalanceStyled } from './style';
import {
  formatEth,
  formatEthFull,
  getTokenIcon,
} from 'shared/blockchain/utils';
import { Tooltip } from '@lidofinance/lido-ui';
import { Text } from '../text';

type Props = {
  token: Token;
  balance: bigint | undefined;
  variant?: 'default' | 'compact';
  showZeroBalance?: boolean;
};

export const TokenBalance = (props: Props) => {
  const { token, balance, variant, showZeroBalance = true } = props;

  if (balance === undefined || (!showZeroBalance && balance === 0n)) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <TokenBalanceStyled>
        {getTokenIcon(token)}
        <TokenLabel $compact>{token}</TokenLabel>
        <Text size={14} color="secondary">
          {formatEth(balance)}
        </Text>
      </TokenBalanceStyled>
    );
  }

  return (
    <TokenBalanceStyled>
      {getTokenIcon(token)}
      <Tooltip
        placement="topLeft"
        title={<span>{formatEthFull(balance)}</span>}
      >
        <TokenLabel>
          {formatEth(balance)} {token}
        </TokenLabel>
      </Tooltip>
    </TokenBalanceStyled>
  );
};
