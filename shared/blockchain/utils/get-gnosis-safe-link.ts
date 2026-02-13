import get from 'lodash/get';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

const PREFIXES = {
  [CHAINS.Mainnet]: 'eth',
  [CHAINS.Hoodi]: 'eth',
} as const;

export const getGnosisSafeLink = (
  chainId: CHAINS,
  address: string,
  txHash: string,
) => {
  if (chainId === CHAINS.Hoodi) {
    return `https://app.safe.protofire.io/transactions?safe=hoodi:${address}`;
  }

  const chain = get(PREFIXES, chainId, '?');
  return `https://app.safe.global/transactions/tx?safe=${chain}:${address}&id=multisig_${address}_${txHash}`;
};
