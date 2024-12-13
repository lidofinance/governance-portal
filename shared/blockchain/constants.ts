import { StETH, WstETH, WithdrawalQueue } from './contracts';
import { Token } from './types';

export const TOKEN_CONTRACT_MAP = {
  [Token.stETH]: StETH,
  [Token.wstETH]: WstETH,
  [Token.unstETH]: WithdrawalQueue,
};
