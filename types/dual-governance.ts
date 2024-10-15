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
}
