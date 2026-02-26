import { StETH, WstETH, WithdrawalQueue } from './contracts';
import { Token } from './types';

export const TOKEN_CONTRACT_MAP = {
  [Token.stETH]: StETH,
  [Token.wstETH]: WstETH,
  [Token.unstETH]: WithdrawalQueue,
};

export const ETH_DECIMALS = 18;

export const COW_EXPLORER_URL = 'https://explorer.cow.fi';
