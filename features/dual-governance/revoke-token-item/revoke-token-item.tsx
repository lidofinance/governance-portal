import { RevokeAction, StyledRevokeTokenItem } from './style';
import { RevokeIcon } from 'shared/components/icons';
import { Text } from '@lidofinance/lido-ui';
import { ForwardedRef, forwardRef } from 'react';
import { Token } from 'shared/blockchain/types';
import { formatEth, getTokenIcon } from 'shared/blockchain/utils';

type Props = {
  token: Token;
  amount: bigint | undefined; // redefine with real type
  plain?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement>;
  isRevocable?: boolean;
};

export const RevokeTokenItem = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      token,
      amount,
      plain,
      interactive,
      onClick,
      children,
      isRevocable = true,
    } = props;

    if (amount === undefined) {
      return null;
    }

    return (
      <StyledRevokeTokenItem
        $plain={plain}
        $interactive={interactive}
        ref={ref}
        onClick={(onClick || null) as () => void}
      >
        <>
          {getTokenIcon(token)}
          {children}
          {!children && (
            <>
              <Text size="lg" strong>
                {formatEth(amount)} {token}
              </Text>
              {isRevocable && (
                <RevokeAction onClick={onClick}>
                  <Text>Revoke</Text>
                  <RevokeIcon />
                </RevokeAction>
              )}
            </>
          )}
        </>
      </StyledRevokeTokenItem>
    );
  },
);
