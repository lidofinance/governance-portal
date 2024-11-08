export enum GovernanceState {
  Unset,
  Normal,
  VetoSignalling,
  VetoSignallingDeactivation,
  VetoCooldown,
  RageQuit,
}

export const VisibleGovernanceState = {
  Normal: 'Normal',
  NormalWarning: 'NormalWarning',
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
};
