import { isAddress, zeroAddress } from 'viem';

export const validateAddress = (
  value: string,
  { allowZero = false } = {},
): string | null => {
  if (!isAddress(value)) {
    return 'Address is not valid';
  }

  if (!allowZero && value.toLowerCase() === zeroAddress) {
    return 'Address must not be zero address';
  }

  return null;
};
