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

// IDs mirror the Action enum in LidoLendGuardianActions.sol.
// They are part of the calldata ABI and must not be reordered.
export enum LidoLendGuardianAction {
  AddGuardian = 0,
  RemoveGuardian = 1,
  ReplaceGuardian = 2,
  SetGuardiansQuorum = 3,
  SetSuspectWindow = 4,
  UnbanAccounts = 5,
}

// IDs mirror the Action enum in LidoLendCircuitBreakerActions.sol.
// They are part of the calldata ABI and must not be reordered.
export enum LidoLendCircuitBreakerAction {
  RegisterPauser = 0,
  SetPauseDuration = 1,
  SetHeartbeatInterval = 2,
}

// IDs mirror the Action enum in LidoLendExitBookActions.sol.
// They are part of the calldata ABI and must not be reordered.
export enum LidoLendExitBookAction {
  SetMorphoExitBookAllowed = 0,
  SetErc4626ExitBookAllowed = 1,
}
