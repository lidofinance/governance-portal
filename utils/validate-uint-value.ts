import { parseEther } from 'viem';

export const validateUintValue = (value: string | undefined): string | null => {
  try {
    BigInt(value || 0);
    const parsedValue = parseEther(value ?? '');
    if (parsedValue < 0) {
      return 'Value must not be negative';
    }
  } catch (error) {
    return 'Unable to parse value';
  }

  return null;
};
