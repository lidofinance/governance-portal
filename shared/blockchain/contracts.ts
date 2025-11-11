import * as abi from 'abi/generated';
import * as addr from 'shared/blockchain/contract-addresses';
import { ContractObject } from './types';
import { EvmAddressesByType } from './evm-addresses';
import { MotionType } from '../../features/easy-track/motion-types';

export const StETH: ContractObject<typeof abi.stethAbi> = {
  name: 'stETH',
  abi: abi.stethAbi,
  chainAddressMap: addr.StETH,
};

export const WstETH: ContractObject<typeof abi.wstETHAbi> = {
  name: 'wstETH',
  abi: abi.wstETHAbi,
  chainAddressMap: addr.WstETH,
};

export const WithdrawalQueue: ContractObject<
  typeof abi.withdrawalQueueERC721Abi
> = {
  name: 'WithdrawalQueue',
  abi: abi.withdrawalQueueERC721Abi,
  chainAddressMap: addr.WithdrawalQueue,
};

// export const WithdrawalQueueMock: Object<
//   typeof abi.withdrawalQueueMockAbi
// > = {
//   name: 'WithdrawalQueueMock',
//   abi: abi.withdrawalQueueMockAbi,
//   chainAddressMap: addr.WithdrawalQueue,
// };

export const Voting: ContractObject<typeof abi.votingAbi> = {
  name: 'AragonVoting',
  abi: abi.votingAbi,
  chainAddressMap: addr.Voting,
};

export const DualGovernance: ContractObject<typeof abi.dualGovernanceAbi> = {
  name: 'DualGovernance',
  abi: abi.dualGovernanceAbi,
  chainAddressMap: addr.DualGovernance,
};

export const EmergencyProtectedTimelock: ContractObject<
  typeof abi.emergencyProtectedTimelockAbi
> = {
  name: 'EmergencyProtectedTimelock',
  abi: abi.emergencyProtectedTimelockAbi,
  chainAddressMap: addr.EmergencyProtectedTimelock,
};

export const EmergencyGovernance: ContractObject<
  typeof abi.emergencyGovernanceAbi
> = {
  name: 'EmergencyGovernance',
  abi: abi.emergencyGovernanceAbi,
  chainAddressMap: addr.EmergencyGovernance,
};

export const DaoToken: ContractObject<typeof abi.lidoDAOAbi> = {
  name: 'DaoToken',
  abi: abi.lidoDAOAbi,
  chainAddressMap: addr.DaoToken,
};

export const Snapshot: ContractObject<typeof abi.snapshotAbi> = {
  name: 'Snapshot',
  abi: abi.snapshotAbi,
  chainAddressMap: addr.Snapshot,
};

export const EasyTrack: ContractObject<typeof abi.easyTrackAbi> = {
  name: 'Snapshot',
  abi: abi.easyTrackAbi,
  chainAddressMap: addr.EasyTrack,
};

export const NodeOperatorsRegistry: ContractObject<
  typeof abi.nodeOperatorsRegistryAbi
> = {
  name: 'NodeOperatorsRegistry',
  abi: abi.nodeOperatorsRegistryAbi,
  chainAddressMap: addr.NodeOperatorsRegistry,
};

export const AragonAcl: ContractObject<typeof abi.aragonACLAbi> = {
  name: 'AragonAcl',
  abi: abi.aragonACLAbi,
  chainAddressMap: addr.AragonACL,
};

export const EVMScriptExecutor: ContractObject<
  typeof abi.evmScriptExecutorAbi
> = {
  name: 'EVMScriptExecutor',
  abi: abi.evmScriptExecutorAbi,
  chainAddressMap: addr.EVMScriptExecutor,
};

export const AragonFinance: ContractObject<typeof abi.aragonFinanceAbi> = {
  name: 'AragonFinance',
  abi: abi.aragonFinanceAbi,
  chainAddressMap: addr.AragonFinance,
};

export const RewardProgramRegistry: ContractObject<
  typeof abi.rewardProgramRegistryAbi
> = {
  name: 'RewardProgramRegistry',
  abi: abi.rewardProgramRegistryAbi,
  chainAddressMap: addr.RewardProgramRegistry,
};

export const AllowedRecipientRegistry: ContractObject<
  typeof abi.allowedRecipientsRegistryAbi
> = {
  name: 'AllowedRecipientRegistry',
  abi: abi.allowedRecipientsRegistryAbi,
  chainAddressMap: addr.AllowedRecipientRegistry,
};

