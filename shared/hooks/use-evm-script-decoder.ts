import { useGlobalMemo } from 'shared/hooks';

import {
  ABIProvider,
  ABIElement as ABIElementImported,
} from '@lidofinance/evm-script-decoder/lib/types';

import {
  EVMScriptDecoder,
  abiProviders,
} from '@lidofinance/evm-script-decoder';

import * as abis from 'generated';
import * as ADDR from 'shared/blockchain/contract-addresses';
import { useGetRpcUrlByChainId } from 'config/rpc';
import { useSDK } from '@lido-sdk/react';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

type ContractName = keyof typeof ADDR;

// This is a little hack needed because some of the local ABIs
// doesn't meet the ABIElement type requirements
type ABIElement = Omit<ABIElementImported, 'name' | 'type'> & {
  name?: string;
  type?: string;
};

// This object contains ABIs of contracts that are using the same ABI
// but have different names than the ABI file
const ABI_EXCEPTIONS = {
  HashConsensusAccountingOracle: abis.HashConsensusAbi__factory.abi,
  HashConsensusValidatorsExitBus: abis.HashConsensusAbi__factory.abi,
  LidoAppRepo: abis.RepoAbi__factory.abi,
  NodeOperatorsRegistryRepo: abis.RepoAbi__factory.abi,
  OracleRepo: abis.RepoAbi__factory.abi,
  SimpleDVT: abis.NodeOperatorsRegistryAbi__factory.abi,
} as const;

type ExceptionContractName = keyof typeof ABI_EXCEPTIONS;
type GeneralContractName = Exclude<ContractName, ExceptionContractName>;

/**
  The only reason we still keep EVMScriptDecoder is to check whether the ongoing Aragon vote item has Unknown contracts.
  We need later to move on to Viem parsing as we do for the parsed calls of the DG Items
*/

export const useEVMScriptDecoder = (): EVMScriptDecoder => {
  const { chainId } = useSDK();
  const getRpcUrlByChainId = useGetRpcUrlByChainId();
  const rpcUrl = getRpcUrlByChainId(chainId as unknown as CHAINS);

  return useGlobalMemo(() => {
    // Map of contract addresses to their ABIs on the current chain
    // needed to initialize the localDecoder
    const abiMap = Object.keys(ADDR).reduce(
      (result, contractName: string) => {
        const address =
          ADDR[contractName as ContractName][chainId as unknown as CHAINS];
        if (!address) {
          return result;
        }
        let abi: ABIElement[] | undefined;
        if (contractName in ABI_EXCEPTIONS) {
          abi = ABI_EXCEPTIONS[contractName as ExceptionContractName];
        } else {
          try {
            const abiFactoryKey =
              `${contractName as GeneralContractName}Abi__factory` as keyof typeof abis;
            abi = abis[abiFactoryKey]?.abi;
          } catch (e) {
            throw new Error(`contractName: ${contractName}, error: ${e}`);
          }
        }

        if (abi) {
          result[address] = abi;
        }
        return result;
      },
      {} as Record<string, ABIElement[]>,
    );

    const localDecoder = new abiProviders.Local(
      abiMap as Record<string, ABIElementImported[]>,
    );

    return new EVMScriptDecoder(
      ...([localDecoder].filter(Boolean) as ABIProvider[]),
    );
  }, `evm-script-decoder-${chainId}-${rpcUrl}}`);
};
