import {
  Address,
  decodeFunctionData,
  getAddress,
  Hex,
  isAddress,
  PublicClient,
} from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { fetchContractMetadata } from 'shared/blockchain/utils/abi';
import { decodeEvmScript } from 'shared/blockchain/utils/decode-evm-script';
import { AragonAgent } from 'shared/blockchain/contract-addresses';

export type BaseCall = {
  target: Address;
  payload: Hex;
};

type SubmitProposalCall = {
  target: Address;
  value: string;
  payload: Hex;
};

export type DecodedCall = {
  id: number;
  contractName: string | null | undefined;
  contractAddress: Address;
  functionName: string;
  args: readonly unknown[] | undefined;
  nestedCalls: DecodedCall[];
};

export const decodeCalls = async (
  calls: BaseCall[],
  chainId: CHAINS,
  useBundledAbi: boolean,
  etherscanApiKey: string | undefined,
  client: PublicClient,
  // Mutable ref to share auto-incrementing ID across recursive calls
  counter?: number[],
): Promise<DecodedCall[]> => {
  const idCounter = counter ?? [1];
  const result: DecodedCall[] = [];

  for (const call of calls) {
    const decodedCall: DecodedCall = {
      contractAddress: call.target,
      id: idCounter[0]++,
      contractName: null,
      functionName: 'unknown',
      args: undefined,
      nestedCalls: [],
    };

    if (!isAddress(call.target)) {
      result.push(decodedCall);
      continue;
    }

    // metadata is name + abi (abi is from local/etherscan)
    const metadata = await fetchContractMetadata(
      call.target,
      chainId,
      useBundledAbi,
      etherscanApiKey,
      client,
    );

    if (!metadata) {
      result.push(decodedCall);
      continue;
    }

    const { abi, name } = metadata;
    decodedCall.contractName = name;
    try {
      const decoded = decodeFunctionData({
        abi,
        data: call.payload,
      });

      decodedCall.functionName = decoded.functionName;
      decodedCall.args = decoded.args;

      if (decoded.functionName === 'submitProposal') {
        const innerCalls = decoded.args?.[0] as
          | SubmitProposalCall[]
          | undefined;
        if (Array.isArray(innerCalls)) {
          const parsedInnerCalls: BaseCall[] = innerCalls.map((innerCall) => ({
            target: getAddress(innerCall.target),
            payload: innerCall.payload,
          }));
          decodedCall.nestedCalls = await decodeCalls(
            parsedInnerCalls,
            chainId,
            useBundledAbi,
            etherscanApiKey,
            client,
            [1],
          );
        }
      } else if (decoded.functionName === 'forward') {
        const evmScriptData = decoded.args?.[0] as Hex | undefined;
        const aragonAgentAddress = AragonAgent[chainId] as string;
        if (
          typeof evmScriptData === 'string' &&
          decodedCall.contractAddress.toLowerCase() ===
            aragonAgentAddress.toLowerCase()
        ) {
          const evmScriptCalls = decodeEvmScript(evmScriptData);
          decodedCall.nestedCalls = await decodeCalls(
            evmScriptCalls,
            chainId,
            useBundledAbi,
            etherscanApiKey,
            client,
            idCounter,
          );
        }
      }
      result.push(decodedCall);
    } catch {
      // If decoding fails, we can still add the original call with functionName 'unknown'
      result.push(decodedCall);
    }
  }

  return result;
};