export const EvmAllowedRecipientAdd: ContractObject<
  typeof abi.addAllowedRecipientAbi
> = {
  name: 'EvmAllowedRecipientAdd',
  abi: abi.addAllowedRecipientAbi,
  chainAddressMap: EvmAddressesByType[MotionType.AllowedRecipientAdd],
};

export const EvmAllowedRecipientRemove: ContractObject<
  typeof abi.removeAllowedRecipientAbi
> = {
  name: 'EvmAllowedRecipientRemove',
  abi: abi.removeAllowedRecipientAbi,
  chainAddressMap: EvmAddressesByType[MotionType.AllowedRecipientRemove],
};

export const EvmAllowedRecipientTopUp: ContractObject<
  typeof abi.topUpAllowedRecipientsAbi
> = {
  name: 'EvmAllowedRecipientTopUp',
  abi: abi.topUpAllowedRecipientsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.AllowedRecipientTopUp],
};

// DAI Referral
export const AllowedRecipientReferralDaiRegistry: ContractObject<
  typeof abi.allowedRecipientsRegistryAbi
> = {
  name: 'AllowedRecipientReferralDaiRegistry',
  abi: abi.allowedRecipientsRegistryAbi,
  chainAddressMap: addr.AllowedRecipientReferralDaiRegistry,
};

export const EvmAllowedRecipientAddReferralDai: ContractObject<
  typeof abi.addAllowedRecipientAbi
> = {
  name: 'EvmAllowedRecipientAddReferralDai',
  abi: abi.addAllowedRecipientAbi,
  chainAddressMap:
    EvmAddressesByType[MotionType.AllowedRecipientAddReferralDai],
};

export const EvmAllowedRecipientRemoveReferralDai: ContractObject<
  typeof abi.removeAllowedRecipientAbi
> = {
  name: 'EvmAllowedRecipientRemoveReferralDai',
  abi: abi.removeAllowedRecipientAbi,
  chainAddressMap:
    EvmAddressesByType[MotionType.AllowedRecipientRemoveReferralDai],
};

export const EvmAllowedRecipientTopUpReferralDai: ContractObject<
  typeof abi.topUpAllowedRecipientsAbi
> = {
  name: 'EvmAllowedRecipientTopUpReferralDai',
  abi: abi.topUpAllowedRecipientsAbi,
  chainAddressMap:
    EvmAddressesByType[MotionType.AllowedRecipientTopUpReferralDai],
};

// LDO TRP
export const AllowedRecipientTrpLdoRegistry: ContractObject<
  typeof abi.allowedRecipientsRegistryAbi
> = {
  name: 'AllowedRecipientTrpLdoRegistry',
  abi: abi.allowedRecipientsRegistryAbi,
  chainAddressMap: addr.AllowedRecipientTrpLdoRegistry,
};

export const EvmAllowedRecipientTopUpTrpLdo: ContractObject<
  typeof abi.topUpAllowedRecipientsAbi
> = {
  name: 'EvmAllowedRecipientTopUpTrpLdo',
  abi: abi.topUpAllowedRecipientsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.AllowedRecipientTopUpTrpLdo],
};

export const LegoLDORegistry: ContractObject<typeof abi.registryWithLimitsAbi> =
  {
    name: 'LegoLDORegistry',
    abi: abi.registryWithLimitsAbi,
    chainAddressMap: addr.LegoLDORegistry,
  };

export const LegoStablesRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'LegoStablesRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.LegoStablesRegistry,
};

/**
 * @deprecated
 */
export const EvmLegoDAITopUp: ContractObject<typeof abi.topUpWithLimitsAbi> = {
  name: 'EvmLegoDAITopUp',
  abi: abi.topUpWithLimitsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.LegoDAITopUp],
};

/**
 * @deprecated
 */
export const EvmRccDAITopUp: ContractObject<typeof abi.topUpWithLimitsAbi> = {
  name: 'EvmRccDAITopUp',
  abi: abi.topUpWithLimitsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.RccDAITopUp],
};

/**
 * @deprecated
 */
export const EvmPmlDAITopUp: ContractObject<typeof abi.topUpWithLimitsAbi> = {
  name: 'EvmPmlDAITopUp',
  abi: abi.topUpWithLimitsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.PmlDAITopUp],
};

/**
 * @deprecated
 */
