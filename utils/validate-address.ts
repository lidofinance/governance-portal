import { isAddress, zeroAddress } from 'viem';

export const validateAddress = (value: string): string | null => {
  if (!isAddress(value)) {
    return 'Address is not valid';
  }

  if (value.toLowerCase() === zeroAddress) {
    return 'Address must not be zero address';
  }

  return null;
};
