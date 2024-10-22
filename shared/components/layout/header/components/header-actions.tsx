import { FC, useCallback, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { config } from 'config';

import { Button, Connect } from 'shared/wallet';

import { VaultIcon, RevokeIcon } from 'shared/components/icons';

import { Text } from '@lidofinance/lido-ui';
import { IPFSInfoBox } from 'features/ipfs/ipfs-info-box';
import { RevokeTokenItem } from 'features/dual-governance/form-section/form/forms/revoke-form/revoke-token-item';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';

import { StyledPopupMenu } from 'shared/styled-components';
import { HeaderSettingsButton } from './header-settings-button';

import { Tokens } from 'types/tokens';

import {
  IPFSInfoBoxOnlyDesktopWrapper,
  VaultInfo,
  VaultInfoMenuTitle,
} from '../style';
import { tokensSymbolDict } from 'features/dual-governance/helpers';
import { RevokeAction } from 'features/dual-governance/form-section/form/forms/revoke-form/style';

const HeaderActions: FC = () => {
  const { address } = useAccount();
  const [isVaultInfoMenuOpen, setVaultInfoMenuOpen] = useState(false);

  const vaultInfoRef = useRef(null);

  const handleNftRevoke = useCallback(() => {
    console.log('revoke NFT with no modal(batch)');
  }, []);

  // TODO: uncomment or remove when we decide if we need the dark theme
  // const router = useRouter();
  // const queryTheme = router?.query?.theme;

  return (
    <NoSSRWrapper>
      <StyledPopupMenu
        open={isVaultInfoMenuOpen}
        onClose={() => setVaultInfoMenuOpen(false)}
        anchorRef={vaultInfoRef}
      >
        <VaultInfoMenuTitle>Your tokens in DG</VaultInfoMenuTitle>
        <Text color="secondary" size="sm">
          Tokens in the active veto vault
        </Text>
        <RevokeTokenItem plain token={Tokens.STETH} amount="480,000.0317" />
        <RevokeTokenItem plain token={Tokens.UNSTETH}>
          <Text size="lg" strong>
            {`${2.3153} ${tokensSymbolDict[Tokens.UNSTETH]}`}
          </Text>
          <Text color="secondary" size="lg" strong>
            5 NFT
          </Text>
          <RevokeAction onClick={handleNftRevoke}>
            <Text>Revoke</Text>
            <RevokeIcon />
          </RevokeAction>
        </RevokeTokenItem>
      </StyledPopupMenu>
      <VaultInfo ref={vaultInfoRef} onClick={() => setVaultInfoMenuOpen(true)}>
        <VaultIcon />
        500,000 stETH
      </VaultInfo>
      {address ? (
        <Button data-testid="accountSectionHeader" />
      ) : (
        <Connect size="sm" />
      )}
      <HeaderSettingsButton />
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
    </NoSSRWrapper>
  );
};

export default HeaderActions;