export const EvmAtcDAITopUp: ContractObject<typeof abi.topUpWithLimitsAbi> = {
  name: 'EvmAtcDAITopUp',
  abi: abi.topUpWithLimitsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.AtcDAITopUp],
};

export const GasFunderETHRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'GasFunderETHRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.GasFunderETHRegistry,
};

export const GovernanceToken: ContractObject<typeof abi.miniMeTokenAbi> = {
  name: 'GovernanceToken',
  abi: abi.miniMeTokenAbi,
  chainAddressMap: addr.DaoToken,
};

export const EvmNodeOperatorIncreaseLimit: ContractObject<
  typeof abi.evmIncreaseNodeOperatorStakingLimitAbi
> = {
  name: 'EvmNodeOperatorIncreaseLimit',
  abi: abi.evmIncreaseNodeOperatorStakingLimitAbi,
  chainAddressMap: EvmAddressesByType[MotionType.NodeOperatorIncreaseLimit],
};

export const EvmLEGOTopUp: ContractObject<typeof abi.evmTopUpLegoProgramAbi> = {
  name: 'EvmLEGOTopUp',
  abi: abi.evmTopUpLegoProgramAbi,
  chainAddressMap: EvmAddressesByType[MotionType.LEGOTopUp],
};

/**
 * @deprecated
 */
export const EvmRewardProgramAdd: ContractObject<
  typeof abi.evmAddRewardProgramAbi
> = {
  name: 'EvmRewardProgramAdd',
  abi: abi.evmAddRewardProgramAbi,
  chainAddressMap: EvmAddressesByType[MotionType.RewardProgramAdd],
};

/**
 * @deprecated
 */
export const EvmRewardProgramRemove: ContractObject<
  typeof abi.evmRemoveRewardProgramAbi
> = {
  name: 'EvmRewardProgramRemove',
  abi: abi.evmRemoveRewardProgramAbi,
  chainAddressMap: EvmAddressesByType[MotionType.RewardProgramRemove],
};

/**
 * @deprecated
 */
export const EvmRewardProgramTopUp: ContractObject<
  typeof abi.evmTopUpRewardProgramsAbi
> = {
  name: 'EvmRewardProgramTopUp',
  abi: abi.evmTopUpRewardProgramsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.RewardProgramTopUp],
};

export const EvmReferralPartnerAdd: ContractObject<
  typeof abi.evmAddReferralPartnerAbi
> = {
  name: 'EvmReferralPartnerAdd',
  abi: abi.evmAddReferralPartnerAbi,
  chainAddressMap: EvmAddressesByType[MotionType.ReferralPartnerAdd],
};

export const EvmReferralPartnerRemove: ContractObject<
  typeof abi.evmRemoveReferralPartnerAbi
> = {
  name: 'EvmReferralPartnerRemove',
  abi: abi.evmRemoveReferralPartnerAbi,
  chainAddressMap: EvmAddressesByType[MotionType.ReferralPartnerRemove],
};

export const EvmReferralPartnerTopUp: ContractObject<
  typeof abi.evmTopUpReferralPartnersAbi
> = {
  name: 'EvmReferralPartnerTopUp',
  abi: abi.evmTopUpReferralPartnersAbi,
  chainAddressMap: EvmAddressesByType[MotionType.ReferralPartnerTopUp],
};

export const ReferralPartnersRegistry: ContractObject<
  typeof abi.referralPartnersRegistryAbi
> = {
  name: 'ReferralPartnersRegistry',
  abi: abi.referralPartnersRegistryAbi,
  chainAddressMap: addr.ReferralPartnersRegistry,
};

export const StethRewardProgramRegistry: ContractObject<
  typeof abi.rewardProgramRegistryAbi
> = {
  name: 'StethRewardProgramRegistry',
  abi: abi.rewardProgramRegistryAbi,
  chainAddressMap: addr.StethRewardProgramRegistry,
};

export const StethRewardProgramAdd: ContractObject<
  typeof abi.addAllowedRecipientAbi
> = {
  name: 'StethRewardProgramAdd',
  abi: abi.addAllowedRecipientAbi,
  chainAddressMap: EvmAddressesByType[MotionType.StethRewardProgramAdd],
};

export const StethRewardProgramRemove: ContractObject<
  typeof abi.removeAllowedRecipientAbi
