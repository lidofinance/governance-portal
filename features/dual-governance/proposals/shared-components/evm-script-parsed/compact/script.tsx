import { useLidoSDK } from 'providers/lido-sdk';
import * as ADDR from 'shared/blockchain/contract-addresses';
import * as abis from 'generated';
import { Address, Hex, decodeFunctionData } from 'viem';
import { ScriptBody } from './script-body';

interface Call {
  payload: Hex;
  target: Address;
  value: bigint;
}

type Props = {
  calls?: Call[];
};

type ContractName = keyof typeof ADDR;

const ABI_EXCEPTIONS = {
  StETH: abis.StethAbi__factory.abi,
} as const;

type ExceptionContractName = keyof typeof ABI_EXCEPTIONS;

export const Script = ({ calls = [] }: Props) => {
  const { chainId } = useLidoSDK();
  const decodedCalls = calls.map((call: Call, index) => {
    const localId = index + 1;
    const contractAddress = call.target;
    const contractName = Object.keys(ADDR).find(
      (contractName: string) =>
        ADDR[contractName as ContractName][chainId] === contractAddress,
    );
    let abi;

    if (contractName && contractName in ABI_EXCEPTIONS) {
      abi = ABI_EXCEPTIONS[contractName as ExceptionContractName];
    } else {
      try {
        const abiFactoryKey =
          `${contractName as ContractName}Abi__factory` as keyof typeof abis;
        abi = abis[abiFactoryKey]?.abi;
      } catch (e) {
        throw new Error(`contractName: ${contractName}, error: ${e}`);
      }
    }
    const decoded = decodeFunctionData({
      abi: abi,
      data: call.payload,
    });

    return { contractName, decoded, id: localId };
  });

  return <ScriptBody calls={decodedCalls} />;
};
