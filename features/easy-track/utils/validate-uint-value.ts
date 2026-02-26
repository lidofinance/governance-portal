import { parseEther } from 'viem';

export const validateUintValue = (value: string | undefined): string | null => {
  try {
    BigInt(value as string);
    const parsedValue = parseEther(value ?? '');
    if (parsedValue < 0n) {
      return 'Value must not be negative';
    }
  } catch (error) {
    return 'Unable to parse value';
  }

  return null;
};
