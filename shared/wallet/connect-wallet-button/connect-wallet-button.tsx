import { ComponentProps, useCallback } from 'react';
import { useConnect } from 'reef-knot/core-react';
import { useUserConfig } from 'config/user-config';
import { Button } from 'shared/components/button';

type Props = {
  onConnect?: () => void;
} & ComponentProps<typeof Button>;

export const ConnectWalletButton = (props: Props) => {
  const { isWalletConnectionAllowed } = useUserConfig();
  const { onClick, onConnect, ...rest } = props;
  const { connect } = useConnect();

  const handleClick = useCallback(async () => {
    if (!isWalletConnectionAllowed) return;
    await connect();
    onConnect?.();
  }, [isWalletConnectionAllowed, connect, onConnect]);

  return (
    <Button
      {...rest}
      size={rest.size ?? 'sm'}
      onClick={handleClick}
      disabled={!isWalletConnectionAllowed}
      data-testid="connectBtn"
    >
      {rest.children ?? 'Connect wallet'}
    </Button>
  );
};
