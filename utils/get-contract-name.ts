import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import * as addressMaps from 'shared/blockchain/contract-addresses';
import { ChainAddressMap } from 'shared/blockchain/types';

export const getContractName = (chainId: CHAINS, address: string) => {
  const lowerAddress = address.toLowerCase();
  const name = (Object.keys(addressMaps) as (keyof typeof addressMaps)[]).find(
    (contractName) => {
      const chainAddressMap = addressMaps[contractName] as ChainAddressMap;
      const foundAddress = chainAddressMap?.[chainId];
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
