import {
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, useConnections } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import {
  AutoConnect,
  ReefKnot,
  getWalletsDataList,
} from 'reef-knot/core-react';
import { WalletsListEthereum } from 'reef-knot/wallets';

import { config } from 'config';
import { useUserConfig } from 'config/user-config';
import { useGetRpcUrlByChainId } from 'config/rpc';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { ConnectWalletModal } from 'shared/wallet/connect-wallet-modal';

import { SDKLegacyProvider } from './sdk-legacy';
import { useWeb3Transport } from 'utils/use-web3-transport';
import { clearStorageOnNetworkSwitch } from 'utils/clear-storage';

type ChainsList = [wagmiChains.Chain, ...wagmiChains.Chain[]];

const wagmiChainsArray = Object.values(wagmiChains) as any as ChainsList;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Web3Provider: FC<PropsWithChildren> = ({ children }) => {
  const {
    defaultChain: defaultChainId,
    supportedChainIds,
    walletconnectProjectId,
    isWalletConnectionAllowed,
  } = useUserConfig();

  const { supportedChains, defaultChain } = useMemo(() => {
    const supportedChains = wagmiChainsArray.filter((chain) =>
      supportedChainIds.includes(chain.id),
    );

    const defaultChain =
      supportedChains.find((chain) => chain.id === defaultChainId) ||
      supportedChains[0]; // first supported chain as fallback
    return {
      supportedChains: supportedChains as ChainsList,
      defaultChain,
    };
  }, [defaultChainId, supportedChainIds]);

  const getRpcUrlByChainId = useGetRpcUrlByChainId();

  const backendRPC: Record<number, string> = useMemo(
    () =>
      supportedChainIds.reduce(
        (res, curr) => ({ ...res, [curr]: getRpcUrlByChainId(curr) }),
        {
          // Mainnet RPC is always required for some requests, e.g. ETH to USD price, ENS lookup
          [CHAINS.Mainnet]: getRpcUrlByChainId(CHAINS.Mainnet),
        },
      ),
    [supportedChainIds, getRpcUrlByChainId],
  );

  const { walletsDataList } = useMemo(() => {
    return getWalletsDataList({
      walletsList: WalletsListEthereum,
      rpc: backendRPC,
      walletconnectProjectId,
      defaultChain,
    });
  }, [backendRPC, defaultChain, walletconnectProjectId]);

  const { transportMap, onActiveConnection } = useWeb3Transport(
    supportedChains,
    backendRPC,
  );

  const wagmiConfig = useMemo(() => {
    return createConfig({
      chains: supportedChains,
      ssr: true,
      connectors: [],
      batch: {
        multicall: false,
      },
      multiInjectedProviderDiscovery: false,
      pollingInterval: config.PROVIDER_POLLING_INTERVAL,
      transports: transportMap,
    });
  }, [supportedChains, transportMap]);

  const [activeConnection] = useConnections({ config: wagmiConfig });
  const previousChainIdRef = useRef<number | null>(null);
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false);

  useEffect(() => {
    void onActiveConnection(activeConnection ?? null);

    if (
      activeConnection?.chainId &&
      previousChainIdRef.current !== null &&
      previousChainIdRef.current !== activeConnection.chainId
    ) {
      setIsNetworkSwitching(true);

      clearStorageOnNetworkSwitch();

      setTimeout(() => {
        queryClient.clear();
        window.location.reload();
      }, 100);
    }

    if (activeConnection?.chainId && !isNetworkSwitching) {
      previousChainIdRef.current = activeConnection.chainId;
    }
  }, [activeConnection, onActiveConnection, isNetworkSwitching]);

  return (
    // default wagmi autoConnect, MUST be false in our case, because we use custom autoConnect from Reef Knot
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <ReefKnot
          rpc={backendRPC}
          chains={supportedChains}
          walletDataList={walletsDataList}
        >
          {isWalletConnectionAllowed && <AutoConnect autoConnect />}
          <SDKLegacyProvider
            defaultChainId={defaultChain.id}
            pollingInterval={config.PROVIDER_POLLING_INTERVAL}
          >
            {children}
            <ConnectWalletModal />
          </SDKLegacyProvider>
        </ReefKnot>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
