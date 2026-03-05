import { Address, decodeFunctionData, Hex } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import * as abis from 'abi/generated';
import { ABIElement } from '../shared/blockchain/types';
import { getContractName } from './get-contract-name';

type ExceptionContractName = keyof typeof ABI_EXCEPTIONS;

export type BaseCall = {
  target: Address;
  payload: Hex;
};

type DecodeCallArgs<TCall extends BaseCall> = {
  calls: TCall[];
  chainId: CHAINS;
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
} | null;

const ABI_EXCEPTIONS = {
  HashConsensusAccountingOracle: abis.hashConsensusAbi,
  HashConsensusValidatorsExitBus: abis.hashConsensusAbi,
  LidoAppRepo: abis.repoAbi,
  NodeOperatorsRegistryRepo: abis.repoAbi,
  OracleRepo: abis.repoAbi,
  SimpleDVT: abis.nodeOperatorsRegistryAbi,
  DualGovernanceLegacy: abis.dualGovernanceAbi,
};

const EVM_SCRIPT_VERSION = '00000001';

/**
 * Converts PascalCase contract name to camelCase ABI key
 * e.g., AccountingOracle → accountingOracleAbi
 * e.g., AragonACL → aragonAclAbi
 */
const getAbiKey = (contractName: string): string => {
  const parts =
    contractName.match(/([A-Z][a-z0-9]+)|([A-Z]+(?=[A-Z][a-z0-9]|$))/g) || [];
  if (parts.length === 0) return `${contractName}Abi`;

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

export const getContractAbi = (
  contractAddress: Address,
  chainId: CHAINS,
): ABIElement[] | undefined => {
  const contractName = getContractName(chainId, contractAddress);

  if (!contractName) {
    return;
  }

  try {
    if (contractName in ABI_EXCEPTIONS) {
      return ABI_EXCEPTIONS[
        contractName as ExceptionContractName
      ] as unknown as ABIElement[];
    } else {
      const abiKey = getAbiKey(contractName) as keyof typeof abis;
      return abis[abiKey] as unknown as ABIElement[];
    }
  } catch (error) {
    console.warn(`Failed to load ABI for contract ${contractName}:`, error);
  }
};

export const decodeEvmScript = (script: Hex) => {
  if (!script.startsWith('0x')) return [];

  const data = script.slice(2);
  const calls: BaseCall[] = [];

  let offset = 0;

  if (data.slice(0, 8) !== EVM_SCRIPT_VERSION) {
    console.warn('Unsupported EVM script version');
    return [];
  }
  offset += 8;

  while (offset < data.length) {
    const target: Address = `0x${data.slice(offset, offset + 40)}`;

    offset += 40;

    const lengthHex = data.slice(offset, offset + 8);
    const length = parseInt(lengthHex, 16);
    offset += 8;

    const payload: Hex = `0x${data.slice(offset, offset + length * 2)}`;
    offset += length * 2;

    calls.push({ target, payload });
  }

  return calls;
};

export const decodeCalls = <TCall extends BaseCall>({
  calls,
  chainId,
}: DecodeCallArgs<TCall>): DecodedCall[] => {
  if (calls.length === 0) return [];
  const decoded = calls.reduce<DecodedCall[]>((result, call, index) => {
    const contractAddress = call.target;

    const contractName = getContractName(chainId, contractAddress);
    let abi: ABIElement[] | undefined;
    if (contractName) {
      abi = getContractAbi(contractAddress, chainId);
    }

    let decodedCall: DecodedCall = {
      contractAddress,
      id: index,
      contractName,
      functionName: 'unknown',
      args: undefined,
      nestedCalls: [],
    };

    if (abi && call.payload.startsWith('0x')) {
      try {
        const decodedData = decodeFunctionData({
          abi: abi,
          data: call.payload,
        });
        decodedCall = {
          ...decodedData,
          contractAddress,
          contractName,
          id: 0,
          nestedCalls: [],
        };

        if (decodedData.functionName === 'submitProposal' && decodedData.args) {
          const submitProposalCalls = (
            decodedData.args[0] as SubmitProposalCall[]
          ).map((call) => ({
            ...call,
            value: String(call.value),
          })) as SubmitProposalCall[];
          const nestedCalls = decodeCalls({
            calls: submitProposalCalls,
            chainId,
          });
          decodedCall.nestedCalls = nestedCalls.map(
            (nestedCall) =>
              ({
                ...nestedCall,
                id: undefined,
              }) as unknown as DecodedCall,
          );
        }

        // Flatten calls for `forward` function
        if (decodedCall.functionName === 'forward' && decodedCall.args) {
          const forwardDecodedData = decodeEvmScript(
            decodedCall.args[0] as Hex,
          );
          const rawForwardDecodedData = forwardDecodedData.map((callData) => ({
            target: callData.target,
            payload: callData.payload,
          }));
          const innerCalls = decodeCalls({
            calls: rawForwardDecodedData,
            chainId,
          });
          result.push(...innerCalls);
          return result;
        }
      } catch (e) {
        console.warn(
          `Failed to decode calldata for contract at ${contractAddress}:`,
          e,
        );
      }
    }

    result.push(decodedCall);
    return result;
  }, []);

  return decoded.map((call, i) => (call ? { ...call, id: i + 1 } : call));
};
