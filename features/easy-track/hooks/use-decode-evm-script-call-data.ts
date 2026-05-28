import {
  decodeAbiParameters,
  decodeFunctionResult,
  parseAbiParameters,
} from 'viem';
import * as abi from 'abi/generated';
import { MotionType } from '../motion-types';

// Map motion types to their corresponding ABIs
export const MOTION_TYPE_ABI_MAP = {
  [MotionType.NodeOperatorIncreaseLimit]:
    abi.evmIncreaseNodeOperatorStakingLimitAbi,
  [MotionType.LEGOTopUp]: abi.evmTopUpLegoProgramAbi,
  [MotionType.RewardProgramAdd]: abi.evmAddRewardProgramAbi,
  [MotionType.RewardProgramTopUp]: abi.evmTopUpRewardProgramsAbi,
  [MotionType.RewardProgramRemove]: abi.evmRemoveRewardProgramAbi,
  [MotionType.ReferralPartnerAdd]: abi.evmAddReferralPartnerAbi,
  [MotionType.ReferralPartnerTopUp]: abi.evmTopUpReferralPartnersAbi,
  [MotionType.ReferralPartnerRemove]: abi.evmRemoveReferralPartnerAbi,
  [MotionType.AllowedRecipientAdd]: abi.addAllowedRecipientAbi,
  [MotionType.AllowedRecipientRemove]: abi.removeAllowedRecipientAbi,
  [MotionType.AllowedRecipientTopUp]: abi.topUpAllowedRecipientsAbi,
  [MotionType.AllowedRecipientAddReferralDai]: abi.addAllowedRecipientAbi,
  [MotionType.AllowedRecipientRemoveReferralDai]: abi.removeAllowedRecipientAbi,
  [MotionType.AllowedRecipientTopUpReferralDai]: abi.topUpAllowedRecipientsAbi,
  [MotionType.AllowedRecipientTopUpTrpLdo]: abi.topUpAllowedRecipientsAbi,
  [MotionType.LegoLDOTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.LegoDAITopUp]: abi.topUpWithLimitsAbi,
  [MotionType.RccDAITopUp]: abi.topUpWithLimitsAbi,
  [MotionType.PmlDAITopUp]: abi.topUpWithLimitsAbi,
  [MotionType.AtcDAITopUp]: abi.topUpWithLimitsAbi,
  [MotionType.GasFunderETHTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.StethRewardProgramAdd]: abi.addAllowedRecipientAbi,
  [MotionType.StethRewardProgramRemove]: abi.removeAllowedRecipientAbi,
  [MotionType.StethRewardProgramTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.StethGasSupplyAdd]: abi.addAllowedRecipientAbi,
  [MotionType.StethGasSupplyRemove]: abi.removeAllowedRecipientAbi,
  [MotionType.StethGasSupplyTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.SDVTNodeOperatorsAdd]: abi.addNodeOperatorsAbi,
  [MotionType.SDVTNodeOperatorsActivate]: abi.activateNodeOperatorsAbi,
  [MotionType.SDVTNodeOperatorsDeactivate]: abi.deactivateNodeOperatorsAbi,
  [MotionType.SDVTVettedValidatorsLimitsSet]: abi.setVettedValidatorsLimitsAbi,
  [MotionType.SDVTNodeOperatorRewardAddressesSet]:
    abi.setNodeOperatorRewardAddressesAbi,
  [MotionType.SDVTNodeOperatorNamesSet]: abi.setNodeOperatorNamesAbi,
  [MotionType.SDVTNodeOperatorManagerChange]: abi.changeNodeOperatorManagersAbi,
  [MotionType.SDVTTargetValidatorLimitsUpdateV1]:
    abi.updateTargetValidatorLimitsV1Abi,
  [MotionType.SDVTTargetValidatorLimitsUpdateV2]:
    abi.updateTargetValidatorLimitsV2Abi,
  [MotionType.SandboxNodeOperatorIncreaseLimit]:
    abi.evmIncreaseNodeOperatorStakingLimitAbi,
  [MotionType.RccStablesTopUp]: abi.topUpWithLimitsStablesAbi,
  [MotionType.PmlStablesTopUp]: abi.topUpWithLimitsStablesAbi,
  [MotionType.AtcStablesTopUp]: abi.topUpWithLimitsStablesAbi,
  [MotionType.SandboxStethAdd]: abi.addAllowedRecipientAbi,
  [MotionType.SandboxStablesAdd]: abi.addAllowedRecipientAbi,
  [MotionType.SandboxStablesRemove]: abi.removeAllowedRecipientAbi,
  [MotionType.SandboxStablesTopUp]: abi.topUpWithLimitsStablesAbi,
  [MotionType.SandboxStethTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.SandboxStethRemove]: abi.removeAllowedRecipientAbi,
  [MotionType.RccStethTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.PmlStethTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.AtcStethTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.LegoStablesTopUp]: abi.topUpWithLimitsStablesAbi,
  [MotionType.StonksStablesTopUp]: abi.topUpWithLimitsStablesAbi,
  [MotionType.StonksStethTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.RewardsShareProgramAdd]: abi.addAllowedRecipientAbi,
  [MotionType.RewardsShareProgramRemove]: abi.removeAllowedRecipientAbi,
  [MotionType.RewardsShareProgramTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.CSMSettleElStealingPenalty]: abi.csmSettleElStealingPenaltyAbi,
  [MotionType.CSMSettleGeneralDelayedPenalty]:
    abi.settleGeneralDelayedPenaltyAbi,
  [MotionType.CuratedSettleGeneralDelayedPenalty]:
    abi.settleGeneralDelayedPenaltyAbi,
  [MotionType.AllianceOpsStablesTopUp]: abi.topUpWithLimitsStablesAbi,
  [MotionType.EcosystemOpsStablesTopUp]: abi.topUpWithLimitsStablesAbi,
  [MotionType.LabsOpsStablesTopUp]: abi.topUpWithLimitsStablesAbi,
  [MotionType.EcosystemOpsStethTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.LabsOpsStethTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.MEVBoostRelaysAdd]: abi.addMevBoostRelaysAbi,
  [MotionType.MEVBoostRelaysEdit]: abi.editMevBoostRelaysAbi,
  [MotionType.MEVBoostRelaysRemove]: abi.removeMevBoostRelaysAbi,
  [MotionType.CSMSetVettedGateTree]: abi.csmSetVettedGateTreeAbi,
  [MotionType.CSMSetMerkleGateTree]: abi.setMerkleGateTreeAbi,
  [MotionType.CuratedSetMerkleGateTree]: abi.setMerkleGateTreeAbi,
  [MotionType.CuratedExitRequestHashesSubmit]: abi.submitExitRequestHashesAbi,
  [MotionType.SDVTExitRequestHashesSubmit]: abi.submitExitRequestHashesAbi,
  [MotionType.RegisterGroupsInOperatorGrid]:
    abi.evmRegisterGroupsInOperatorsGridAbi,
  [MotionType.RegisterTiersInOperatorGrid]:
    abi.evmRegisterTiersInOperatorsGridAbi,
  [MotionType.UpdateGroupsShareLimit]: abi.evmUpdateGroupsShareLimitAbi,
  [MotionType.AlterTiersInOperatorGrid]: abi.evmAlterTiersInOperatorGridAbi,
  [MotionType.SetJailStatusInOperatorGrid]:
    abi.evmSetJailStatusInOperatorGridAbi,
  [MotionType.UpdateVaultsFeesInOperatorGrid]:
    abi.evmUpdateVaultsFeesInOperatorGridAbi,
  [MotionType.ForceValidatorExitsInVaultHub]:
    abi.evmForceValidatorExitsInVaultHubAbi,
  [MotionType.SocializeBadDebtInVaultHub]: abi.evmSocializeBadDebtInVaultHubAbi,
  [MotionType.SetLiabilitySharesTargetInVaultHub]:
    abi.evmSetLiabilitySharesTargetInVaultHubAbi,
  [MotionType.RegisterGroupsInOperatorGridPhaseOne]:
    abi.evmRegisterGroupsInOperatorsGridAbi,
  [MotionType.UpdateGroupsShareLimitPhaseOne]: abi.evmUpdateGroupsShareLimitAbi,
  [MotionType.AlterTiersInOperatorGridPhaseOne]:
    abi.evmAlterTiersInOperatorGridAbi,
  [MotionType.SetJailStatusInOperatorGridPhaseOne]:
    abi.evmSetJailStatusInOperatorGridAbi,
  [MotionType.UpdateVaultsFeesInOperatorGridPhaseOne]:
    abi.evmUpdateVaultsFeesInOperatorGridAbi,
  [MotionType.ForceValidatorExitsInVaultHubPhaseOne]:
    abi.evmForceValidatorExitsInVaultHubAbi,
  [MotionType.SocializeBadDebtInVaultHubPhaseOne]:
    abi.evmSocializeBadDebtInVaultHubAbi,
  [MotionType.RegisterGroupsInOperatorGridOld]:
    abi.evmRegisterGroupsInOperatorsGridAbi,
  [MotionType.RegisterTiersInOperatorGridOld]:
    abi.evmRegisterTiersInOperatorsGridAbi,
  [MotionType.AlterTiersInOperatorGridOld]: abi.evmAlterTiersInOperatorGridAbi,
  [MotionType.AllowConsolidationPair]: abi.allowConsolidationPairAbi,
  [MotionType.CreateOrUpdateOperatorGroup]: abi.createOrUpdateOperatorGroupAbi,
} as const;