> = {
  name: 'StethRewardProgramRemove',
  abi: abi.removeAllowedRecipientAbi,
  chainAddressMap: EvmAddressesByType[MotionType.StethRewardProgramRemove],
};

export const StethRewardProgramTopUp: ContractObject<
  typeof abi.topUpAllowedRecipientsAbi
> = {
  name: 'StethRewardProgramTopUp',
  abi: abi.topUpAllowedRecipientsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.StethRewardProgramTopUp],
};

export const StethGasSupplyRegistry: ContractObject<
  typeof abi.allowedRecipientsRegistryAbi
> = {
  name: 'StethGasSupplyRegistry',
  abi: abi.allowedRecipientsRegistryAbi,
  chainAddressMap: addr.StethGasSupplyRegistry,
};

export const StethGasSupplyAdd: ContractObject<
  typeof abi.addAllowedRecipientAbi
> = {
  name: 'StethGasSupplyAdd',
  abi: abi.addAllowedRecipientAbi,
  chainAddressMap: EvmAddressesByType[MotionType.StethGasSupplyAdd],
};

export const StethGasSupplyRemove: ContractObject<
  typeof abi.removeAllowedRecipientAbi
> = {
  name: 'StethGasSupplyRemove',
  abi: abi.removeAllowedRecipientAbi,
  chainAddressMap: EvmAddressesByType[MotionType.StethGasSupplyRemove],
};

export const StethGasSupplyTopUp: ContractObject<
  typeof abi.topUpAllowedRecipientsAbi
> = {
  name: 'StethGasSupplyTopUp',
  abi: abi.topUpAllowedRecipientsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.StethGasSupplyTopUp],
};

export const RewardsShareProgramRegistry: ContractObject<
  typeof abi.allowedRecipientsRegistryAbi
> = {
  name: 'RewardsShareProgramRegistry',
  abi: abi.allowedRecipientsRegistryAbi,
  chainAddressMap: addr.RewardsShareProgramRegistry,
};

export const RewardsShareProgramAdd: ContractObject<
  typeof abi.addAllowedRecipientAbi
> = {
  name: 'RewardsShareProgramAdd',
  abi: abi.addAllowedRecipientAbi,
  chainAddressMap: EvmAddressesByType[MotionType.RewardsShareProgramAdd],
};

export const RewardsShareProgramRemove: ContractObject<
  typeof abi.removeAllowedRecipientAbi
> = {
  name: 'RewardsShareProgramRemove',
  abi: abi.removeAllowedRecipientAbi,
  chainAddressMap: EvmAddressesByType[MotionType.RewardsShareProgramRemove],
};

export const RewardsShareProgramTopUp: ContractObject<
  typeof abi.topUpAllowedRecipientsAbi
> = {
  name: 'RewardsShareProgramTopUp',
  abi: abi.topUpAllowedRecipientsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.RewardsShareProgramTopUp],
};

export const SDVTRegistry: ContractObject<typeof abi.nodeOperatorsRegistryAbi> =
  {
    name: 'SDVTRegistry',
    abi: abi.nodeOperatorsRegistryAbi,
    chainAddressMap: addr.SDVTRegistry,
  };

export const SDVTNodeOperatorsAdd: ContractObject<
  typeof abi.addNodeOperatorsAbi
> = {
  name: 'SDVTNodeOperatorsAdd',
  abi: abi.addNodeOperatorsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.SDVTNodeOperatorsAdd],
};

export const SDVTNodeOperatorsActivate: ContractObject<
  typeof abi.activateNodeOperatorsAbi
> = {
  name: 'SDVTNodeOperatorsActivate',
  abi: abi.activateNodeOperatorsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.SDVTNodeOperatorsActivate],
};

export const SDVTNodeOperatorsDeactivate: ContractObject<
  typeof abi.deactivateNodeOperatorsAbi
> = {
  name: 'SDVTNodeOperatorsDeactivate',
  abi: abi.deactivateNodeOperatorsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.SDVTNodeOperatorsDeactivate],
};

export const SDVTVettedValidatorsLimitsSet: ContractObject<
  typeof abi.setVettedValidatorsLimitsAbi
> = {
  name: 'SDVTVettedValidatorsLimitsSet',
  abi: abi.setVettedValidatorsLimitsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.SDVTVettedValidatorsLimitsSet],
};

export const SDVTNodeOperatorNamesSet: ContractObject<
  typeof abi.setNodeOperatorNamesAbi
