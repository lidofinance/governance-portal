import { utils } from 'ethers';
const DEFAULT_DECIMALS = 18;

export const validateToken = (value: string, decimals = DEFAULT_DECIMALS) => {
  if (Number(value) <= 0) {
    return 'Value must be positive';
  }
  try {
    utils.parseUnits(value, decimals);
    return null;
  } catch (_) {
    return 'Unable to parse value';
  }
};
