import { Hex } from 'viem';

const EIP_7702_DELEGATION_PREFIX = '0xef0100';

export const isContractBytecode = (bytecode: Hex | undefined) =>
  Boolean(
    bytecode &&
      bytecode !== '0x' &&
      !bytecode.toLowerCase().startsWith(EIP_7702_DELEGATION_PREFIX),
  );