> = {
  name: 'SDVTNodeOperatorNamesSet',
  abi: abi.setNodeOperatorNamesAbi,
  chainAddressMap: EvmAddressesByType[MotionType.SDVTNodeOperatorNamesSet],
};

export const SDVTNodeOperatorRewardAddressesSet: ContractObject<
  typeof abi.setNodeOperatorRewardAddressesAbi
> = {
  name: 'SDVTNodeOperatorRewardAddressesSet',
  chainAddressMap:
    EvmAddressesByType[MotionType.SDVTNodeOperatorRewardAddressesSet],
  abi: abi.setNodeOperatorRewardAddressesAbi,
};

export const SDVTNodeOperatorManagerChange: ContractObject<
  typeof abi.changeNodeOperatorManagersAbi
> = {
  name: 'SDVTNodeOperatorManagerChange',
  abi: abi.changeNodeOperatorManagersAbi,
  chainAddressMap: EvmAddressesByType[MotionType.SDVTNodeOperatorManagerChange],
};

export const SDVTTargetValidatorLimitsUpdateV2: ContractObject<
  typeof abi.updateTargetValidatorLimitsV2Abi
> = {
  name: 'SDVTTargetValidatorLimitsUpdateV2',
  abi: abi.updateTargetValidatorLimitsV2Abi,
  chainAddressMap:
    EvmAddressesByType[MotionType.SDVTTargetValidatorLimitsUpdateV2],
};

export const SandboxNodeOperatorsRegistry: ContractObject<
  typeof abi.nodeOperatorsRegistryAbi
> = {
  name: 'SandboxNodeOperatorsRegistry',
  abi: abi.nodeOperatorsRegistryAbi,
  chainAddressMap: addr.SandboxNodeOperatorsRegistry,
};

export const EvmSandboxNodeOperatorIncreaseLimit: ContractObject<
  typeof abi.evmIncreaseNodeOperatorStakingLimitAbi
> = {
  name: 'EvmSandboxNodeOperatorIncreaseLimit',
  abi: abi.evmIncreaseNodeOperatorStakingLimitAbi,
  chainAddressMap:
    EvmAddressesByType[MotionType.SandboxNodeOperatorIncreaseLimit],
};

export const AllowedTokensRegistry: ContractObject<
  typeof abi.allowedTokensRegistryAbi
> = {
  name: 'AllowedTokensRegistry',
  abi: abi.allowedTokensRegistryAbi,
  chainAddressMap: addr.AllowedTokensRegistry,
};

export const RccStablesRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'RccStablesRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.RccStablesRegistry,
};

export const EvmRccStablesTopUp: ContractObject<
  typeof abi.topUpWithLimitsStablesAbi
> = {
  name: 'EvmRccStablesTopUp',
  abi: abi.topUpWithLimitsStablesAbi,
  chainAddressMap: EvmAddressesByType[MotionType.RccStablesTopUp],
};

export const PmlStablesRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'PmlStablesRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.PmlStablesRegistry,
};

export const EvmPmlStablesTopUp: ContractObject<
  typeof abi.topUpWithLimitsStablesAbi
> = {
  name: 'EvmPmlStablesTopUp',
  abi: abi.topUpWithLimitsStablesAbi,
  chainAddressMap: EvmAddressesByType[MotionType.PmlStablesTopUp],
};

export const AtcStablesRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'AtcStablesRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.AtcStablesRegistry,
};

export const EvmAtcStablesTopUp: ContractObject<
  typeof abi.topUpWithLimitsStablesAbi
> = {
  name: 'EvmAtcStablesTopUp',
  abi: abi.topUpWithLimitsStablesAbi,
  chainAddressMap: EvmAddressesByType[MotionType.AtcStablesTopUp],
};

export const SandboxStablesAllowedRecipientRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'SandboxStablesAllowedRecipientRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.SandboxStablesAllowedRecipientRegistry,
};

export const EvmSandboxStablesAdd: ContractObject<
  typeof abi.addAllowedRecipientAbi
> = {
  name: 'EvmSandboxStablesAdd',
  abi: abi.addAllowedRecipientAbi,
  chainAddressMap: EvmAddressesByType[MotionType.SandboxStablesAdd],
};

export const EvmSandboxStablesRemove: ContractObject<
  typeof abi.removeAllowedRecipientAbi
> = {
  name: 'EvmSandboxStablesRemove',
  abi: abi.removeAllowedRecipientAbi,
  chainAddressMap: EvmAddressesByType[MotionType.SandboxStablesRemove],
};

