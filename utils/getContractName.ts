import { CHAINS } from '@lido-sdk/constants';
import * as addressMaps from 'consts/contractAddresses';

export const getContractName = (chainId: CHAINS, address: string) => {
  return (Object.keys(addressMaps) as (keyof typeof addressMaps)[]).find(
    (contractName) =>
      addressMaps[contractName][chainId]?.toLowerCase().trim() ===
      address.toLowerCase().trim(),
  );
};
