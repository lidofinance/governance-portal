import { Token } from 'shared/blockchain/types';
import { TokenLabel, TokenBalanceStyled } from './style';
import {
  formatEth,
  formatEthCompact,
  formatEthFull,
  getTokenIcon,
} from 'shared/blockchain/utils';
import { InlineLoader, Tooltip } from '@lidofinance/lido-ui';
import { Text } from '../text';
import { isBigInt } from 'shared/blockchain/isBigInt';

type Props = {
  token: Token;
  balance: bigint | undefined;
  variant?: 'default' | 'compact';
  showZeroBalance?: boolean;
};

export const TokenBalance = (props: Props) => {
  const { token, balance, variant, showZeroBalance = true } = props;

  if (!showZeroBalance && balance === 0n) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <TokenBalanceStyled>
        {getTokenIcon(token)}
        <TokenLabel $compact>{token}</TokenLabel>
        {isBigInt(balance) ? (
          <Tooltip
            placement="topRight"
            title={<span>{formatEthFull(balance)}</span>}
          >
            <Text size={14} color="secondary">
              {formatEthCompact(balance, 4)}
            </Text>
          </Tooltip>
        ) : (
          <InlineLoader />
        )}
      </TokenBalanceStyled>
    );
  }

  return (
    <TokenBalanceStyled>
      {getTokenIcon(token)}
      {isBigInt(balance) ? (
        <Tooltip
          placement="topLeft"
          title={<span>{formatEthFull(balance)}</span>}
        >
          <TokenLabel>
            {formatEth(balance)} {token}
          </TokenLabel>
        </Tooltip>
      ) : (
        <InlineLoader />
      )}
    </TokenBalanceStyled>
  );
};
