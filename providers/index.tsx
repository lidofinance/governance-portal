import { FC, PropsWithChildren } from 'react';
import { LightThemeProvider } from '@lidofinance/lido-ui';
import { GlobalStyleOverwrite } from 'styles';

import { ConfigProvider } from 'config';

import { ModalProvider } from './modal-provider';
import Web3Provider from './web3';
import { LidoSDKProvider } from './lido-sdk';
import { DualGovernanceStateProvider } from './dual-governance-state';
import { EscrowProvider } from './escrow';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type ProvidersProps = {
  prefetchedManifest?: unknown;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      gcTime: 60000,
      retry: (failureCount, error: any) => {
        if (
          error?.message?.includes('429') ||
          error?.message?.includes('rate limit')
        ) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export const Providers: FC<PropsWithChildren<ProvidersProps>> = ({
  children,
  prefetchedManifest,
}) => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider prefetchedManifest={prefetchedManifest}>
      <LightThemeProvider>
        <Web3Provider>
          <LidoSDKProvider>
            <DualGovernanceStateProvider>
              <EscrowProvider>
                <GlobalStyleOverwrite />
                <ModalProvider>{children}</ModalProvider>
              </EscrowProvider>
            </DualGovernanceStateProvider>
          </LidoSDKProvider>
        </Web3Provider>
      </LightThemeProvider>
    </ConfigProvider>
  </QueryClientProvider>
);
