import { createContext, useContext, useMemo } from 'react';
import { CHAINS, LidoSDKCore } from '@lidofinance/lido-ethereum-sdk/core';
import invariant from 'tiny-invariant';
import { useChainId, useClient, useConnectorClient } from 'wagmi';
import { useGetRpcUrlByChainId } from 'config/rpc';
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
  const publicClient = useClient();
  const subscribe = useTokenTransferSubscription();
  const chainId = useChainId();
  const getRpcUrl = useGetRpcUrlByChainId();
  const fallbackRpcUrl = !publicClient ? getRpcUrl(chainId) : undefined;
  const { data: walletClient } = useConnectorClient();

  const sdk = useMemo(() => {
    const currentChainId = chainId;
    const core = new LidoSDKCore({
      chainId: currentChainId,
      logMode: 'none',
      rpcProvider: publicClient as any,
      web3Provider: walletClient as any,
      // viem client can be unavailable on ipfs+dev first renders
      rpcUrls: !publicClient && fallbackRpcUrl ? [fallbackRpcUrl] : undefined,
    });

    console.debug(`LidoSDK initialized with chainId: ${currentChainId}`);

    return {
      rpcProvider: core.rpcProvider,
      web3Provider: core.web3Provider as WalletClient,
      chainId: currentChainId as CHAINS,
      subscribeToTokenUpdates: subscribe,
    };
  }, [chainId, fallbackRpcUrl, publicClient, walletClient, subscribe]);
  return (
    <LidoSDKContext.Provider value={sdk}>{children}</LidoSDKContext.Provider>
  );
};
