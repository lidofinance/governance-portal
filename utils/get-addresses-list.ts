import * as addressMaps from 'shared/blockchain/contract-addresses';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const getAddressesList = (
  chainId: CHAINS,
): {
  contractName: string;
  address: string;
}[] => {
  const contractNames = Object.keys(addressMaps);
  return contractNames
    .map((contractName) => {
      const addressMap = (addressMaps as any)[contractName];
      const entry = addressMap?.[chainId];

      if (!entry) return null;
      if (Array.isArray(entry)) return null; // Skip arrays

      const address = typeof entry === 'string' ? entry : entry.actual;

      return {
        contractName,
        address,
      };
    })
    .filter(Boolean) as { contractName: string; address: string }[];
};
