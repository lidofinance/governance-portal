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
      return foundAddress.toLowerCase() === lowerAddress;
    },
  );

  if (!name) {
    return null;
  }

  return name;
};
