import { useMemo } from 'react';

import { getConfig } from '../get-config';
import { getBackwardCompatibleConfig, useFallbackManifestEntry } from './utils';

import type { ExternalConfig, ManifestEntry } from './types';
import { useQuery } from '@tanstack/react-query';

export const useExternalConfigContext = (
  prefetchedManifest?: unknown,
): ExternalConfig => {
  const { defaultChain } = getConfig();
  const fallbackData = useFallbackManifestEntry(
    prefetchedManifest,
    defaultChain,
  );

  const queryResult = useQuery<ManifestEntry>({
    queryKey: ['external-config', defaultChain],
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!defaultChain,
    queryFn: async () => {
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
  });

  return useMemo(() => {
    const { config, ...rest } = queryResult.data ?? fallbackData;
    const cleanConfig = getBackwardCompatibleConfig(config);
    return { ...cleanConfig, ...rest, fetchMeta: queryResult };
  }, [queryResult, fallbackData]);
};
