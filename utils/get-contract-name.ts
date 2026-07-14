import { EvmUnrecognized } from '@easy-track/evm-addresses';
import { getMotionTypeByScriptFactory } from '@easy-track/utils/get-motion-type';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { zeroAddress } from 'viem';
import * as addressMaps from 'shared/blockchain/contract-addresses';

export const getContractName = (chainId: CHAINS, address: string) => {
  const lowerAddress = address.toLowerCase();
  if (lowerAddress === zeroAddress) {
    return null;
  }

  const name = (Object.keys(addressMaps) as (keyof typeof addressMaps)[]).find(
    (contractName) => {
      const chainAddressMap = addressMaps[contractName];
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
    // Try to look for EasyTrack EVM script factory addresses
    const factoryName = getMotionTypeByScriptFactory(chainId, address);
    if (factoryName === EvmUnrecognized) {
      return null;
    }

    return factoryName;
  }

  return name;
};
