import { Abi, Address } from 'viem';

import { useConfig } from 'config';
import { useLidoSDK } from 'providers/lido-sdk';
import * as ADDR from 'shared/blockchain/contract-addresses';
import { getLocalContractAbi } from 'shared/blockchain/utils/abi';
import { useGlobalMemo } from 'shared/hooks';

type ContractName = keyof typeof ADDR;

// Map of contract addresses to their ABIs on the current chain
export const useAbiMap = () => {
  const { chainId } = useLidoSDK();
  const { userConfig } = useConfig();

  const useTestContracts = userConfig.savedUserConfig.useTestContracts;

  return useGlobalMemo(() => {
    const result: Record<string, Abi> = {};

    for (const contractName of Object.keys(ADDR) as ContractName[]) {
      const contractAddressMap = ADDR[contractName];
      const addressConfig = contractAddressMap?.[chainId];
      if (!addressConfig) {
        continue;
      }

      const addresses: Address[] = [];
      if (typeof addressConfig === 'object') {
        if (useTestContracts && 'test' in addressConfig) {
          addresses.push(addressConfig.test);
        }

        if ('actual' in addressConfig && addressConfig.actual) {
          addresses.push(addressConfig.actual);
        }
      } else {
        addresses.push(addressConfig);
      }

      for (const address of addresses) {
        const abi = getLocalContractAbi(address, chainId);
        if (abi) {
          result[address] = abi;
        }
      }
    }

    return result;
  }, `abi-map-${chainId}-${useTestContracts}`);
};
