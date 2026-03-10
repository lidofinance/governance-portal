import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { Address } from 'viem';

// key type to have a proper type checking when accessing KnownToken properties
type KnownTokenSymbol = 'DAI' | 'StETH' | 'USDT' | 'USDC' | 'LDO';

export const KnownToken: Record<
  KnownTokenSymbol,
  {
    symbol: string;
    decimals: number;
    addresses: Partial<Record<CHAINS, Address>>;
  }
> = {
  DAI: {
    symbol: 'DAI',
    decimals: 18,
    addresses: {
      [CHAINS.Mainnet]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      [CHAINS.Hoodi]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
  },
  StETH: {
    symbol: 'stETH',
    decimals: 18,
    addresses: {
      [CHAINS.Mainnet]: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      [CHAINS.Hoodi]: '0x3508A952176b3c15387C97BE809eaffB1982176a',
    },
  },
  USDT: {
    symbol: 'USDT',
    decimals: 6,
    addresses: {
      [CHAINS.Mainnet]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      [CHAINS.Hoodi]: '0x64f1904d1b419c6889BDf3238e31A138E258eA68',
    },
  },
  USDC: {
    symbol: 'USDC',
    decimals: 6,
    addresses: {
      [CHAINS.Mainnet]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [CHAINS.Hoodi]: '0x97bb030B93faF4684eAC76bA0bf3be5ec7140F36',
    },
  },
  LDO: {
    symbol: 'LDO',
    decimals: 18,
    addresses: {
      [CHAINS.Mainnet]: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
      [CHAINS.Hoodi]: '0xEf2573966D009CcEA0Fc74451dee2193564198dc',
    },
  },
};

export type KnownToken = (typeof KnownToken)[keyof typeof KnownToken];
