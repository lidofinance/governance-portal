import { useGlobalMemo } from 'shared/hooks';

import {
  ABIProvider,
  ABIElement as ABIElementImported,
} from '@lidofinance/evm-script-decoder/lib/types';

import {
  EVMScriptDecoder,
  abiProviders,
} from '@lidofinance/evm-script-decoder';

import * as abis from 'abi/generated';
import * as ADDR from 'shared/blockchain/contract-addresses';
import { ChainAddressMap } from 'shared/blockchain/types';
import { useGetRpcUrlByChainId } from 'config/rpc';
import { useLidoSDK } from 'providers/lido-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { fetcherEtherscan } from 'utils/fetcher-etherscan';
import { useConfig } from 'config';
import { Address, createPublicClient, getContract, http } from 'viem';

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
  HashConsensusAccountingOracle: abis.hashConsensusAbi,
  HashConsensusValidatorsExitBus: abis.hashConsensusAbi,
  LidoAppRepo: abis.repoAbi,
  NodeOperatorsRegistryRepo: abis.repoAbi,
  OracleRepo: abis.repoAbi,
  SimpleDVT: abis.nodeOperatorsRegistryAbi,
  CSVerifierProposed: abis.csVerifierAbi,
} as const;

type ExceptionContractName = keyof typeof ABI_EXCEPTIONS;
type GeneralContractName = Exclude<ContractName, ExceptionContractName>;

const getAbiKey = (contractName: string): string => {
  const camelCase =
    contractName.charAt(0).toLowerCase() + contractName.slice(1);
  return `${camelCase}Abi`;
};

/**
 The only reason we still keep EVMScriptDecoder is to check whether the ongoing Aragon vote item has Unknown contracts.
 We need later to move on to Viem parsing as we do for the parsed calls of the DG Items
 */

export const useEVMScriptDecoder = (): EVMScriptDecoder => {
  const { chainId } = useLidoSDK();
  const { userConfig } = useConfig();
  const { etherscanApiKey, useBundledAbi } = userConfig.savedUserConfig;
  const getRpcUrlByChainId = useGetRpcUrlByChainId();
  const rpcUrl = getRpcUrlByChainId(chainId as unknown as CHAINS);

  return useGlobalMemo(() => {
    // Map of contract addresses to their ABIs on the current chain
    // needed to initialize the localDecoder
    const abiMap = Object.keys(ADDR).reduce(
      (result, contractName: string) => {
        const contractAddressMap = ADDR[
          contractName as ContractName
        ] as ChainAddressMap;
        const addressConfig = contractAddressMap?.[chainId as CHAINS];
        if (!addressConfig) {
          return result;
        }

        let addresses: string[];
        if (typeof addressConfig === 'object' && 'actual' in addressConfig) {
          const useTestContracts = userConfig.savedUserConfig.useTestContracts;
          if (useTestContracts) {
            addresses = [addressConfig.test, addressConfig.actual];
          } else {
            addresses = [addressConfig.actual];
          }
        } else {
          addresses = [addressConfig as string];
        }

        let abi: ABIElement[] | undefined;
        if (contractName in ABI_EXCEPTIONS) {
          abi = ABI_EXCEPTIONS[
            contractName as ExceptionContractName
          ] as unknown as ABIElement[];
        } else {
          try {
            const abiKey = getAbiKey(
              contractName as GeneralContractName,
            ) as keyof typeof abis;
            abi = abis[abiKey] as unknown as ABIElement[];
          } catch (e) {
            throw new Error(`contractName: ${contractName}, error: ${e}`);
          }
        }

        if (abi) {
          addresses.forEach((address) => {
            result[address] = abi;
          });
        }
        return result;
      },
      {} as Record<string, ABIElement[]>,
    );

    const localDecoder = new abiProviders.Local(
      abiMap as Record<string, ABIElementImported[]>,
    );

    const etherscanDecoder = new abiProviders.Base({
      fetcher: async (address) => {
        const res = await fetcherEtherscan<string>({
          chainId,
          address,
          module: 'contract',
          action: 'getabi',
          apiKey: etherscanApiKey,
        });
        return JSON.parse(res);
      },
      middlewares: [
        abiProviders.middlewares.ProxyABIMiddleware({
          implMethodNames: [
            ...abiProviders.middlewares.ProxyABIMiddleware
              .DefaultImplMethodNames,
            '__Proxy_implementation',
            'proxy__getImplementation',
          ],
          loadImplAddress: async (_proxyAddress, _abiElement) => {
            try {
              const publicClient = createPublicClient({
                transport: http(rpcUrl),
              });

              const contract = getContract({
                address: _proxyAddress as Address,
                abi: [_abiElement],
                client: publicClient,
              });

              const result = await contract.read[_abiElement.name]();
              return typeof result === 'string' ? result : undefined;
            } catch (error) {
              return undefined;
            }
          },
        }),
      ],
    });

    return new EVMScriptDecoder(
      ...([useBundledAbi && localDecoder, etherscanDecoder].filter(
        Boolean,
      ) as ABIProvider[]),
    );
  }, `evm-script-decoder-${chainId}-${rpcUrl}}`);
};
