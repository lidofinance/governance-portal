import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { Address } from 'viem';

type ContractAddressConfig = Address | { test: Address; actual: Address };

/**
 * Extracts the actual contract address from the configuration
 * Handles both simple string addresses and complex objects with test/actual fields
 */
export const getContractAddress = (
  addressConfig: ContractAddressConfig | undefined,
  chainId?: CHAINS,
): Address | undefined => {
  if (!addressConfig) return undefined;

  if (typeof addressConfig === 'string') {
    return addressConfig;
  }

  if (typeof addressConfig === 'object' && 'actual' in addressConfig) {
    // For test networks, prefer test address if available, otherwise use actual
    if (chainId === CHAINS.Holesky || chainId === CHAINS.Hoodi) {
      return addressConfig.test || addressConfig.actual;
    }
    return addressConfig.actual;
  }

  return undefined;
};

/**
 * Gets the contract address as a lowercase string for comparison
 */
export const getContractAddressLowerCase = (
  addressConfig: ContractAddressConfig | undefined,
  chainId?: CHAINS,
): string | undefined => {
  const address = getContractAddress(addressConfig, chainId);
  return address?.toLowerCase();
};
