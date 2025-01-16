import { TokenBalance } from 'shared/components/token-balance';
import { RevocableTokenItemStyled, RevokePopupButton } from './style';
import { forwardRef } from 'react';
import { Text } from 'shared/components/text';
import { RevokeIcon, SandwatchIcon } from 'shared/components/icons';
import { Token } from 'shared/blockchain/types';

type Props = {
  token: Token;
  amount: bigint | undefined;
  addOnText?: string;
  unlockCountdown?: string;
  isLocked?: boolean;
  mode?: 'revoke' | 'withdraw';
  onClick?: () => void;
};

export const RevocableTokenItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => {
    const { token, amount, isLocked, addOnText, unlockCountdown, onClick } =
      props;

    if (!amount) {
      return null;
    }

    return (
      <RevocableTokenItemStyled ref={ref} $disabled={isLocked}>
        <TokenBalance token={token} balance={amount} addOnText={addOnText} />
        {!!onClick && (
          <RevokePopupButton onClick={!isLocked ? onClick : undefined}>
            {isLocked ? (
              <>
                <Text size={14} color="secondary">
                  {unlockCountdown
                    ? `${unlockCountdown} till revoke`
                    : 'Revoke'}
                </Text>
                <SandwatchIcon />
              </>
            ) : (
              <>
                <Text size={14} color="secondary">
                  Revoke
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
