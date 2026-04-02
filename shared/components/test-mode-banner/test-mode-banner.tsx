import { useLidoSDK } from 'providers/lido-sdk';

import { useUserConfig } from 'config/user-config';
import { isTestnet } from 'shared/blockchain/utils/is-testnet';

import { TestModeBannerWrap } from './style';

export const TestModeBanner = () => {
  const { chainId } = useLidoSDK();
  const { savedUserConfig } = useUserConfig();

  if (savedUserConfig.useTestContracts && isTestnet(chainId)) {
    return (
      <TestModeBannerWrap>
        The app is currently running in Test Mode
      </TestModeBannerWrap>
    );
  }
  return null;
};
