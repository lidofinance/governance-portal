import { config } from 'config';
import { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import {
  type Transport,
  fallback,
  createTransport,
  http,
  EIP1193Provider,
  custom,
  Chain,
  UnsupportedProviderMethodError,
  InvalidParamsRpcError,
} from 'viem';
import type { OnResponseFn } from 'viem/_types/clients/transports/fallback';
import type { Connection } from 'wagmi';

// We disable those methods so wagmi uses getLogs intestead to watch events
// Filters are not suitable for public rpc and break between fallbacks
const DISABLED_METHODS = new Set([
  'eth_newFilter',
  'eth_getFilterChanges',
  'eth_uninstallFilter',
]);

// Reads only: writes go through the connector client. Blocking wallet calls here
// keeps one sent through the read client from reaching the injected wallet.
const WALLET_METHODS = new Set([
  'eth_accounts',
  'eth_requestAccounts',
  'eth_sendTransaction',
  'eth_sendRawTransaction',
  'eth_sign',
  'eth_signTransaction',
  'eth_signTypedData',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
  'personal_sign',
  'eth_decrypt',
  'eth_getEncryptionPublicKey',
  'wallet_grantPermissions',
  'wallet_addEthereumChain',
  'wallet_switchEthereumChain',
  'wallet_requestPermissions',
  'wallet_revokePermissions',
  'wallet_getPermissions',
  'wallet_watchAsset',
  'wallet_getCapabilities',
  'wallet_sendCalls',
  'wallet_getCallsStatus',
  'wallet_showCallsStatus',
]);

const NOOP = () => {};

// Viem transport wrapper that allows runtime changes via setter
const runtimeMutableTransport = (
  initialMainTransports: Transport[],
): [Transport, (t: Transport | null) => void, (t: Transport[]) => void] => {
  let mainTransports = initialMainTransports;
  let injectedTransport: Transport | null = null;
  return [
    (params) => {
      let activeMainTransports = mainTransports;
      let activeInjectedTransport: Transport | null = null;
      let activeTransport: ReturnType<Transport> =
        fallback(mainTransports)(params);
      const defaultTransports = activeTransport.value?.transports;
      let responseFn: OnResponseFn = NOOP;

      const getActiveTransport = () => {
        if (
          activeMainTransports !== mainTransports ||
          activeInjectedTransport !== injectedTransport
        ) {
          activeMainTransports = mainTransports;
          activeInjectedTransport = injectedTransport;
          activeTransport = fallback(
            injectedTransport
              ? [injectedTransport, ...mainTransports]
              : mainTransports,
          )(params);
        }
        return activeTransport;
      };

      return createTransport(
        {
          key: 'RuntimeMutableTransport',
          name: 'RuntimeMutableTransport',
          // retries are handled by the fallback transports inside
          retryCount: 0,
          //@ts-expect-error invalid typings
          async request(requestParams, options) {
            const transport = getActiveTransport();

            if (
              DISABLED_METHODS.has(requestParams.method) ||
              WALLET_METHODS.has(requestParams.method)
            ) {
              const error = new UnsupportedProviderMethodError(
                new Error(`Method ${requestParams.method} is not supported`),
              );
              responseFn({
                error,
                method: requestParams.method,
                params: params as unknown[],
                transport,
                status: 'error',
              });
              throw error;
            }

            if (
              requestParams.method === 'eth_getLogs' &&
              Array.isArray(requestParams?.params) &&
              // works for empty array, empty string and all falsish values
              !requestParams.params[0]?.address?.length
            ) {
              console.warn(
                '[runtimeMutableTransport] Invalid empty getLogs',
                requestParams,
              );
              const error = new InvalidParamsRpcError(
                new Error(`Empty address for eth_getLogs is not supported`),
              );
              responseFn({
                error,
                method: requestParams.method,
                params: params as unknown[],
                transport,
                status: 'error',
              });
              throw error;
            }

            transport.value?.onResponse(responseFn);
            if (
              ['eth_call', 'eth_estimateGas'].includes(requestParams.method)
            ) {
              try {
                return await transport.request(requestParams, options);
              } catch (error: any) {
                if (
                  error?.message?.includes('execution reverted') ||
                  error?.code === 3
                ) {
                  return null;
                }
                throw error;
              }
            }

            try {
              return await transport.request(requestParams, options);
            } catch (error: any) {
              if (
                error?.message?.includes('execution reverted') ||
                error?.code === 3
              ) {
                return null;
              }

              throw error;
            }
          },
          type: 'fallback',
        },
        {
          transports: defaultTransports,
          onResponse: (fn: OnResponseFn) => (responseFn = fn),
        },
      );
    },
    (transport: Transport | null) => {
      injectedTransport = transport;
    },
    (transports: Transport[]) => {
      mainTransports = transports;
    },
  ];
};

const createMainTransport = (rpcUrl: string) =>
  http(rpcUrl, {
    batch: {
      wait: config.PROVIDER_BATCH_TIME,
      batchSize: config.PROVIDER_MAX_BATCH,
    },
    name: rpcUrl,
    retryCount: 3,
    timeout: 10000,
  });

// returns Viem transport map that uses browser wallet RPC provider when avaliable and no user RPC is set, fallbacked by our RPC
export const useWeb3Transport = (
  supportedChains: Chain[],
  backendRpcMap: Record<number, string>,
  userRpcMap: Partial<Record<number, string>>,
) => {
  // Transports are built once, so the wagmi config built from them stays the same
  // and the wallet stays connected; RPC URL changes are applied by the effect below
  const [initialBackendRpcMap] = useState(backendRpcMap);

  const { transportMap, setTransportMap, setMainTransportsMap } =
    useMemo(() => {
      return supportedChains.reduce(
        ({ transportMap, setTransportMap, setMainTransportsMap }, chain) => {
          const [transport, setTransport, setMainTransports] =
            runtimeMutableTransport([
              createMainTransport(initialBackendRpcMap[chain.id]),
            ]);
          return {
            transportMap: {
              ...transportMap,
              [chain.id]: transport,
            },
            setTransportMap: {
              ...setTransportMap,
              [chain.id]: setTransport,
            },
            setMainTransportsMap: {
              ...setMainTransportsMap,
              [chain.id]: setMainTransports,
            },
          };
        },
        {
          transportMap: {} as Record<number, Transport>,
          setTransportMap: {} as Record<number, (t: Transport | null) => void>,
          setMainTransportsMap: {} as Record<number, (t: Transport[]) => void>,
        },
      );
    }, [supportedChains, initialBackendRpcMap]);

  useEffect(() => {
    for (const chain of supportedChains) {
      setMainTransportsMap[chain.id]([
        createMainTransport(backendRpcMap[chain.id]),
      ]);
    }
  }, [supportedChains, backendRpcMap, setMainTransportsMap]);

  // A slower earlier call can resolve after a newer one; the counter drops its result
  const connectionSeq = useRef(0);

  const onActiveConnection = useCallback(
    async (activeConnection: Connection | null) => {
      const seq = ++connectionSeq.current;

      for (const chain of supportedChains) {
        setTransportMap[chain.id](null);
      }

      if (
        !activeConnection ||
        activeConnection.connector.type !== 'injected' ||
        userRpcMap[activeConnection.chainId]
      ) {
        return;
      }

      const provider = (await activeConnection.connector.getProvider?.({
        chainId: activeConnection.chainId,
      })) as EIP1193Provider | undefined;

      if (!provider || seq !== connectionSeq.current) return;

      setTransportMap[activeConnection.chainId]?.(custom(provider));
    },
    [setTransportMap, supportedChains, userRpcMap],
  );

  return { transportMap, onActiveConnection };
};
