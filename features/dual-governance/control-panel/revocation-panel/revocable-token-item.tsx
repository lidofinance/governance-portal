import { TokenBalance } from 'shared/components/token-balance';
import { RevocableTokenItemStyled, InQueueInfo, RevokeButton } from './style';
import { forwardRef } from 'react';
import { Text } from 'shared/components/text';
import { RevokeIcon, SandwatchIcon } from 'shared/components/icons';
import { Token } from 'shared/blockchain/types';
import { Box } from 'shared/components/box';

type Props = {
  token: Token | 'ETH' | 'unstETH';
  amount: bigint | undefined;
  amountLabel?: string;
  unlockCountdown?: string;
  isLocked?: boolean;
  actionLabel?: string;
  onClick?: () => void;
};

export const RevocableTokenItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => {
    const {
      token,
      amount,
      isLocked,
      amountLabel,
      unlockCountdown,
      actionLabel,
      onClick,
    } = props;

    if (!amount) {
      return null;
    }

    return (
      <RevocableTokenItemStyled ref={ref} $disabled={isLocked}>
        <TokenBalance token={token} balance={amount} addOnText={amountLabel} />
        {!!onClick && isLocked ? (
          <InQueueInfo>
            <>
              <Text size={14} color="secondary">
                {unlockCountdown ? (
                  <>
                    <b>{unlockCountdown}</b> till {actionLabel}
                  </>
                ) : (
                  actionLabel
                )}
              </Text>
              <SandwatchIcon />
            </>
          </InQueueInfo>
        ) : (
          <RevokeButton onClick={onClick} size="sm">
            <Box display="flex" alignItems="center">
              {actionLabel}
              <RevokeIcon />
            </Box>
          </RevokeButton>
        )}
      </RevocableTokenItemStyled>
    );
  },
);
