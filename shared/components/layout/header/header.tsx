import { LogoLido } from 'shared/components/logos/logos';
import {
  HeaderActionsWrapper,
  HeaderContainer,
  MobileWalletWrapper,
  WalletInfo,
} from './style';
import { NoSsrWrapper } from 'shared/components/no-ssr-wrapper';
import { Nav, NavBurger, NavMobile } from './nav';
import { useState } from 'react';
import { DualGovernanceStatusButton } from '../../dual-governance-status-button';
import { HeaderSettingsButton } from './header-settings-button';
import { ConnectWalletButton, WalletButton } from 'shared/wallet';
import { UnsupportedChainBanner } from './unsupported-chain-banner';
import { useAccount } from 'wagmi';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { Text } from 'shared/components/text';
import { FlexWrapper } from 'shared/styled-components';
import { useScrollLock } from 'shared/hooks/use-scroll-lock';
import { TMC_MULTISIG_ADDRESS } from 'shared/blockchain/multisig-addresses';

export const Header = () => {
  const { isConnected, address } = useAccount();
  const isSupportedChain = useIsSupportedChain();

  const [isBurgerOpened, setBurgerOpened] = useState(false);

  useScrollLock(isBurgerOpened);

  const shouldShowStonks = address?.toLowerCase() === TMC_MULTISIG_ADDRESS;
  return (
    <HeaderContainer $isMenuOpen={isBurgerOpened}>
      <LogoLido />
      <NoSsrWrapper>
        <Nav shouldShowStonks={shouldShowStonks} />
        <HeaderActionsWrapper>
          <>
            <DualGovernanceStatusButton />
            <HeaderSettingsButton />
            <WalletInfo>
              {isConnected ? <WalletButton /> : <ConnectWalletButton />}
              {isConnected && !isSupportedChain && <UnsupportedChainBanner />}
            </WalletInfo>
          </>
        </HeaderActionsWrapper>

        <MobileWalletWrapper>
          {isConnected ? <WalletButton /> : <ConnectWalletButton />}
          {isConnected && !isSupportedChain && <UnsupportedChainBanner />}
        </MobileWalletWrapper>

        <NavBurger
          isOpened={isBurgerOpened}
          onClick={() => setBurgerOpened(!isBurgerOpened)}
        />
        {isBurgerOpened && (
          <NavMobile shouldShowStonks={shouldShowStonks}>
            <FlexWrapper $flexDirection="column" $gap="12px">
              <FlexWrapper $gap="12px">
                <DualGovernanceStatusButton isMobile />{' '}
                <Text>Dual Governance state</Text>
              </FlexWrapper>
              <FlexWrapper $gap="12px">
                <HeaderSettingsButton /> <Text>Settings</Text>
              </FlexWrapper>
            </FlexWrapper>
          </NavMobile>
        )}
      </NoSsrWrapper>
    </HeaderContainer>
  );
};
