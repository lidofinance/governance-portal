import { getAbiItem } from 'viem';
import { lidoLendActivateMarketAbi } from 'abi/generated';

export const ACTIVATION_PARAMS = getAbiItem({
  abi: lidoLendActivateMarketAbi,
  name: 'decodeEVMScriptCallData',
}).outputs;

// BPS in LidoLendMarketManagerActions.sol
export const BPS = 10_000n;

// MAX_DELAY_DURATION in LidoLendMarketManagerActions.sol (7 days)
export const MAX_DELAY_DURATION = 604_800n;

// Upper bound on `lltv` in LidoLendActivateMarket.sol (1e18 = 100%)
export const WAD = 1_000_000_000_000_000_000n;

// MAX_FEE in ILidoLend.sol
export const MAX_FEE = WAD / 4n;
