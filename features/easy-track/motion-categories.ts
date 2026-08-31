import { MotionType } from './motion-types';
import { EvmUnrecognized } from './evm-addresses';
import { BadgeVariant } from 'shared/components/badge';

export type MotionCategory =
  | 'Staking'
  | 'Treasury'
  | 'stVaults'
  | 'MEV Boost'
  | 'Deprecated'
  | 'Unknown';

export type MotionSubcategory =
  | 'Curated'
  | 'SimpleDVT'
  | 'CSM0x01'
  | 'CSM0x02'
  | 'TRP'
  | 'Lego'
  | 'Rewards Share'
  | 'Gas Supply'
  | 'Stonks'
  | 'LOL'
  | 'Dev'
  | 'Ops';

export type MotionTags = readonly [MotionCategory, ...MotionSubcategory[]];

type MotionTagsMap = Record<MotionType | EvmUnrecognized, MotionTags>;

export const MOTION_TAGS: MotionTagsMap = {
  [MotionType.NodeOperatorIncreaseLimit]: ['Staking', 'Curated'],
  [MotionType.CuratedExitRequestHashesSubmit]: ['Staking', 'Curated'],
  [MotionType.CuratedSettleGeneralDelayedPenalty]: ['Staking', 'Curated'],
  [MotionType.CuratedReportWithdrawalsForSlashedValidators]: [
    'Staking',
    'Curated',
  ],
  [MotionType.CuratedSetMerkleGateTree]: ['Staking', 'Curated'],

  [MotionType.SDVTNodeOperatorsAdd]: ['Staking', 'SimpleDVT'],
  [MotionType.SDVTNodeOperatorsActivate]: ['Staking', 'SimpleDVT'],
  [MotionType.SDVTNodeOperatorsDeactivate]: ['Staking', 'SimpleDVT'],
  [MotionType.SDVTVettedValidatorsLimitsSet]: ['Staking', 'SimpleDVT'],
  [MotionType.SDVTTargetValidatorLimitsUpdateV2]: ['Staking', 'SimpleDVT'],
  [MotionType.SDVTNodeOperatorRewardAddressesSet]: ['Staking', 'SimpleDVT'],
  [MotionType.SDVTNodeOperatorNamesSet]: ['Staking', 'SimpleDVT'],
  [MotionType.SDVTNodeOperatorManagerChange]: ['Staking', 'SimpleDVT'],
  [MotionType.SDVTExitRequestHashesSubmit]: ['Staking', 'SimpleDVT'],

  [MotionType.CSMSettleGeneralDelayedPenalty]: ['Staking', 'CSM0x01'],
  [MotionType.CSMReportWithdrawalsForSlashedValidators]: ['Staking', 'CSM0x01'],
  [MotionType.CSMSetMerkleGateTree]: ['Staking', 'CSM0x01'],
  [MotionType.UpdateStakingModuleShareLimits]: ['Staking', 'CSM0x01'],

  [MotionType.CSM2SettleGeneralDelayedPenalty]: ['Staking', 'CSM0x02'],
  [MotionType.CSM2ReportWithdrawalsForSlashedValidators]: [
    'Staking',
    'CSM0x02',
  ],
  [MotionType.CSM2UpdateStakingModuleShareLimits]: ['Staking', 'CSM0x02'],

  [MotionType.SandboxNodeOperatorIncreaseLimit]: ['Staking', 'Dev'],
  [MotionType.CreateOrUpdateOperatorGroup]: ['Staking'],
  [MotionType.AllowConsolidationPair]: ['Staking'],

  [MotionType.AllowedRecipientTopUpTrpLdo]: ['Treasury', 'TRP'],
  [MotionType.LegoLDOTopUp]: ['Treasury', 'Lego'],
  [MotionType.LegoStablesTopUp]: ['Treasury', 'Lego'],
  [MotionType.StethRewardProgramAdd]: ['Treasury', 'LOL'],
  [MotionType.StethRewardProgramRemove]: ['Treasury', 'LOL'],
  [MotionType.StethRewardProgramTopUp]: ['Treasury', 'LOL'],
  [MotionType.StethGasSupplyAdd]: ['Treasury', 'Gas Supply'],
  [MotionType.StethGasSupplyRemove]: ['Treasury', 'Gas Supply'],
  [MotionType.StethGasSupplyTopUp]: ['Treasury', 'Gas Supply'],
  [MotionType.RewardsShareProgramAdd]: ['Treasury', 'Rewards Share'],
  [MotionType.RewardsShareProgramRemove]: ['Treasury', 'Rewards Share'],
  [MotionType.RewardsShareProgramTopUp]: ['Treasury', 'Rewards Share'],
  [MotionType.StonksStethTopUp]: ['Treasury', 'Stonks'],
  [MotionType.StonksStablesTopUp]: ['Treasury', 'Stonks'],
  [MotionType.LOLStablecoinsTopUp]: ['Treasury', 'LOL'],
  [MotionType.LOLStablecoinsAdd]: ['Treasury', 'LOL'],
  [MotionType.LOLStablecoinsRemove]: ['Treasury', 'LOL'],
  [MotionType.AllianceOpsStablesTopUp]: ['Treasury', 'Ops'],
  [MotionType.EcosystemOpsStablesTopUp]: ['Treasury', 'Ops'],
  [MotionType.EcosystemOpsStethTopUp]: ['Treasury', 'Ops'],
  [MotionType.LabsOpsStablesTopUp]: ['Treasury', 'Ops'],
  [MotionType.LabsOpsStethTopUp]: ['Treasury', 'Ops'],
  [MotionType.SandboxStethAdd]: ['Treasury', 'Dev'],
  [MotionType.SandboxStethRemove]: ['Treasury', 'Dev'],
  [MotionType.SandboxStethTopUp]: ['Treasury', 'Dev'],
  [MotionType.SandboxStablesAdd]: ['Treasury', 'Dev'],
  [MotionType.SandboxStablesRemove]: ['Treasury', 'Dev'],
  [MotionType.SandboxStablesTopUp]: ['Treasury', 'Dev'],

  [MotionType.MEVBoostRelaysAdd]: ['MEV Boost'],
  [MotionType.MEVBoostRelaysEdit]: ['MEV Boost'],
  [MotionType.MEVBoostRelaysRemove]: ['MEV Boost'],

  [MotionType.RegisterGroupsInOperatorGrid]: ['stVaults'],
  [MotionType.RegisterTiersInOperatorGrid]: ['stVaults'],
  [MotionType.UpdateGroupsShareLimit]: ['stVaults'],
  [MotionType.AlterTiersInOperatorGrid]: ['stVaults'],
  [MotionType.SetJailStatusInOperatorGrid]: ['stVaults'],
  [MotionType.UpdateVaultsFeesInOperatorGrid]: ['stVaults'],
  [MotionType.ForceValidatorExitsInVaultHub]: ['stVaults'],
  [MotionType.SocializeBadDebtInVaultHub]: ['stVaults'],
  [MotionType.SetLiabilitySharesTargetInVaultHub]: ['stVaults'],

  // next motion types are retired
  // we are keeping them here to display history data
  [MotionType.LEGOTopUp]: ['Deprecated'],
  [MotionType.LegoDAITopUp]: ['Deprecated'],
  [MotionType.GasFunderETHTopUp]: ['Deprecated'],
  [MotionType.RewardProgramAdd]: ['Deprecated'],
  [MotionType.RewardProgramRemove]: ['Deprecated'],
  [MotionType.RewardProgramTopUp]: ['Deprecated'],
  [MotionType.AllowedRecipientAdd]: ['Deprecated'],
  [MotionType.AllowedRecipientRemove]: ['Deprecated'],
  [MotionType.AllowedRecipientTopUp]: ['Deprecated'],
  [MotionType.ReferralPartnerAdd]: ['Deprecated'],
  [MotionType.ReferralPartnerRemove]: ['Deprecated'],
  [MotionType.ReferralPartnerTopUp]: ['Deprecated'],
  [MotionType.AllowedRecipientAddReferralDai]: ['Deprecated'],
  [MotionType.AllowedRecipientRemoveReferralDai]: ['Deprecated'],
  [MotionType.AllowedRecipientTopUpReferralDai]: ['Deprecated'],
  [MotionType.RccDAITopUp]: ['Deprecated'],
  [MotionType.RccStethTopUp]: ['Deprecated'],
  [MotionType.RccStablesTopUp]: ['Deprecated'],
  [MotionType.PmlDAITopUp]: ['Deprecated'],
  [MotionType.PmlStethTopUp]: ['Deprecated'],
  [MotionType.PmlStablesTopUp]: ['Deprecated'],
  [MotionType.AtcDAITopUp]: ['Deprecated'],
  [MotionType.AtcStethTopUp]: ['Deprecated'],
  [MotionType.AtcStablesTopUp]: ['Deprecated'],
  [MotionType.SDVTTargetValidatorLimitsUpdateV1]: ['Staking', 'SimpleDVT'],
  [MotionType.CSMSettleElStealingPenalty]: ['Staking', 'CSM0x01'],
  [MotionType.CSMSetVettedGateTree]: ['Staking', 'CSM0x01'],
  [MotionType.UpdateStakingModuleShareLimitsOld]: ['Staking', 'CSM0x01'],
  [MotionType.RegisterGroupsInOperatorGridPhaseOne]: ['stVaults'],
  [MotionType.UpdateGroupsShareLimitPhaseOne]: ['stVaults'],
  [MotionType.AlterTiersInOperatorGridPhaseOne]: ['stVaults'],
  [MotionType.SetJailStatusInOperatorGridPhaseOne]: ['stVaults'],
  [MotionType.UpdateVaultsFeesInOperatorGridPhaseOne]: ['stVaults'],
  [MotionType.ForceValidatorExitsInVaultHubPhaseOne]: ['stVaults'],
  [MotionType.SocializeBadDebtInVaultHubPhaseOne]: ['stVaults'],
  [MotionType.RegisterGroupsInOperatorGridOld]: ['stVaults'],
  [MotionType.RegisterTiersInOperatorGridOld]: ['stVaults'],
  [MotionType.AlterTiersInOperatorGridOld]: ['stVaults'],

  [EvmUnrecognized]: ['Unknown'],
};

export const MOTION_CATEGORY_VARIANT_MAP: Record<MotionCategory, BadgeVariant> =
  {
    Staking: 'deepBlue',
    Treasury: 'deepGreen',
    stVaults: 'deepYellow',
    'MEV Boost': 'pink',
    Deprecated: 'purple',
    Unknown: 'purple',
  };

export type FilterCategory = Exclude<MotionCategory, 'Deprecated' | 'Unknown'>;

export const FILTER_CATEGORIES: readonly FilterCategory[] = [
  'Staking',
  'Treasury',
  'MEV Boost',
  'stVaults',
];
