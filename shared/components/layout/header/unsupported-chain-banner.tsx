import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useUserConfig } from 'config/user-config';
import { UnsupportedChainBannerStyled } from './style';

export const UnsupportedChainBanner = () => {
  const { defaultChain } = useUserConfig();
  const defaultChainName = CHAINS[defaultChain] ?? 'Ethereum mainnet';

  return (
    <UnsupportedChainBannerStyled>
      Unsupported chain. Please switch to {defaultChainName}
    </UnsupportedChainBannerStyled>
  );
};
