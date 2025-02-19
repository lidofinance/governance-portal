import { FC, PropsWithChildren } from 'react';
import { CookieThemeProvider, ThemeName } from '@lidofinance/lido-ui';
import { GlobalStyleOverwrite } from 'styles';

import { ConfigProvider } from 'config';

import { IPFSInfoBoxStatusesProvider } from './ipfs-info-box-statuses';
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
    <CookieThemeProvider initialThemeName={ThemeName.light}>
      <Web3Provider>
        <LidoSDKProvider>
          <IPFSInfoBoxStatusesProvider>
            <DualGovernanceStateProvider>
              <GlobalStyleOverwrite />
              <ModalProvider>{children}</ModalProvider>
            </DualGovernanceStateProvider>
          </IPFSInfoBoxStatusesProvider>
        </LidoSDKProvider>
      </Web3Provider>
    </CookieThemeProvider>
  </ConfigProvider>
);
