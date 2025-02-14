import { useAccount } from 'wagmi';
import { config } from 'config';

import { IPFSInfoBox } from 'features/ipfs/ipfs-info-box';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';

import {
  HeaderActionsWrapper,
  IPFSInfoBoxOnlyDesktopWrapper,
  WalletInfo,
} from './style';
import { HeaderVaultInfo } from './header-vault-info';
import { ConnectWalletButton, WalletButton } from 'shared/wallet';
import { TestDgState } from '../../test-dg-state';
import { UnsupportedChainBanner } from './unsupported-chain-banner';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';

export const HeaderActions = () => {
  const { isConnected } = useAccount();
  const isSupportedChain = useIsSupportedChain();

  return (
    <NoSSRWrapper>
      <HeaderActionsWrapper>
        <HeaderVaultInfo />
        <TestDgState />
        <WalletInfo>
          {isConnected ? <WalletButton /> : <ConnectWalletButton />}
          {isConnected && !isSupportedChain && <UnsupportedChainBanner />}
        </WalletInfo>
        {config.ipfsMode && (
          <IPFSInfoBoxOnlyDesktopWrapper>
            <IPFSInfoBox />
          </IPFSInfoBoxOnlyDesktopWrapper>
        )}
      </HeaderActionsWrapper>
    </NoSSRWrapper>
  );
};
