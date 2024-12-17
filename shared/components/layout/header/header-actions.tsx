import { useAccount } from 'wagmi';
import { config } from 'config';

import { IPFSInfoBox } from 'features/ipfs/ipfs-info-box';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';

import { HeaderActionsWrapper, IPFSInfoBoxOnlyDesktopWrapper } from './style';
import { HeaderVaultInfo } from './header-vault-info';
import { ConnectWalletButton, WalletButton } from 'shared/wallet';
import { TestDgState } from '../../test-dg-state/test-dg-state';

export const HeaderActions = () => {
  const { isConnected } = useAccount();

  // TODO: uncomment or remove when we decide if we need the dark theme
  // const router = useRouter();
  // const queryTheme = router?.query?.theme;

  return (
    <NoSSRWrapper>
      <HeaderActionsWrapper>
        <HeaderVaultInfo />
        <TestDgState />
        {isConnected ? <WalletButton /> : <ConnectWalletButton />}
        {/* <HeaderSettingsButton /> */}
        {/*{!queryTheme && (*/}
        {/*  <ThemeTogglerWrapper>*/}
        {/*    <ThemeToggler data-testid="themeToggler" />*/}
        {/*  </ThemeTogglerWrapper>*/}
        {/*)}*/}
        {config.ipfsMode && (
          <IPFSInfoBoxOnlyDesktopWrapper>
            <IPFSInfoBox />
          </IPFSInfoBoxOnlyDesktopWrapper>
        )}
      </HeaderActionsWrapper>
    </NoSSRWrapper>
  );
};
