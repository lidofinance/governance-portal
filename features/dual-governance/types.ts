export enum GovernanceState {
  Normal,
  VetoSignalling,
  VetoSignallingDeactivation,
  VetoCooldown,
  RageQuit,
}

export enum GovernanceStateIndicator {
  Normal = 'normal',
  Blocked = 'blocked',
  Attention = 'attention',
}

export enum TransactionState {
  SUCCESS,
  ERROR,
  PENDING,
}
