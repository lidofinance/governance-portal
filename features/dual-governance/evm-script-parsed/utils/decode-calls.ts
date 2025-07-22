import * as ADDR from 'shared/blockchain/contract-addresses';
import * as abis from 'generated';
import { Address, Hex } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { ABI } from 'shared/blockchain/types';
import { utils } from 'ethers';
import { getContractName } from 'utils/get-contract-name';

type ContractName = keyof typeof ADDR;

const ABI_EXCEPTIONS = {
  HashConsensusAccountingOracle: abis.HashConsensusAbi__factory.abi,
  HashConsensusValidatorsExitBus: abis.HashConsensusAbi__factory.abi,
  StETH: abis.StethAbi__factory.abi,
  WithdrawalQueue: abis.WithdrawalQueueERC721Abi__factory.abi,
  CSVerifierProposed: abis.CSVerifierAbi__factory.abi,
} as const;

type ExceptionContractName = keyof typeof ABI_EXCEPTIONS;

export type DecodedCall = {
  contractName: string | undefined;
  contractAddress: string;
  decoded: {
    functionName: string;
    args: readonly unknown[] | undefined;
    nestedCalls?: DecodedCall[];
  } | null;
  id: number;
};

type BaseCall = {
  target: string;
  payload: string;
};

type Props<TCall extends BaseCall> = {
  calls: TCall[];
  chainId: CHAINS;
};

const parseEVMScript = (evmScript: string): BaseCall[] => {
  if (!evmScript.startsWith('0x')) return [];

  const data = evmScript.slice(2);
  const nestedCalls: BaseCall[] = [];
  let offset = 0;

  if (data.slice(0, 8) !== '00000001') {
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

    nestedCalls.push({ target, payload });
  }

  return nestedCalls;
};

export const decodeCalls = <TCall extends BaseCall>({
  calls,
  chainId,
}: Props<TCall>): DecodedCall[] => {
  if (calls.length === 0) return [];

  return calls.map((call: TCall, index) => {
    const localId = index + 1;
    const contractAddress = call.target;

    const contractName = getContractName(chainId, contractAddress) ?? undefined;

    let abi: ABI | undefined;
    const matchingContractName = Object.keys(ADDR).find(
      (name: string) =>
        ADDR[name as ContractName][chainId]?.toLowerCase() ===
        contractAddress.toLowerCase(),
    ) as ContractName | undefined;

    if (matchingContractName) {
      try {
        if (matchingContractName in ABI_EXCEPTIONS) {
          abi = ABI_EXCEPTIONS[matchingContractName as ExceptionContractName];
        } else {
          const abiFactoryKey =
            `${matchingContractName}Abi__factory` as keyof typeof abis;
          abi = abis[abiFactoryKey]?.abi;
        }
      } catch (error) {
        console.warn(
          `Failed to load ABI for contract ${matchingContractName}:`,
          error,
        );
      }
    }

    let decoded: {
      functionName: string;
      args: readonly unknown[] | undefined;
      nestedCalls?: DecodedCall[];
    } | null = null;
    if (abi && call.payload.startsWith('0x')) {
      try {
        const iface = new utils.Interface(abi);
        const decodedTx = iface.parseTransaction({ data: call.payload });
        decoded = {
          functionName: decodedTx.name,
          args: decodedTx.args,
        };

        if (decodedTx.name === 'forward' && decodedTx.args[0]) {
          const evmScript = decodedTx.args[0] as string;
          const nestedBaseCalls = parseEVMScript(evmScript);
          const nestedDecodedCalls = decodeCalls({
            calls: nestedBaseCalls,
            chainId,
          });
          decoded.nestedCalls = nestedDecodedCalls.map((nestedCall) => ({
            ...nestedCall,
            id: undefined,
          })) as unknown as DecodedCall[];
        }
      } catch (error) {
        console.warn(
          `Failed to decode calldata for contract at ${contractAddress}:`,
          error,
        );
      }
    }

    return {
      contractAddress,
      contractName,
      decoded,
      id: localId,
    };
  });
};
