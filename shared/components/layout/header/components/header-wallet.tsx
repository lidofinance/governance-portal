import { FC } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

import { ThemeToggler } from '@lidofinance/lido-ui';

import { config } from 'config';

import { IPFSInfoBox } from 'features/ipfs/ipfs-info-box';
import { Button, Connect } from 'shared/wallet';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';

import { HeaderSettingsButton } from './header-settings-button';
import { IPFSInfoBoxOnlyDesktopWrapper, ThemeTogglerWrapper } from '../styles';

const HeaderWallet: FC = () => {
  const router = useRouter();
  const { address } = useAccount();

  const queryTheme = router?.query?.theme;

  return (
    <NoSSRWrapper>
      {address ? (
        <Button data-testid="accountSectionHeader" />
      ) : (
        <Connect size="sm" />
      )}
      <HeaderSettingsButton />
      {!queryTheme && (
        <ThemeTogglerWrapper>
          <ThemeToggler data-testid="themeToggler" />
        </ThemeTogglerWrapper>
      )}
      {config.ipfsMode && (
        <IPFSInfoBoxOnlyDesktopWrapper>
          <IPFSInfoBox />
        </IPFSInfoBoxOnlyDesktopWrapper>
      )}
    </NoSSRWrapper>
  );
};

export default HeaderWallet;
