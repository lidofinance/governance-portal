import { useThemeToggle } from '@lidofinance/lido-ui';
import { WalletsModalForEth } from 'reef-knot/connect-wallet-modal';
import { WalletIdsEthereum } from 'reef-knot/wallets';

import { config } from 'config';

const WALLETS_PINNED: WalletIdsEthereum[] = [
  'binanceWallet',
  'browserExtension',
];

export const ConnectWalletModal = () => {
  const { themeName } = useThemeToggle();

  return (
    <WalletsModalForEth
      shouldInvertWalletIcon={themeName === 'light'}
      walletsPinned={WALLETS_PINNED}
      termsLink={`${config.rootOrigin}/terms-of-use`}
      privacyNoticeLink={`${config.rootOrigin}/privacy-notice`}
    />
  );
};
