import { ComponentProps, useCallback } from 'react';
import { useConnect } from 'reef-knot/core-react';
import { useUserConfig } from 'config/user-config';
import { Button } from 'shared/components/button';

export const ConnectWalletButton = (props: ComponentProps<typeof Button>) => {
  const { isWalletConnectionAllowed } = useUserConfig();
  const { onClick, ...rest } = props;
  const { connect } = useConnect();

  const handleClick = useCallback(() => {
    if (!isWalletConnectionAllowed) return;
    void connect();
  }, [isWalletConnectionAllowed, connect]);

  return (
    <Button
      {...rest}
      size={rest.size ?? 'sm'}
      onClick={handleClick}
      disabled={!isWalletConnectionAllowed}
      data-testid="connectBtn"
    >
      {rest.children ?? 'Connect'}
    </Button>
  );
};
