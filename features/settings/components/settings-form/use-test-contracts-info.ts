import { useMemo } from 'react';
import { useLidoSDK } from '../../../../providers/lido-sdk';
import * as ADDR from 'shared/blockchain/contract-addresses';

type ContractName = keyof typeof ADDR;

export const useTestContractsInfo = () => {
  const { chainId } = useLidoSDK();

  return useMemo(() => {
    const testContracts: { name: string; address: string }[] = [];
    for (const contractName in ADDR) {
      const address = ADDR[contractName as ContractName][chainId];
      if (typeof address === 'object') {
        testContracts.push({
          name: contractName,
          address: address.test,
        });
      }
    }
    return testContracts;
  }, [chainId]);
};
