import { MotionTypeForms } from '../../motion-types';
import type { FactoryFormName } from '../../factories-metadata';

import * as formAllowedRecipientAdd from './start-new-allowed-recipient-add';
import * as formAllowedRecipientTopUp from './start-new-allowed-recipient-top-up';

import * as StartNewTopUpWithLimitsAndCustomToken from './start-new-top-up-with-limits-and-custom-token';
import * as formAllowedRecipientRemove from './start-new-allowed-recipient-remove';
import * as StartNewTopUpWithLimits from './start-new-top-up-with-limits';
import * as StartNewNodeOperatorLimitIncrease from './start-new-node-operator-limit-increase';
import * as StartNewExitRequestHashesSubmit from './start-new-exit-request-hashes-submit';
import * as StartNewMEVBoostRelaysAdd from './start-new-mev-boost-relays-add';
import * as StartNewMEVBoostRelaysEdit from './start-new-mev-boost-relays-edit';
import * as StartNewMEVBoostRelaysRemove from './start-new-mev-boost-relays-remove';
import * as StartNewSetMerkleGateTree from './start-new-set-merkle-gate-tree';
import * as StartNewSettleGeneralDelayedPenalty from './start-new-settle-general-delayed-penalty';
import * as StartNewReportWithdrawalsForSlashedValidators from './start-new-report-withdrawals-for-slashed-validators';

import * as StartNewVaultForceValidatorExitsInVaultHub from './vaults/start-new-vault-force-validator-exits-in-vault-hub';
import * as StartNewVaultsAlterTiersInOperatorGrid from './vaults/start-new-vaults-alter-tiers-in-operator-grid';
import * as StartNewVaultsRegisterGroupsInOperatorGrid from './vaults/start-new-vaults-register-groups-in-operator-grid';
import * as StartNewVaultsRegisterTiersInOperatorGrid from './vaults/start-new-vaults-register-tiers-in-operator-grid';
import * as StartNewVaultsSetJailStatusInOperatorGrid from './vaults/start-new-vaults-set-jail-status-in-operator-grid';
import * as StartNewVaultsSetLiabilitySharesTargetInVaultHub from './vaults/start-new-vaults-set-liability-shares-target-in-vault-hub';
import * as StartNewVaultsSocializeBadDebtInVaultHub from './vaults/start-new-vaults-socialize-bad-debt-in-vault-hub';
import * as StartNewVaultsUpdateGroupsShareLimit from './vaults/start-new-vaults-update-groups-share-limit';
import * as StartNewVaultsUpdateVaultsFeesInOperatorGrid from './vaults/start-new-vaults-update-vaults-fees-in-operator-grid';

// SDVT Parts
import * as StartSDVTNodeOperatorsAdd from './start-new-sdvt-node-operators-add';
import * as StartNewSDVTNodeOperatorsActivate from './start-new-sdvt-node-operators-activate';
import * as StartNewSDVTNodeOperatorsDeactivate from './start-new-sdvt-node-operators-deactivate';
import * as StartNewSDVTVettedValidatorsLimitsSet from './start-new-sdvt-vetted-validators-limits-set';
import * as StartNewSDVTTargetValidatorLimitsUpdateV2 from './start-new-sdvt-target-validator-limits-update-v2';
import * as StartNewSDVTNodeOperatorRewardAddressesSet from './start-new-sdvt-node-operator-reward-addresses-set';
import * as StartNewSDVTNodeOperatorNamesSet from './start-new-sdvt-node-operator-names-set';
import * as StartNewSDVTNodeOperatorManagersChange from './start-new-sdvt-node-operator-managers-change';

import * as StartNewAllowConsolidationPair from './start-new-allow-consolidation-pair';
import * as StartNewCreateOrUpdateOperatorGroup from './start-new-create-or-update-operator-group';
import * as StartNewUpdateStakingModuleShareLimits from './start-new-update-staking-module-share-limits';

