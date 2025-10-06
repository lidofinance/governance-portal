import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const isTestnet = (chainId: CHAINS) =>
  chainId === CHAINS.Holesky || chainId === CHAINS.Hoodi;
