// Only motions currently supported to start
export const MotionTypeForms = {
  // Curated Module
  NodeOperatorIncreaseLimit: 'NodeOperatorIncreaseLimit',
  CuratedExitRequestHashesSubmit: 'CuratedExitRequestHashesSubmit',
  // ET
  AllowedRecipientTopUpTrpLdo: 'AllowedRecipientTopUpTrpLdo',
  LegoLDOTopUp: 'LegoLDOTopUp',
  StethRewardProgramAdd: 'StethRewardProgramAdd',
  StethRewardProgramRemove: 'StethRewardProgramRemove',
  StethRewardProgramTopUp: 'StethRewardProgramTopUp',
  StethGasSupplyAdd: 'StethGasSupplyAdd',
  StethGasSupplyRemove: 'StethGasSupplyRemove',
  StethGasSupplyTopUp: 'StethGasSupplyTopUp',
  RewardsShareProgramAdd: 'RewardsShareProgramAdd',
  RewardsShareProgramRemove: 'RewardsShareProgramRemove',
  RewardsShareProgramTopUp: 'RewardsShareProgramTopUp',
  // ET DVT
  SDVTNodeOperatorsAdd: 'SDVTNodeOperatorsAdd',
  SDVTNodeOperatorsActivate: 'SDVTNodeOperatorsActivate',
  SDVTNodeOperatorsDeactivate: 'SDVTNodeOperatorsDeactivate',
  SDVTVettedValidatorsLimitsSet: 'SDVTVettedValidatorsLimitsSet',
  SDVTTargetValidatorLimitsUpdateV2: 'SDVTTargetValidatorLimitsUpdateV2',
  SDVTNodeOperatorRewardAddressesSet: 'SDVTNodeOperatorRewardAddressesSet',
  SDVTNodeOperatorNamesSet: 'SDVTNodeOperatorNamesSet',
  SDVTNodeOperatorManagerChange: 'SDVTNodeOperatorManagerChange',
  SDVTExitRequestHashesSubmit: 'SDVTExitRequestHashesSubmit',

  SandboxNodeOperatorIncreaseLimit: 'SandboxNodeOperatorIncreaseLimit',

  SandboxStethTopUp: 'SandboxStethTopUp',
  SandboxStethAdd: 'SandboxStethAdd',
  SandboxStablesTopUp: 'SandboxStablesTopUp',
  SandboxStablesAdd: 'SandboxStablesAdd',
  SandboxStablesRemove: 'SandboxStablesRemove',
  SandboxStethRemove: 'SandboxStethRemove',
  LegoStablesTopUp: 'LegoStablesTopUp',
  StonksStethTopUp: 'StonksStethTopUp',
  StonksStablesTopUp: 'StonksStablesTopUp',
  AllianceOpsStablesTopUp: 'AllianceOpsStablesTopUp',
  EcosystemOpsStablesTopUp: 'EcosystemOpsStablesTopUp',
  EcosystemOpsStethTopUp: 'EcosystemOpsStethTopUp',
  LabsOpsStablesTopUp: 'LabsOpsStablesTopUp',
  LabsOpsStethTopUp: 'LabsOpsStethTopUp',

  CSMSettleGeneralDelayedPenalty: 'CSMSettleGeneralDelayedPenalty',
  CuratedSettleGeneralDelayedPenalty: 'CuratedSettleGeneralDelayedPenalty',
  CSMSetVettedGateTree: 'CSMSetVettedGateTree',
  CSMSetMerkleGateTree: 'CSMSetMerkleGateTree',
  CuratedSetMerkleGateTree: 'CuratedSetMerkleGateTree',

  MEVBoostRelaysAdd: 'MEVBoostRelaysAdd',
  MEVBoostRelaysEdit: 'MEVBoostRelaysEdit',
  MEVBoostRelaysRemove: 'MEVBoostRelaysRemove',

  // Lido Vaults
  RegisterGroupsInOperatorGrid: 'RegisterGroupsInOperatorGrid',
  RegisterTiersInOperatorGrid: 'RegisterTiersInOperatorGrid',
  UpdateGroupsShareLimit: 'UpdateGroupsShareLimit',
  AlterTiersInOperatorGrid: 'AlterTiersInOperatorGrid',
  SetJailStatusInOperatorGrid: 'SetJailStatusInOperatorGrid',
  UpdateVaultsFeesInOperatorGrid: 'UpdateVaultsFeesInOperatorGrid',
  ForceValidatorExitsInVaultHub: 'ForceValidatorExitsInVaultHub',
  SocializeBadDebtInVaultHub: 'SocializeBadDebtInVaultHub',
  SetLiabilitySharesTargetInVaultHub: 'SetLiabilitySharesTargetInVaultHub',

  AllowConsolidationPair: 'AllowConsolidationPair',
  CreateOrUpdateOperatorGroup: 'CreateOrUpdateOperatorGroup',
  UpdateStakingModuleShareLimits: 'UpdateStakingModuleShareLimits',
} as const;
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionTypeForms =
  (typeof MotionTypeForms)[keyof typeof MotionTypeForms];

