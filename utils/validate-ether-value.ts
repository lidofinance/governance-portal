import { parseEther } from 'viem';

export const validateEtherValue = (value: string) => {
  if (value.trim() === '') {
    return 'Invalid value';
  }
  if (value.includes('-')) {
    return 'Value must not be negative';
  }

  // Replace comma for locales where "," is decimal separator
  const normalized = value.replaceAll(',', '.');

  try {
    parseEther(normalized);
    return null;
  } catch {
    return 'Unable to parse value';
  }
};
