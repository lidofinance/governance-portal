import { decodeFunctionResult } from 'viem';
import * as abi from 'abi/generated';
import { MotionType } from '../motion-types';

// Map motion types to their corresponding ABIs
const MOTION_TYPE_ABI_MAP = {
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
  [MotionType.LegoLDOTopUp]: abi.topUpAllowedRecipientsAbi,
  [MotionType.LegoDAITopUp]: abi.topUpAllowedRecipientsAbi,
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
  [MotionType.SandboxStablesAdd]: abi.addAllowedRecipientAbi,
  [MotionType.SandboxStablesRemove]: abi.removeAllowedRecipientAbi,
  [MotionType.SandboxStablesTopUp]: abi.topUpWithLimitsStablesAbi,
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
  [MotionType.AllianceOpsStablesTopUp]: abi.topUpWithLimitsStablesAbi,
  [MotionType.EcosystemOpsStablesTopUp]: abi.topUpWithLimitsStablesAbi,
  [MotionType.LabsOpsStablesTopUp]: abi.topUpWithLimitsStablesAbi,
  [MotionType.EcosystemOpsStethTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.LabsOpsStethTopUp]: abi.topUpWithLimitsAbi,
  [MotionType.MEVBoostRelaysAdd]: abi.addMEVBoostRelaysAbi,
  [MotionType.MEVBoostRelaysEdit]: abi.editMEVBoostRelaysAbi,
  [MotionType.MEVBoostRelaysRemove]: abi.removeMEVBoostRelaysAbi,
  [MotionType.CSMSetVettedGateTree]: abi.csmSetVettedGateTreeAbi,
  [MotionType.CuratedExitRequestHashesSubmit]: abi.submitExitRequestHashesAbi,
  [MotionType.SDVTExitRequestHashesSubmit]: abi.submitExitRequestHashesAbi,
} as const;

/**
 * Decodes EVM script call data for a given motion type
 * Uses viem's decodeFunctionResult instead of typechain contracts
 */
export const useDecodeEvmScriptCallData = (
  motionType: MotionType,
  callDataRaw: `0x${string}` | undefined,
) => {
  if (!callDataRaw) return null;

  const factoryAbi = MOTION_TYPE_ABI_MAP[motionType];
  if (!factoryAbi) {
    console.warn(`No ABI found for motion type: ${motionType}`);
    return null;
  }

  try {
    const decoded = decodeFunctionResult({
      abi: factoryAbi,
      functionName: 'decodeEVMScriptCallData',
      data: callDataRaw,
    });

    return decoded;
  } catch (error) {
    console.error(`Failed to decode call data for ${motionType}:`, error);
    return null;
  }
};
