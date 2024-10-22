import { Tokens } from 'types/tokens';
import { RevokeAction, StyledRevokeTokenItem } from './style';
import { ReactComponent as RevokeIcon } from 'assets/icons/circle-arrow-down.svg';
import { Text } from '@lidofinance/lido-ui';
import { ForwardedRef, forwardRef } from 'react';
import { iconsDict, tokensSymbolDict } from '../../../../helpers';

type Props = {
  token: Tokens;
  amount?: string; // redefine with real type
  plain?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement>;
  isRevocable?: boolean;
};

export const RevokeTokenItem = forwardRef(
  (
    {
      token,
      amount,
      plain,
      interactive,
      onClick,
      children,
      isRevocable = true,
    }: Props,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <StyledRevokeTokenItem
        $plain={plain}
        $interactive={interactive}
        ref={ref}
        onClick={(onClick || null) as () => void}
      >
        <>
          {iconsDict[token]}
          {children}
          {!children && (
            <>
              <Text size="lg" strong>
                {amount} {tokensSymbolDict[token]}
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