type DecodeOverride = (data: `0x${string}`) => unknown;

// Override the generic `decodeFunctionResult` path for factories whose
// `decodeEVMScriptCallData` ABI declares a single struct output but whose
// input bytes are encoded as separate top-level args. Wire formats differ by
// a leading offset, so the generic path throws PositionOutOfBoundsError.
const MOTION_TYPE_DECODE_OVERRIDES: Partial<
  Record<MotionType, DecodeOverride>
> = {
  [MotionType.AllowConsolidationPair]: (data) => {
    const [submitter, sourceOperatorId, targetOperatorIds] =
      decodeAbiParameters(
        parseAbiParameters('address, uint256, uint256[]'),
        data,
      );
    return { submitter, sourceOperatorId, targetOperatorIds };
  },
};

/**
 * Decodes EVM script call data for a given motion type
 * Uses viem's decodeFunctionResult instead of typechain contracts
 */
export const decodeEvmScriptCallData = (
  motionType: MotionType,
  callDataRaw: `0x${string}` | undefined,
) => {
  if (!callDataRaw) return null;

  const override = MOTION_TYPE_DECODE_OVERRIDES[motionType];
  if (override) {
    try {
      return override(callDataRaw);
    } catch (error) {
      console.error(`Failed to decode call data for ${motionType}:`, error);
      return null;
    }
  }

  const factoryAbi = MOTION_TYPE_ABI_MAP[motionType];
  if (!factoryAbi) {
    console.warn(`No ABI found for motion type: ${motionType}`);
    return null;
  }

  try {
    return decodeFunctionResult({
      abi: factoryAbi,
      functionName: 'decodeEVMScriptCallData',
      data: callDataRaw,
    });
  } catch (error) {
    console.error(`Failed to decode call data for ${motionType}:`, error);
    return null;
  }
};
