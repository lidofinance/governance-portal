import { PropsWithChildren, createContext, useMemo } from 'react';

import { getConfig, ConfigType } from './get-config';
import { useUserConfigContext, UserConfigContextType } from './user-config';

type ConfigProviderType = {
  config: ConfigType;
  userConfig: UserConfigContextType;
};

export const ConfigContext = createContext<ConfigProviderType | null>(null);

type ConfigProviderProps = {
  prefetchedManifest?: unknown;
};

export const ConfigProvider = ({
  children,
}: PropsWithChildren<ConfigProviderProps>) => {
  const userConfigContextValue = useUserConfigContext();

  const contextValue = useMemo(
    () => ({
      config: getConfig(),
      userConfig: userConfigContextValue,
    }),
    [userConfigContextValue],
  );

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};
