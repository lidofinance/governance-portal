import { FC, PropsWithChildren } from 'react';
import { CookieThemeProvider, ThemeName } from '@lidofinance/lido-ui';
import { GlobalStyleOverwrite } from 'styles';

import { ConfigProvider } from 'config';

import { AppFlagProvider } from './app-flag';
import { IPFSInfoBoxStatusesProvider } from './ipfs-info-box-statuses';
import { InpageNavigationProvider } from './inpage-navigation';
import { ModalProvider } from './modal-provider';
import Web3Provider from './web3';
import { LidoSDKProvider } from './lido-sdk';
import { DualGovernanceStateProvider } from './dual-governance';

type ProvidersProps = {
  prefetchedManifest?: unknown;
};

export const Providers: FC<PropsWithChildren<ProvidersProps>> = ({
  children,
  prefetchedManifest,
}) => (
  <ConfigProvider prefetchedManifest={prefetchedManifest}>
    <AppFlagProvider>
      <CookieThemeProvider initialThemeName={ThemeName.light}>
        <Web3Provider>
          <LidoSDKProvider>
            <IPFSInfoBoxStatusesProvider>
              <InpageNavigationProvider>
                <DualGovernanceStateProvider>
                  <GlobalStyleOverwrite />
                  <ModalProvider>{children}</ModalProvider>
                </DualGovernanceStateProvider>
              </InpageNavigationProvider>
            </IPFSInfoBoxStatusesProvider>
          </LidoSDKProvider>
        </Web3Provider>
      </CookieThemeProvider>
    </AppFlagProvider>
  </ConfigProvider>
);
