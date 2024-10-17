import { FC, useCallback } from 'react';
import { useConnect } from 'reef-knot/core-react';
import { ButtonProps } from '@lidofinance/lido-ui';
import { wrapWithEventTrack } from '@lidofinance/analytics-matomo';

import { MATOMO_CLICK_EVENTS } from 'constants/matomo-click-events';
import { useUserConfig } from 'config/user-config';
import { ConnectButton } from './styles';

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
    <ConnectButton
      disabled={!isWalletConnectionAllowed}
      onClick={handleClick}
      data-testid="connectBtn"
      {...rest}
    >
      Connect
    </ConnectButton>
  );
};
