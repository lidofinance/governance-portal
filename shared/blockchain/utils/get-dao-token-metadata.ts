import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { ETH_DECIMALS } from '../constants';

type Metadata = {
  decimals: number;
  symbol: string;
};

const DAO_TOKEN_METADATA: Partial<Record<CHAINS, Metadata>> = {
  [CHAINS.Mainnet]: {
    symbol: 'LDO',
    decimals: 18,
  },
  [CHAINS.Hoodi]: {
    symbol: 'TLDO',
    decimals: 18,
  },
};

export const getDaoTokenMetadata = (chainId: CHAINS) => {
  return {
    symbol: DAO_TOKEN_METADATA[chainId]?.symbol || 'LDO',
    decimals: DAO_TOKEN_METADATA[chainId]?.decimals || ETH_DECIMALS,
  };
};
