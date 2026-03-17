import { BaseCall } from 'utils/decode-evm-script-calls';
import { Address, Hex } from 'viem';

export const EVM_SCRIPT_SPEC_ID = '00000001';

export const decodeEvmScript = (script: Hex) => {
  if (!script.startsWith('0x')) {
    return [];
  }

  const data = script.slice(2);
  const calls: BaseCall[] = [];

  let offset = 0;

  if (data.slice(0, 8) !== EVM_SCRIPT_SPEC_ID) {
    console.warn('Unsupported EVM script spec ID');
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
