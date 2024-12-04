import { Token } from 'shared/blockchain/types';

export enum GovernanceState {
  Unset,
  Normal,
  VetoSignalling,
  VetoSignallingDeactivation,
  VetoCooldown,
  RageQuit,
}

export const VisibleGovernanceState = {
  Loading: 'Loading',
  Normal: 'Normal',
  Warning: 'Warning',
  BlockedVetoSignalling: 'BlockedVetoSignalling',
  BlockedRageQuit: 'BlockedRageQuit',
  BlockedDeactivation: 'BlockedDeactivation',
  Cooldown: 'Cooldown',
} as const;

export type VisibleGovernanceState = keyof typeof VisibleGovernanceState;

export enum TransactionState {
  SUCCESS,
  ERROR,
  PENDING,
}

export type DualGovernanceState = {
  vetoSupportPercent: string;
  totalStEthInEscrow: string;
  amountTillNextPhasePercent: string;
  visibleState: VisibleGovernanceState;
  stEthTotalSupply: bigint;
  detailedState: {
    effectiveState: number;
    persistedState: number;
    persistedStateEnteredAt: number;
    vetoSignallingActivatedAt: number;
    vetoSignallingReactivationTime: number;
    normalOrVetoCooldownExitedAt: number;
    rageQuitRound: bigint;
    vetoSignallingDuration: number;
  };
};

export type EscrowBalance = {
  stETHLockedShares: bigint;
  unstETHLockedShares: bigint;
  unstETHIdsCount: bigint;
  lastAssetsLockTimestamp: bigint;
};

export const VetoSupportedTokens = [
  Token.stETH,
  Token.wstETH,
  Token.unstETH,
] as const;

export type VetoSupportedTokens = (typeof VetoSupportedTokens)[number];
