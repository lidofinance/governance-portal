import { parseEther } from 'viem';

export const validateUintValue = (
  value: string | undefined,
  { min, max }: { min?: bigint; max?: bigint } = {},
): string | null => {
  try {
    const parsedValue = BigInt(value as string);
    if (parseEther(value ?? '') < 0n) {
      return 'Value must not be negative';
    }
    if (min !== undefined && parsedValue < min) {
      return `Value must be at least ${min}`;
    }
    if (max !== undefined && parsedValue > max) {
      return `Value must be less than or equal to ${max}`;
    }
  } catch (error) {
    return 'Unable to parse value';
  }

  return null;
};