export const EvmSandboxStablesTopUp: ContractObject<
  typeof abi.topUpWithLimitsStablesAbi
> = {
  name: 'EvmSandboxStablesTopUp',
  abi: abi.topUpWithLimitsStablesAbi,
  chainAddressMap: EvmAddressesByType[MotionType.SandboxStablesTopUp],
};

export const RccStethAllowedRecipientsRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'RccStethAllowedRecipientsRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.RccStethAllowedRecipientsRegistry,
};

export const PmlStethAllowedRecipientsRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'PmlStethAllowedRecipientsRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.PmlStethAllowedRecipientsRegistry,
};

export const AtcStethAllowedRecipientsRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'AtcStethAllowedRecipientsRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.AtcStethAllowedRecipientsRegistry,
};

export const RccStethTopUp: ContractObject<typeof abi.topUpWithLimitsAbi> = {
  name: 'RccStethTopUp',
  abi: abi.topUpWithLimitsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.RccStethTopUp],
};

export const PmlStethTopUp: ContractObject<typeof abi.topUpWithLimitsAbi> = {
  name: 'PmlStethTopUp',
  abi: abi.topUpWithLimitsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.PmlStethTopUp],
};

export const AtcStethTopUp: ContractObject<typeof abi.topUpWithLimitsAbi> = {
  name: 'AtcStethTopUp',
  abi: abi.topUpWithLimitsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.AtcStethTopUp],
};

export const LegoStablesTopUp: ContractObject<
  typeof abi.topUpWithLimitsStablesAbi
> = {
  name: 'LegoStablesTopUp',
  abi: abi.topUpWithLimitsStablesAbi,
  chainAddressMap: EvmAddressesByType[MotionType.LegoStablesTopUp],
};

export const StonksStethAllowedRecipientsRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'StonksStethAllowedRecipientsRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.StonksStethAllowedRecipientsRegistry,
};

export const StonksStablesAllowedRecipientsRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'StonksStablesAllowedRecipientsRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.StonksStablesAllowedRecipientsRegistry,
};

export const StonksStethTopUp: ContractObject<typeof abi.topUpWithLimitsAbi> = {
  name: 'StonksStethTopUp',
  abi: abi.topUpWithLimitsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.StonksStethTopUp],
};

export const StonksStablesTopUp: ContractObject<
  typeof abi.topUpWithLimitsStablesAbi
> = {
  name: 'StonksStablesTopUp',
  abi: abi.topUpWithLimitsStablesAbi,
  chainAddressMap: EvmAddressesByType[MotionType.StonksStablesTopUp],
};

export const CSMSettleElStealingPenalty: ContractObject<
  typeof abi.csmSettleElStealingPenaltyAbi
> = {
  name: 'CSMSettleElStealingPenalty',
  abi: abi.csmSettleElStealingPenaltyAbi,
  chainAddressMap: EvmAddressesByType[MotionType.CSMSettleElStealingPenalty],
};

export const CSModule: ContractObject<typeof abi.csmRegistryAbi> = {
  name: 'CSModule',
  abi: abi.csmRegistryAbi,
  chainAddressMap: addr.CSModule,
};

export const AllianceOpsStablesAllowedRecipientsRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'AllianceOpsStablesAllowedRecipientsRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.AllianceOpsAllowedRecipientsRegistry,
};

export const EvmAllianceOpsStablesTopUp: ContractObject<
  typeof abi.topUpWithLimitsStablesAbi
> = {
  name: 'EvmAllianceOpsStablesTopUp',
  abi: abi.topUpWithLimitsStablesAbi,
  chainAddressMap: EvmAddressesByType[MotionType.AllianceOpsStablesTopUp],
};

export const SDVTTargetValidatorLimitsUpdateV1: ContractObject<
  typeof abi.updateTargetValidatorLimitsV1Abi
> = {
  name: 'SDVTTargetValidatorLimitsUpdateV1',
  abi: abi.updateTargetValidatorLimitsV1Abi,
  chainAddressMap:
    EvmAddressesByType[MotionType.SDVTTargetValidatorLimitsUpdateV1],
};

export const EcosystemOpsStablesAllowedRecipientsRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'EcosystemOpsStablesAllowedRecipientsRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.EcosystemOpsStablesAllowedRecipientsRegistry,
};