// next motion types are retired
// we are keeping them here to display history data
export const MotionTypeDisplayOnly = {
  LEGOTopUp: 'LEGOTopUp',
  GasFunderETHTopUp: 'GasFunderETHTopUp',
  RewardProgramAdd: 'RewardProgramAdd',
  RewardProgramRemove: 'RewardProgramRemove',
  RewardProgramTopUp: 'RewardProgramTopUp',
  ReferralPartnerAdd: 'ReferralPartnerAdd',
  ReferralPartnerRemove: 'ReferralPartnerRemove',
  ReferralPartnerTopUp: 'ReferralPartnerTopUp',
  AllowedRecipientAdd: 'AllowedRecipientAdd',
  AllowedRecipientRemove: 'AllowedRecipientRemove',
  AllowedRecipientTopUp: 'AllowedRecipientTopUp',
  AllowedRecipientAddReferralDai: 'AllowedRecipientAddReferralDai',
  AllowedRecipientRemoveReferralDai: 'AllowedRecipientRemoveReferralDai',
  AllowedRecipientTopUpReferralDai: 'AllowedRecipientTopUpReferralDai',
  RccDAITopUp: 'RccDAITopUp',
  PmlDAITopUp: 'PmlDAITopUp',
  AtcDAITopUp: 'AtcDAITopUp',
  LegoDAITopUp: 'LegoDAITopUp',
  SDVTTargetValidatorLimitsUpdateV1: 'SDVTTargetValidatorLimitsUpdateV1',
  RccStethTopUp: 'RccStethTopUp',
  PmlStethTopUp: 'PmlStethTopUp',
  AtcStethTopUp: 'AtcStethTopUp',
  RccStablesTopUp: 'RccStablesTopUp',
  PmlStablesTopUp: 'PmlStablesTopUp',
  AtcStablesTopUp: 'AtcStablesTopUp',

  RegisterGroupsInOperatorGridPhaseOne: 'RegisterGroupsInOperatorGridPhaseOne',
  UpdateGroupsShareLimitPhaseOne: 'UpdateGroupsShareLimitPhaseOne',
  AlterTiersInOperatorGridPhaseOne: 'AlterTiersInOperatorGridPhaseOne',
  SetJailStatusInOperatorGridPhaseOne: 'SetJailStatusInOperatorGridPhaseOne',
  UpdateVaultsFeesInOperatorGridPhaseOne:
    'UpdateVaultsFeesInOperatorGridPhaseOne',
  ForceValidatorExitsInVaultHubPhaseOne:
    'ForceValidatorExitsInVaultHubPhaseOne',
  SocializeBadDebtInVaultHubPhaseOne: 'SocializeBadDebtInVaultHubPhaseOne',
  RegisterGroupsInOperatorGridOld: 'RegisterGroupsInOperatorGridOld',
  RegisterTiersInOperatorGridOld: 'RegisterTiersInOperatorGridOld',
  AlterTiersInOperatorGridOld: 'AlterTiersInOperatorGridOld',

  CSMSettleElStealingPenalty: 'CSMSettleElStealingPenalty',
} as const;
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionTypeDisplayOnly =
  (typeof MotionTypeDisplayOnly)[keyof typeof MotionTypeDisplayOnly];

export const MotionType = {
  ...MotionTypeForms,
  ...MotionTypeDisplayOnly,
} as const;
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionType = (typeof MotionType)[keyof typeof MotionType];
