import { TierParams } from './types';

export const EMPTY_TIER: TierParams = {
  shareLimit: '',
  reserveRatioBP: '',
  forcedRebalanceThresholdBP: '',
  infraFeeBP: '',
  liquidityFeeBP: '',
  reservationFeeBP: '',
};

// address public constant DEFAULT_TIER_OPERATOR = address(uint160(type(uint160).max));
export const DEFAULT_TIER_OPERATOR =
  '0xffffffffffffffffffffffffffffffffffffffff';
