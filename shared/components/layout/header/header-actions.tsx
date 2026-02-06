import { useAccount } from 'wagmi';

import NoSSRWrapper from 'shared/components/no-ssr-wrapper';

import { HeaderActionsWrapper, WalletInfo } from './style';
import { HeaderVaultInfo } from './header-vault-info';
import { ConnectWalletButton, WalletButton } from 'shared/wallet';
import { UnsupportedChainBanner } from './unsupported-chain-banner';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { HeaderSettingsButton } from './header-settings-button';
import { DualGovernanceStatusButton } from '../../dual-governance-status-button';

export const HeaderActions = () => {
  const { isConnected } = useAccount();
  const isSupportedChain = useIsSupportedChain();

  return (
    <NoSSRWrapper>
      <HeaderActionsWrapper>
        <HeaderVaultInfo />
        <NoSSRWrapper>
          <DualGovernanceStatusButton />
        </NoSSRWrapper>
        <HeaderSettingsButton />
        <WalletInfo>
          {isConnected ? <WalletButton /> : <ConnectWalletButton />}
          {isConnected && !isSupportedChain && <UnsupportedChainBanner />}
        </WalletInfo>
      </HeaderActionsWrapper>
    </NoSSRWrapper>
  );
};
