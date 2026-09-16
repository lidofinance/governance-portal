import { formatUnits, maxUint256, parseUnits } from 'viem';
import { MAX_FEE } from './constants';

export const validateInteger = (value: string, max = maxUint256) => {
  if (value.trim() !== value || !/^\d+$/.test(value)) {
    return 'Value must be a non-negative whole number';
  }
  if (BigInt(value) > max) {
    return `Value must not exceed ${max}`;
  }
  return null;
};

// 1% is 1e16 of a WAD value, so 86 encodes as exactly 0.86e18.
export const parsePercentInput = (value: string) => parseUnits(value, 16);

export const validatePercentValue = (value: string, max = maxUint256) => {
  if (value.trim() !== value || !/^(\d+(\.\d*)?|\.\d+)$/.test(value)) {
    return 'Value must be a non-negative number';
  }
  const fraction = value.split('.')[1] ?? '';
  if (fraction.replace(/0+$/, '').length > 16) {
    return 'Value must have at most 16 decimal places';
  }
  if (parsePercentInput(value) > max) {
    return `Value must not exceed ${formatUnits(max, 16)}%`;
  }
  return null;
};

export const validateFeePercent = (value: string) =>
  validatePercentValue(value, MAX_FEE);
