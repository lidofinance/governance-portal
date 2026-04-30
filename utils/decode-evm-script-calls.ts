import { Address, decodeFunctionData, getAddress, Hex, isAddress } from 'viem';
import {
  DecoderContext,
  fetchContractMetadata,
} from 'shared/blockchain/utils/abi';
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
  decoderContext: DecoderContext,
  // Mutable ref to share auto-incrementing ID across recursive calls
  counter?: number[],
): Promise<DecodedCall[]> => {
  const idCounter = counter ?? [1];
  const result: DecodedCall[] = [];
  const aragonAgentAddress = AragonAgent[decoderContext.chainId];

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
    const metadata = await fetchContractMetadata(call.target, decoderContext);

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
            decoderContext,
            [1],
          );
        }
      } else if (decoded.functionName === 'forward') {
        const evmScriptData = decoded.args?.[0] as Hex | undefined;
        if (
          typeof evmScriptData === 'string' &&
          typeof aragonAgentAddress === 'string' &&
          decodedCall.contractAddress.toLowerCase() ===
            aragonAgentAddress.toLowerCase()
        ) {
          const evmScriptCalls = decodeEvmScript(evmScriptData);
          decodedCall.nestedCalls = await decodeCalls(
            evmScriptCalls,
            decoderContext,
            [1],
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
