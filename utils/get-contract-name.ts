import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import * as addressMaps from 'shared/blockchain/contract-addresses';

export const getContractName = (chainId: CHAINS, address: string) => {
  const lowerAddress = address.toLowerCase();
  const name = (Object.keys(addressMaps) as (keyof typeof addressMaps)[]).find(
    (contractName) => {
      const foundAddress = addressMaps[contractName][chainId];
      if (!foundAddress) {
        return false;
      }

      if (typeof foundAddress === 'object' && 'actual' in foundAddress) {
        const actualAddress = foundAddress.actual?.toLowerCase();
        const testAddress = foundAddress.test?.toLowerCase();
        return actualAddress === lowerAddress || testAddress === lowerAddress;
      }

      if (typeof foundAddress === 'string') {
        return foundAddress.toLowerCase() === lowerAddress;
      }

      return false;
    },
  );

  if (!name) {
    return null;
  }

  return name;
};
