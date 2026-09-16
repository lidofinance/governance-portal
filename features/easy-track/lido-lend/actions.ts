// IDs mirror the Action enum in LidoLendMarketManagerActions.sol.
// They are part of the calldata ABI and must not be reordered.
export enum LidoLendMarketManagerAction {
  SetInstantActivation = 0,
  SetCollateralActivationConfig = 1,
  SetSettlementConfig = 2,
  SetSupplyCap = 3,
  UnfreezeMarkets = 4,
  SetFee = 5,
}
