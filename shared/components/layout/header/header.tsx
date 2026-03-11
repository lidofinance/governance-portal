import { LogoLido } from 'shared/components/logos/logos';
import { HeaderActionsWrapper, HeaderContainer, WalletInfo } from './style';
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
import { Box } from 'shared/components/box';
import { useScrollLock } from 'shared/hooks/use-scroll-lock';
import { TMC_MULTISIG_ADDRESS } from 'shared/blockchain/multisig-addresses';

export const Header = () => {
  const { isConnected, address } = useAccount();
  const isSupportedChain = useIsSupportedChain();

  const [isBurgerOpened, setBurgerOpened] = useState(false);

  useScrollLock(isBurgerOpened);

  const shouldShowStonks = address?.toLowerCase() === TMC_MULTISIG_ADDRESS;
  return (
    <HeaderContainer>
      <LogoLido />
      <NoSsrWrapper>
        <Nav shouldShowStonks={shouldShowStonks || true} />
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

        <NavBurger
          isOpened={isBurgerOpened}
          onClick={() => setBurgerOpened(!isBurgerOpened)}
        />
        {isBurgerOpened && (
          <NavMobile shouldShowStonks={shouldShowStonks}>
            <FlexWrapper $flexDirection="column" $gap="12px">
              <FlexWrapper $gap="12px">
                <DualGovernanceStatusButton />{' '}
                <Text>Dual Governance state</Text>
              </FlexWrapper>
              <FlexWrapper $gap="12px">
                <HeaderSettingsButton /> <Text>Settings</Text>
              </FlexWrapper>
              <Box width="100%" marginTop={32}>
                {isConnected ? (
                  <WalletButton />
                ) : (
                  <ConnectWalletButton style={{ width: '100%' }} />
                )}
                {isConnected && !isSupportedChain && <UnsupportedChainBanner />}
              </Box>
            </FlexWrapper>
          </NavMobile>
        )}
      </NoSsrWrapper>
    </HeaderContainer>
  );
};
