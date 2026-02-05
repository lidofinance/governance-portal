import { useMemo } from 'react';
import { useLidoSDK } from 'providers/lido-sdk';
import * as ADDR from 'shared/blockchain/contract-addresses';
import { ChainAddressMap } from 'shared/blockchain/types';

type ContractName = keyof typeof ADDR;

export const useTestContractsInfo = () => {
  const { chainId } = useLidoSDK();

  return useMemo(() => {
    const testContracts: { name: string; address: string }[] = [];
    for (const contractName in ADDR) {
      const chainAddressMap = ADDR[
        contractName as ContractName
      ] as ChainAddressMap;
      const address = chainAddressMap?.[chainId];
      if (typeof address === 'object' && address.test) {
        testContracts.push({
          name: contractName,
          address: address.test,
        });
      }
    }
    return testContracts;
  }, [chainId]);
};
