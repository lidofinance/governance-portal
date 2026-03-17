import { Token } from 'shared/blockchain/types';
import { TokenLabel, TokenBalanceStyled } from './style';
import {
  formatEth,
  formatEthCompact,
  formatEthFull,
  getTokenIcon,
} from 'shared/blockchain/utils';
import { InlineLoader, Tooltip } from '@lidofinance/lido-ui';
import { Box } from 'shared/components/box';
import { Text } from '../text';
import { isBigInt } from 'shared/blockchain/is-bigint';
import { useEffect, useState } from 'react';
import { useStETHConversion } from 'features/dual-governance/hooks/use-steth-conversion';

type Props = {
  token: Token | 'ETH' | 'unstETH';
  balance: bigint | undefined;
  variant?: 'default' | 'compact';
  addOnText?: string;
  showZeroBalance?: boolean;
  shouldConvertShares?: boolean;
};

const MAX_SCREEN_WIDTH_NFT_TABLET = 1262;

export const TokenBalance = (props: Props) => {
  const {
    token,
    balance,
    variant,
    addOnText,
    showZeroBalance = true,
    shouldConvertShares,
  } = props;
  const [isNftShortView, setIsNftShortView] = useState<boolean>(false);

  // convert stETH shares
  const { data: convertedStETHLockedShares } = useStETHConversion(
    shouldConvertShares && balance ? balance : 0n,
  );

  // This is to replace Withdrawal NFT label with NFT with no affect to types and constants
  useEffect(() => {
    const handleResize = () => {
      setIsNftShortView(window.innerWidth <= MAX_SCREEN_WIDTH_NFT_TABLET);
    };

    handleResize();

    const observer = new ResizeObserver(() => {
      handleResize();
    });

    observer.observe(document.body);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!showZeroBalance && balance === 0n) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        flexWrap={'wrap'}
        gap={8}
      >
        {getTokenIcon(token)}
        <TokenBalanceStyled>
          <TokenLabel $compact>
            {token === 'Withdrawal NFT'
              ? isNftShortView
                ? 'NFT'
                : token
              : token}
          </TokenLabel>
          {isBigInt(balance) ? (
            <Tooltip
              placement="topRight"
              title={
                <span>
                  {formatEthFull(
                    shouldConvertShares && convertedStETHLockedShares
                      ? convertedStETHLockedShares
                      : balance,
                  )}
                </span>
              }
            >
              <Text size={14} color="secondary">
                {balance === 0n
                  ? '\u2014'
                  : formatEthCompact(
                      shouldConvertShares && convertedStETHLockedShares
                        ? convertedStETHLockedShares
                        : balance,
                      4,
                    )}
              </Text>
            </Tooltip>
          ) : (
            <InlineLoader />
          )}
        </TokenBalanceStyled>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-start" gap={8}>
      {getTokenIcon(token)}
      <TokenBalanceStyled>
        {isBigInt(balance) ? (
          <Tooltip
            placement="topLeft"
            title={
              <span>
                {formatEthFull(
                  shouldConvertShares && convertedStETHLockedShares
                    ? convertedStETHLockedShares
                    : balance,
                )}
              </span>
            }
          >
            <TokenLabel size={22}>
              {formatEth(
                shouldConvertShares && convertedStETHLockedShares
                  ? convertedStETHLockedShares
                  : balance,
              )}{' '}
              {token}
              {addOnText ? (
                <Text as="span" weight={600} size={22} color="secondary">
                  {addOnText}
                </Text>
              ) : null}
            </TokenLabel>
          </Tooltip>
        ) : (
          <InlineLoader />
        )}
      </TokenBalanceStyled>
    </Box>
  );
};
