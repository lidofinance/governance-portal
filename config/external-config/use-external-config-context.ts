import { useMemo } from 'react';
import useSWR from 'swr';

import { getConfig } from '../get-config';
import { getBackwardCompatibleConfig, useFallbackManifestEntry } from './utils';

import type { ExternalConfig, ManifestEntry } from './types';

const onFetchError = (error: unknown) => {
  console.warn(
    '[useExternalConfigContext] while fetching external config:',
    error,
  );
};

const MINUTE_MS = 1000 * 60;

export const useExternalConfigContext = (
  prefetchedManifest?: unknown,
): ExternalConfig => {
  const { defaultChain } = getConfig();
  const fallbackData = useFallbackManifestEntry(
    prefetchedManifest,
    defaultChain,
  );

  const swr = useSWR<ManifestEntry>(
    ['swr:external-config', defaultChain],
    async () => {
      try {
        return fallbackData;
      } catch (error) {
        console.warn(
          '[useExternalConfigContext] Error fetching manifest:',
          error,
        );
        return fallbackData;
      }
    },
    {
      revalidateIfStale: true,
      refreshInterval: 5 * MINUTE_MS,
      onError: onFetchError,
      fallbackData,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return useMemo(() => {
    const { config, ...rest } = swr.data ?? fallbackData;
    const cleanConfig = getBackwardCompatibleConfig(config);
    return { ...cleanConfig, ...rest, fetchMeta: swr };
  }, [swr, fallbackData]);
};
