import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const getGnosisSafeLink = (
  chainId: CHAINS,
  address: string,
  txHash: string,
) => {
  if (chainId === CHAINS.Hoodi) {
    return `https://app.safe.protofire.io/transactions?safe=hoodi:${address}`;
  }

  return `https://app.safe.global/transactions/tx?safe=eth:${address}&id=multisig_${address}_${txHash}`;
};
