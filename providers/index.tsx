import { FC, PropsWithChildren } from 'react';
import {
  LightThemeProvider,
  CookieThemeProvider,
  ThemeName,
} from '@lidofinance/lido-ui';
import { GlobalStyleOverwrite } from 'styles';

import { ConfigProvider } from 'config';

import { ModalProvider } from './modal-provider';
import Web3Provider from './web3';
import { LidoSDKProvider } from './lido-sdk';
import { DualGovernanceStateProvider } from './dual-governance-state';
import { EscrowProvider } from './escrow';
import { DualGovernanceProposalsProvider } from './dual-governance-proposals';

type ProvidersProps = {
  prefetchedManifest?: unknown;
};

export const Providers: FC<PropsWithChildren<ProvidersProps>> = ({
  children,
  prefetchedManifest,
}) => (
  <ConfigProvider prefetchedManifest={prefetchedManifest}>
    <LightThemeProvider>
      <CookieThemeProvider overrideThemeName={ThemeName.light}>
        <Web3Provider>
          <LidoSDKProvider>
            <DualGovernanceStateProvider>
              <DualGovernanceProposalsProvider>
                <EscrowProvider>
                  <GlobalStyleOverwrite />
                  <ModalProvider>{children}</ModalProvider>
                </EscrowProvider>
              </DualGovernanceProposalsProvider>
            </DualGovernanceStateProvider>
          </LidoSDKProvider>
        </Web3Provider>
      </CookieThemeProvider>
    </LightThemeProvider>
  </ConfigProvider>
);
