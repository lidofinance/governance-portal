export const validateBytes32 = (value: string): string | null => {
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
    return 'Value must be a 32-byte hex string';
  }

  return null;
};
