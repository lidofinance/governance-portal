import { Abi, ContractFunctionName, ContractFunctionReturnType } from 'viem';

export type ContractReadFunctionReturnType<
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'view'>,
> = ContractFunctionReturnType<abi, 'view', functionName>;
