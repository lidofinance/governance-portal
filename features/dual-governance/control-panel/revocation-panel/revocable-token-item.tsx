import { TokenBalance } from 'shared/components/token-balance';
import { RevocableTokenItemStyled, RevokePopupButton } from './style';
import { forwardRef } from 'react';
import { Text } from 'shared/components/text';
import { RevokeIcon, SandwatchIcon } from 'shared/components/icons';
import { Token } from 'shared/blockchain/types';

type Props = {
  token: Token | 'ETH';
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
        {!!onClick && (
          <RevokePopupButton onClick={!isLocked ? onClick : undefined}>
            {isLocked ? (
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
            ) : (
              <>
                <Text size={14} color="secondary">
                  {actionLabel}
                </Text>
                <RevokeIcon />
              </>
            )}
          </RevokePopupButton>
        )}
      </RevocableTokenItemStyled>
    );
  },
);