export const EcosystemOpsStablesTopUp: ContractObject<
  typeof abi.topUpWithLimitsStablesAbi
> = {
  name: 'EcosystemOpsStablesTopUp',
  abi: abi.topUpWithLimitsStablesAbi,
  chainAddressMap: EvmAddressesByType[MotionType.EcosystemOpsStablesTopUp],
};

export const LabsOpsStablesAllowedRecipientsRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'LabsOpsStablesAllowedRecipientsRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.LabsOpsStablesAllowedRecipientsRegistry,
};

export const LabsOpsStablesTopUp: ContractObject<
  typeof abi.topUpWithLimitsStablesAbi
> = {
  name: 'LabsOpsStablesTopUp',
  abi: abi.topUpWithLimitsStablesAbi,
  chainAddressMap: EvmAddressesByType[MotionType.LabsOpsStablesTopUp],
};

export const EcosystemOpsStethAllowedRecipientsRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'EcosystemOpsStethAllowedRecipientsRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.EcosystemOpsStethAllowedRecipientsRegistry,
};

export const EcosystemOpsStethTopUp: ContractObject<
  typeof abi.topUpWithLimitsAbi
> = {
  name: 'EcosystemOpsStethTopUp',
  abi: abi.topUpWithLimitsAbi,
  chainAddressMap: EvmAddressesByType[MotionType.EcosystemOpsStethTopUp],
};

export const LabsOpsStethAllowedRecipientsRegistry: ContractObject<
  typeof abi.registryWithLimitsAbi
> = {
  name: 'LabsOpsStethAllowedRecipientsRegistry',
  abi: abi.registryWithLimitsAbi,
  chainAddressMap: addr.LabsOpsStethAllowedRecipientsRegistry,
};

export const LabsOpsStethTopUp: ContractObject<typeof abi.topUpWithLimitsAbi> =
  {
    name: 'LabsOpsStethTopUp',
    abi: abi.topUpWithLimitsAbi,
    chainAddressMap: EvmAddressesByType[MotionType.LabsOpsStethTopUp],
  };

export const MEVBoostRelayList: ContractObject<
  typeof abi.mevBoostRelayAllowedListAbi
> = {
  name: 'MEVBoostRelayList',
  abi: abi.mevBoostRelayAllowedListAbi,
  chainAddressMap: addr.MEVBoostRelayAllowedList,
};

export const MEVBoostRelaysAdd: ContractObject<
  typeof abi.addMEVBoostRelaysAbi
> = {
  name: 'MEVBoostRelaysAdd',
  abi: abi.addMEVBoostRelaysAbi,
  chainAddressMap: EvmAddressesByType[MotionType.MEVBoostRelaysAdd],
};

export const MEVBoostRelaysEdit: ContractObject<
  typeof abi.editMEVBoostRelaysAbi
> = {
  name: 'MEVBoostRelaysEdit',
  abi: abi.editMEVBoostRelaysAbi,
  chainAddressMap: EvmAddressesByType[MotionType.MEVBoostRelaysEdit],
};

export const MEVBoostRelaysRemove: ContractObject<
  typeof abi.removeMEVBoostRelaysAbi
> = {
  name: 'MEVBoostRelaysRemove',
  abi: abi.removeMEVBoostRelaysAbi,
  chainAddressMap: EvmAddressesByType[MotionType.MEVBoostRelaysRemove],
};

export const CSMSetVettedGateTree: ContractObject<
  typeof abi.csmSetVettedGateTreeAbi
> = {
  name: 'CSMSetVettedGateTree',
  abi: abi.csmSetVettedGateTreeAbi,
  chainAddressMap: EvmAddressesByType[MotionType.CSMSetVettedGateTree],
};

export const SDVTExitRequestHashesSubmit: ContractObject<
  typeof abi.submitExitRequestHashesAbi
> = {
  name: 'SDVTExitRequestHashesSubmit',
  abi: abi.submitExitRequestHashesAbi,
  chainAddressMap: EvmAddressesByType[MotionType.SDVTExitRequestHashesSubmit],
};

export const CuratedExitRequestHashesSubmit: ContractObject<
  typeof abi.submitExitRequestHashesAbi
> = {
  name: 'CuratedExitRequestHashesSubmit',
  abi: abi.submitExitRequestHashesAbi,
  chainAddressMap:
    EvmAddressesByType[MotionType.CuratedExitRequestHashesSubmit],
};
