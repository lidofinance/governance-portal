import * as addressMaps from 'shared/blockchain/contract-addresses';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const getAddressesList = (
  chainId: CHAINS,
): {
  contractName: string;
  address: string;
}[] => {
  const contractNames = Object.keys(addressMaps);
  return contractNames.map((contractName) => {
    const address = (addressMaps as Record<string, Record<number, string>>)[
      contractName
    ][chainId];

    return {
      contractName,
      address,
    };
  });
};
