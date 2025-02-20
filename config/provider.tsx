import { PropsWithChildren, createContext, useMemo } from 'react';

import { getConfig, ConfigType } from './get-config';
import { useUserConfigContext, UserConfigContextType } from './user-config';
import {
  type ExternalConfig,
  useExternalConfigContext,
} from './external-config';

type ConfigProviderType = {
  config: ConfigType;
  userConfig: UserConfigContextType;
  externalConfig: ExternalConfig;
};

export const ConfigContext = createContext<ConfigProviderType | null>(null);

type ConfigProviderProps = {
  prefetchedManifest?: unknown;
};

export const ConfigProvider = ({
  children,
  prefetchedManifest,
}: PropsWithChildren<ConfigProviderProps>) => {
  const userConfigContextValue = useUserConfigContext();
  const externalConfigContextValue =
    useExternalConfigContext(prefetchedManifest);

  const contextValue = useMemo(
    () => ({
      config: getConfig(),
      userConfig: userConfigContextValue,
      externalConfig: externalConfigContextValue,
    }),
    [userConfigContextValue, externalConfigContextValue],
  );

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};
