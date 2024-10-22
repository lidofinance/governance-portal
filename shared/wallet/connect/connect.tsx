import { FC, useCallback } from 'react';
import { useConnect } from 'reef-knot/core-react';
import { wrapWithEventTrack } from '@lidofinance/analytics-matomo';

import { MATOMO_CLICK_EVENTS } from 'constants/matomo-click-events';
import { useUserConfig } from 'config/user-config';
import { ActionButton, ButtonProps } from 'shared/components/action-button';

export const Connect: FC<ButtonProps> = (props) => {
  const { isWalletConnectionAllowed } = useUserConfig();
  const { onClick, ...rest } = props;
  const { connect } = useConnect();

  const handleClick = wrapWithEventTrack(
    MATOMO_CLICK_EVENTS.connectWallet,
    useCallback(() => {
      if (!isWalletConnectionAllowed) return;
      void connect();
    }, [isWalletConnectionAllowed, connect]),
  );

  return (
    <ActionButton
      size="sm"
      onClick={handleClick}
      {...rest}
      disabled={!isWalletConnectionAllowed}
      data-testid="connectBtn"
    >
      Connect
    </ActionButton>
  );
};