export const formParts = {
  [MotionTypeForms.AllowedRecipientTopUpTrpLdo]:
    formAllowedRecipientTopUp.formParts({
      registryType: MotionTypeForms.AllowedRecipientTopUpTrpLdo,
    }),
  [MotionTypeForms.StethRewardProgramTopUp]:
    formAllowedRecipientTopUp.formParts({
      registryType: MotionTypeForms.StethRewardProgramTopUp,
    }),
  [MotionTypeForms.StethGasSupplyTopUp]: formAllowedRecipientTopUp.formParts({
    registryType: MotionTypeForms.StethGasSupplyTopUp,
  }),
  [MotionTypeForms.RewardsShareProgramTopUp]:
    formAllowedRecipientTopUp.formParts({
      registryType: MotionTypeForms.RewardsShareProgramTopUp,
    }),
  [MotionTypeForms.SandboxStethTopUp]: formAllowedRecipientTopUp.formParts({
    registryType: MotionTypeForms.SandboxStethTopUp,
  }),
  [MotionTypeForms.StonksStethTopUp]: formAllowedRecipientTopUp.formParts({
    registryType: MotionTypeForms.StonksStethTopUp,
  }),
  [MotionTypeForms.SandboxStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.SandboxStablesTopUp,
    }),
  [MotionTypeForms.LegoStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.LegoStablesTopUp,
    }),
  [MotionTypeForms.StonksStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.StonksStablesTopUp,
    }),
  [MotionTypeForms.AllianceOpsStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.AllianceOpsStablesTopUp,
    }),
  [MotionTypeForms.EcosystemOpsStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.EcosystemOpsStablesTopUp,
    }),
  [MotionTypeForms.LabsOpsStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.LabsOpsStablesTopUp,
    }),
  [MotionTypeForms.LOLStablecoinsTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.LOLStablecoinsTopUp,
    }),
  [MotionTypeForms.StethRewardProgramAdd]: formAllowedRecipientAdd.formParts({
    registryType: MotionTypeForms.StethRewardProgramAdd,
  }),
  [MotionTypeForms.StethGasSupplyAdd]: formAllowedRecipientAdd.formParts({
    registryType: MotionTypeForms.StethGasSupplyAdd,
  }),
  [MotionTypeForms.RewardsShareProgramAdd]: formAllowedRecipientAdd.formParts({
    registryType: MotionTypeForms.RewardsShareProgramAdd,
  }),
  [MotionTypeForms.SandboxStethAdd]: formAllowedRecipientAdd.formParts({
    registryType: MotionTypeForms.SandboxStethAdd,
  }),
  [MotionTypeForms.LOLStablecoinsAdd]: formAllowedRecipientAdd.formParts({
    registryType: MotionTypeForms.LOLStablecoinsAdd,
  }),
  [MotionTypeForms.StethRewardProgramRemove]:
    formAllowedRecipientRemove.formParts({
      registryType: MotionTypeForms.StethRewardProgramRemove,
    }),
  [MotionTypeForms.StethGasSupplyRemove]: formAllowedRecipientRemove.formParts({
    registryType: MotionTypeForms.StethGasSupplyRemove,
  }),
  [MotionTypeForms.RewardsShareProgramRemove]:
    formAllowedRecipientRemove.formParts({
      registryType: MotionTypeForms.RewardsShareProgramRemove,
    }),
  [MotionTypeForms.SandboxStethRemove]: formAllowedRecipientRemove.formParts({
    registryType: MotionTypeForms.SandboxStethRemove,
  }),
  [MotionTypeForms.LOLStablecoinsRemove]: formAllowedRecipientRemove.formParts({
    registryType: MotionTypeForms.LOLStablecoinsRemove,
  }),
  [MotionTypeForms.LegoLDOTopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.LegoLDOTopUp,
  }),
  [MotionTypeForms.NodeOperatorIncreaseLimit]:
    StartNewNodeOperatorLimitIncrease.formParts({
      motionType: MotionTypeForms.NodeOperatorIncreaseLimit,
    }),
  [MotionTypeForms.SandboxNodeOperatorIncreaseLimit]:
    StartNewNodeOperatorLimitIncrease.formParts({
      motionType: MotionTypeForms.SandboxNodeOperatorIncreaseLimit,
    }),
  // SDVT Parts
  [MotionTypeForms.SDVTNodeOperatorsAdd]: StartSDVTNodeOperatorsAdd.formParts,
  [MotionTypeForms.SDVTNodeOperatorsActivate]:
    StartNewSDVTNodeOperatorsActivate.formParts,
  [MotionTypeForms.SDVTNodeOperatorsDeactivate]:
    StartNewSDVTNodeOperatorsDeactivate.formParts,
  [MotionTypeForms.SDVTVettedValidatorsLimitsSet]:
    StartNewSDVTVettedValidatorsLimitsSet.formParts,
  [MotionTypeForms.SDVTTargetValidatorLimitsUpdateV2]:
    StartNewSDVTTargetValidatorLimitsUpdateV2.formParts,
  [MotionTypeForms.SDVTNodeOperatorRewardAddressesSet]:
    StartNewSDVTNodeOperatorRewardAddressesSet.formParts,
  [MotionTypeForms.SDVTNodeOperatorNamesSet]:
    StartNewSDVTNodeOperatorNamesSet.formParts,
  [MotionTypeForms.SDVTNodeOperatorManagerChange]:
    StartNewSDVTNodeOperatorManagersChange.formParts,
  [MotionTypeForms.MEVBoostRelaysAdd]: StartNewMEVBoostRelaysAdd.formParts,
  [MotionTypeForms.MEVBoostRelaysEdit]: StartNewMEVBoostRelaysEdit.formParts,
  [MotionTypeForms.MEVBoostRelaysRemove]:
    StartNewMEVBoostRelaysRemove.formParts,
  [MotionTypeForms.CSMSetMerkleGateTree]: StartNewSetMerkleGateTree.formParts({
    motionType: MotionTypeForms.CSMSetMerkleGateTree,
  }),
  [MotionTypeForms.CuratedSetMerkleGateTree]:
    StartNewSetMerkleGateTree.formParts({
      motionType: MotionTypeForms.CuratedSetMerkleGateTree,
    }),
  [MotionTypeForms.CSMSettleGeneralDelayedPenalty]:
    StartNewSettleGeneralDelayedPenalty.formParts({
      motionType: MotionTypeForms.CSMSettleGeneralDelayedPenalty,
    }),
  [MotionTypeForms.CuratedSettleGeneralDelayedPenalty]:
    StartNewSettleGeneralDelayedPenalty.formParts({
      motionType: MotionTypeForms.CuratedSettleGeneralDelayedPenalty,
    }),
  [MotionTypeForms.CSMReportWithdrawalsForSlashedValidators]:
    StartNewReportWithdrawalsForSlashedValidators.formParts({
      motionType: MotionTypeForms.CSMReportWithdrawalsForSlashedValidators,
    }),
  [MotionTypeForms.CuratedReportWithdrawalsForSlashedValidators]:
    StartNewReportWithdrawalsForSlashedValidators.formParts({
      motionType: MotionTypeForms.CuratedReportWithdrawalsForSlashedValidators,
    }),
  [MotionTypeForms.CSM2SettleGeneralDelayedPenalty]:
    StartNewSettleGeneralDelayedPenalty.formParts({
      motionType: MotionTypeForms.CSM2SettleGeneralDelayedPenalty,
    }),
  [MotionTypeForms.CSM2ReportWithdrawalsForSlashedValidators]:
    StartNewReportWithdrawalsForSlashedValidators.formParts({
      motionType: MotionTypeForms.CSM2ReportWithdrawalsForSlashedValidators,
    }),
  [MotionTypeForms.CuratedExitRequestHashesSubmit]:
    StartNewExitRequestHashesSubmit.formParts('curated'),
  [MotionTypeForms.SDVTExitRequestHashesSubmit]:
    StartNewExitRequestHashesSubmit.formParts('sdvt'),

  // Vault motions
  [MotionTypeForms.ForceValidatorExitsInVaultHub]:
    StartNewVaultForceValidatorExitsInVaultHub.formParts,
  [MotionTypeForms.AlterTiersInOperatorGrid]:
    StartNewVaultsAlterTiersInOperatorGrid.formParts,
  [MotionTypeForms.RegisterGroupsInOperatorGrid]:
    StartNewVaultsRegisterGroupsInOperatorGrid.formParts,
  [MotionTypeForms.RegisterTiersInOperatorGrid]:
    StartNewVaultsRegisterTiersInOperatorGrid.formParts,
  [MotionTypeForms.SetJailStatusInOperatorGrid]:
    StartNewVaultsSetJailStatusInOperatorGrid.formParts,
  [MotionTypeForms.SetLiabilitySharesTargetInVaultHub]:
    StartNewVaultsSetLiabilitySharesTargetInVaultHub.formParts,
  [MotionTypeForms.SocializeBadDebtInVaultHub]:
    StartNewVaultsSocializeBadDebtInVaultHub.formParts,
  [MotionTypeForms.UpdateGroupsShareLimit]:
    StartNewVaultsUpdateGroupsShareLimit.formParts,
  [MotionTypeForms.UpdateVaultsFeesInOperatorGrid]:
    StartNewVaultsUpdateVaultsFeesInOperatorGrid.formParts,

  [MotionTypeForms.AllowConsolidationPair]:
    StartNewAllowConsolidationPair.formParts,
  [MotionTypeForms.CreateOrUpdateOperatorGroup]:
    StartNewCreateOrUpdateOperatorGroup.formParts,
  [MotionTypeForms.UpdateStakingModuleShareLimits]:
    StartNewUpdateStakingModuleShareLimits.formParts({
      motionType: MotionTypeForms.UpdateStakingModuleShareLimits,
    }),
  [MotionTypeForms.CSM2UpdateStakingModuleShareLimits]:
    StartNewUpdateStakingModuleShareLimits.formParts({
      motionType: MotionTypeForms.CSM2UpdateStakingModuleShareLimits,
    }),
} as const;

// Every startable factory in FACTORIES must have a form part here,
// otherwise it silently never appears in the motion type select.
const _startableFactoriesHaveFormParts: Record<FactoryFormName, unknown> =
  formParts;
void _startableFactoriesHaveFormParts;

export type FormData = {
  motionType: MotionTypeForms | null;
} & {
  [key in keyof typeof formParts]: ReturnType<
    (typeof formParts)[key]['getDefaultFormData']
  >;
};

export const getDefaultFormPartsData = () => {
  return Object.entries(formParts).reduce(
    (res, [type, part]) => ({
      ...res,
      [type]: part.getDefaultFormData(),
    }),
    {} as { [key in keyof typeof formParts]: FormData[key] },
  );
};
