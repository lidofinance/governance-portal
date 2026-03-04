import { parseUnits } from 'viem';
import { ETH_DECIMALS } from 'shared/blockchain/constants';

export const validateToken = (value: string, decimals = ETH_DECIMALS) => {
  if (Number(value) <= 0) {
    return 'Value must be positive';
  }
  try {
    parseUnits(value, decimals);
    return null;
  } catch (_) {
    return 'Unable to parse value';
  }
};
