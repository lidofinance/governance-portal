import { formatUnits, getAbiItem, parseUnits } from 'viem';
import { lidoLendActivateMarketAbi } from 'abi/generated';

// `decodeEVMScriptCallData` returns exactly what the payload encodes, so the
// decoder's outputs are the encode params. Field names, types and order come
// from the compiled factory and follow a contract change on the next codegen.
export const ACTIVATION_PARAMS = getAbiItem({
  abi: lidoLendActivateMarketAbi,
  name: 'decodeEVMScriptCallData',
}).outputs;

// Upper bound on `lltv` in LidoLendActivateMarket.sol (1e18 = 100%)
export const WAD = 1_000_000_000_000_000_000n;

// MAX_FEE in ILidoLend.sol
export const MAX_FEE = WAD / 4n;

// 1% is 1e16 of a WAD value, so 86 encodes as exactly 0.86e18.
export const parsePercentInput = (value: string) => parseUnits(value, 16);

export const validatePercentValue = (value: string) => {
  if (value.trim() === '') {
    return 'Invalid value';
  }
  try {
    parsePercentInput(value);
    return null;
  } catch {
    return 'Unable to parse value';
  }
};

export const validateFeePercent = (value: string) =>
  validatePercentValue(value) ??
  (parsePercentInput(value) <= MAX_FEE ||
    `Fee must not exceed ${formatUnits(MAX_FEE, 16)}%`);
