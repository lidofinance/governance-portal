import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { WagmiProvider, useConnections } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import { ReefKnotProvider, getDefaultConfig } from 'reef-knot/core-react';
import { WalletIdsEthereum, WalletsListEthereum } from 'reef-knot/wallets';

import { config } from 'config';
import { useUserConfig } from 'config/user-config';
import { useGetRpcUrlByChainId } from 'config/rpc';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { useWeb3Transport } from 'utils/use-web3-transport';
import {
  getDefaultWalletsModalConfig,
  ReefKnotWalletsModal,
} from 'reef-knot/connect-wallet-modal';

type ChainsList = [wagmiChains.Chain, ...wagmiChains.Chain[]];

const WALLETS_PINNED: WalletIdsEthereum[] = ['browserExtension'];

const WALLETS_SHOWN: WalletIdsEthereum[] = [
  'browserExtension',
  'metaMask',
  'okx',
  'ledgerHID',
  'ledgerLive',
  'walletConnect',
  'bitget',
  'imToken',
  'ambire',
  'safe',
  'dappBrowserInjected',
  'coinbaseSmartWallet',
];

const wagmiChainsArray = Object.values(wagmiChains) as any as ChainsList;

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

  const { transportMap, onActiveConnection } = useWeb3Transport(
    supportedChains,
    backendRPC,
  );

  const { wagmiConfig, reefKnotConfig, walletsModalConfig } = useMemo(() => {
    return getDefaultConfig({
      // Reef-Knot config args
      rpc: backendRPC,
      defaultChain: defaultChain,
      walletconnectProjectId,
      walletsList: WalletsListEthereum,

      // Wagmi config args
      transports: transportMap,
      chains: supportedChains,
      autoConnect: isWalletConnectionAllowed,
      ssr: true,
      pollingInterval: config.PROVIDER_POLLING_INTERVAL,
      batch: {
        multicall: false,
      },

      // Wallets config args
      ...getDefaultWalletsModalConfig(),
      walletsPinned: WALLETS_PINNED,
      walletsShown: WALLETS_SHOWN,
    });
  }, [
    backendRPC,
    supportedChains,
    defaultChain,
    walletconnectProjectId,
    isWalletConnectionAllowed,
    transportMap,
  ]);

  const [activeConnection] = useConnections({ config: wagmiConfig });

  useEffect(() => {
    void onActiveConnection(activeConnection ?? null);
  }, [activeConnection, onActiveConnection]);

  return (
    // default wagmi autoConnect, MUST be false in our case, because we use custom autoConnect from Reef Knot
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <ReefKnotProvider config={reefKnotConfig}>
        <ReefKnotWalletsModal
          config={walletsModalConfig}
          darkThemeEnabled={false}
        />
        {children}
      </ReefKnotProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
