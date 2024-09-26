export enum GovernanceState {
  Normal,
  VetoSignalling,
  VetoSignallingDeactivation,
  VetoCooldown,
  RageQuit,
}

// Todo: rename yellow whet the sense is defined
export enum GovernanceStateIndicator {
  Normal = 'normal',
  Blocked = 'blocked',
  Yellow = 'yellow',
}
