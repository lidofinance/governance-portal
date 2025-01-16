import { useAccount } from 'wagmi';
import { config } from 'config';

import { IPFSInfoBox } from 'features/ipfs/ipfs-info-box';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';

import { HeaderActionsWrapper, IPFSInfoBoxOnlyDesktopWrapper } from './style';
import { HeaderVaultInfo } from './header-vault-info';
import { ConnectWalletButton, WalletButton } from 'shared/wallet';
// import { TestDgState } from '../../test-dg-state/test-dg-state';

export const HeaderActions = () => {
  const { isConnected } = useAccount();

  return (
    <NoSSRWrapper>
      <HeaderActionsWrapper>
        <HeaderVaultInfo />
        {/*<TestDgState />*/}
        {isConnected ? <WalletButton /> : <ConnectWalletButton />}
        {config.ipfsMode && (
          <IPFSInfoBoxOnlyDesktopWrapper>
            <IPFSInfoBox />
          </IPFSInfoBoxOnlyDesktopWrapper>
        )}
      </HeaderActionsWrapper>
    </NoSSRWrapper>
  );
};
