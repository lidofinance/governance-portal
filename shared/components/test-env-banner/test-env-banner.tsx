import { TestEnvBanner as LidoTestEnvBanner } from '@lidofinance/lido-app-ui';

import { config } from 'config';

export const TestEnvBanner = () => {
  if (config.isProd) {
    return null;
  }
  return <LidoTestEnvBanner />;
};
