import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { Abi, Address, PublicClient } from 'viem';
import {
  ABI_EXCEPTIONS,
  AbiExceptionContractName,
} from 'constants/abi-exceptions';

import * as abis from 'abi/generated';
import { getContractName } from 'utils/get-contract-name';
import { fetcherEtherscan } from 'utils/fetcher-etherscan';
import { getProxyImplementationAddress } from './get-proxy-implementation-address';

type ContractMetadata = {
  name: string | null;
  abi: Abi;
};

/**
 * Converts PascalCase contract name to camelCase ABI key
 * e.g., AccountingOracle → accountingOracleAbi
 * e.g., AragonACL → aragonAclAbi
 */
export const getAbiKey = (contractName: string): string => {
  const parts =
    contractName.match(
      /([A-Z][a-z0-9]+)|([A-Z]+[0-9]+)|([A-Z]+(?=[A-Z][a-z0-9]|$))/g,
    ) || [];
  if (parts.length === 0) {
    return `${contractName}Abi`;
  }

  const camelCase = parts
    .map((part, index) => {
      const lower = part.toLowerCase();
      return index === 0
        ? lower
        : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');

  return `${camelCase}Abi`;
};

const getLocalAbi = (contractName: string): Abi | null => {
  if (contractName in ABI_EXCEPTIONS) {
    return ABI_EXCEPTIONS[contractName as AbiExceptionContractName];
  }

  const abiKey = getAbiKey(contractName) as keyof typeof abis;
  return abis[abiKey] ?? null;
};

const fetchAbiFromEtherscan = async ({
  address,
  chainId,
  etherscanApiKey,
  client,
}: {
  address: Address;
  chainId: CHAINS;
  etherscanApiKey: string | undefined;
  client: PublicClient;
}): Promise<Abi | null> => {
  try {
    const abiJson = await fetcherEtherscan<string>({
      chainId,
      address,
      module: 'contract',
      action: 'getabi',
      apiKey: etherscanApiKey,
    });
    const abi = JSON.parse(abiJson) as Abi;

    const proxyImplementationAddress = await getProxyImplementationAddress(
      address,
      abi,
      client,
    );

    if (!proxyImplementationAddress) {
      // Not a proxy contract, return the ABI as is
      return abi;
    }

    const implementationAbiJson = await fetcherEtherscan<string>({
      chainId,
      address: proxyImplementationAddress,
      module: 'contract',
      action: 'getabi',
      apiKey: etherscanApiKey,
    });

    try {
      // Merge proxy ABI with implementation ABI
      const implementationAbi: Abi = JSON.parse(implementationAbiJson);
      return [...abi, ...implementationAbi];
    } catch (error) {
      return abi; // If parsing implementation ABI fails, return the proxy ABI as a fallback
    }
  } catch {
    return null;
  }
};

export const getLocalContractAbi = (
  address: Address | string,
  chainId: CHAINS,
): Abi | null => {
  const contractName = getContractName(chainId, address);
  if (!contractName) {
    return null;
  }
  return getLocalAbi(contractName);
};

export type DecoderContext = {
  chainId: CHAINS;
  fetchPolicy: 'local-first' | 'local-only' | 'etherscan-only';
  etherscanApiKey?: string;
  client: PublicClient;
};

export const fetchContractMetadata = async (
  address: Address,
  decoderContext: DecoderContext,
): Promise<ContractMetadata | null> => {
  const { chainId, fetchPolicy, etherscanApiKey, client } = decoderContext;
  let result: ContractMetadata | null = null;

  const contractName = getContractName(chainId, address);

  const withLocalDecoder = fetchPolicy !== 'etherscan-only';
  if (withLocalDecoder && contractName) {
    const abi = getLocalAbi(contractName);
    if (abi) {
      result = { abi, name: contractName };
    }
  }

  if (!result) {
    if (withLocalDecoder) {
      console.warn(
        `No local ABI found for address ${address} on chain ${chainId}`,
      );
    }

    if (fetchPolicy !== 'local-only') {
      // fallback - etherscan
      const abi = await fetchAbiFromEtherscan({
        address,
        chainId,
        etherscanApiKey,
        client,
      });

      if (abi) {
        result = { abi, name: contractName };
      }
    }
  }

  return result;
};
