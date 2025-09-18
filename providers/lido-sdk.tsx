import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CHAINS, LidoSDKCore } from '@lidofinance/lido-ethereum-sdk/core';
import invariant from 'tiny-invariant';
import { useAccount, useConnectorClient, usePublicClient } from 'wagmi';
import { useGetRpcUrlByChainId } from 'config/rpc';
import { config } from 'config';
import { useTokenTransferSubscription } from 'shared/blockchain/hooks/use-token-transfer-subscription';
import { PublicClient, WalletClient } from 'viem';

type LidoSDKContextValue = {
  rpcProvider: PublicClient;
  web3Provider: WalletClient;
  chainId: CHAINS;
  subscribeToTokenUpdates: ReturnType<typeof useTokenTransferSubscription>;
};

const LidoSDKContext = createContext<LidoSDKContextValue | null>(null);
LidoSDKContext.displayName = 'LidoSDKContext';

export const useLidoSDK = () => {
  const value = useContext(LidoSDKContext);
  invariant(value, 'useLidoSDK was used outside of LidoSDKProvider');
  return value;
};

export const LidoSDKProvider = ({ children }: React.PropsWithChildren) => {
  const subscribe = useTokenTransferSubscription();
  const { chainId: walletChainId, isConnected } = useAccount();
  const [chainId, setChainId] = useState<number>(config.defaultChain);

  useEffect(() => {
    if (!walletChainId || !config.supportedChains.includes(walletChainId)) {
      // This code resets 'chainId' to 'config.defaultChain' when the wallet is disconnected.
      // It also works on the first rendering, but we don't care.
      setChainId(config.defaultChain);
      return;
    }

    if (isConnected) {
      setChainId(walletChainId);
    }
  }, [walletChainId, isConnected]);

  const publicClient = usePublicClient({ chainId });

  const getRpcUrl = useGetRpcUrlByChainId();
  const fallbackRpcUrl = !publicClient ? getRpcUrl(chainId) : undefined;
  const { data: walletClient } = useConnectorClient();

  const sdk = useMemo(() => {
    // @ts-expect-error: typing (viem + LidoSDK)
    const core = new LidoSDKCore({
      chainId,
      logMode: 'none',
      rpcProvider: publicClient,
      web3Provider: walletClient as any,
      // viem client can be unavailable on ipfs+dev first renders
      rpcUrls: !publicClient && fallbackRpcUrl ? [fallbackRpcUrl] : undefined,
    });

    console.debug(`LidoSDK initialized with chainId: ${chainId}`);

    return {
      rpcProvider: core.rpcProvider,
      web3Provider: core.web3Provider as WalletClient,
      chainId,
      subscribeToTokenUpdates: subscribe,
    };
  }, [chainId, fallbackRpcUrl, publicClient, walletClient, subscribe]);

  return (
    <LidoSDKContext.Provider value={sdk}>{children}</LidoSDKContext.Provider>
  );
};
