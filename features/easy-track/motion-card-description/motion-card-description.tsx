import { useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useLidoSDK } from 'providers/lido-sdk';
import { decodeEvmScriptCallData } from '../hooks/use-decode-evm-script-call-data';

import { Text } from 'shared/components/text';

import { LEGOTopUp } from './motion-descriptions/lego';
import {
  ReferralPartnerRemove,
  ReferralPartnerTopUp,
  ReferralPartnerAdd,
} from './motion-descriptions/referral-partner';
import {
  RewardProgramRemove,
  RewardProgramTopUp,
  RewardProgramAdd,
} from './motion-descriptions/reward-program';
import {
  AllowedRecipientAdd,
  AllowedRecipientTopUp,
  AllowedRecipientRemove,
} from './motion-descriptions/allowed-recipient';

import { TopUpWithLimits } from './motion-descriptions/top-up-with-limits';
import { TopUpWithLimitsAndCustomToken } from './motion-descriptions/top-up-with-limits-and-custom-token';

import { Motion } from '../types';
import { MotionType } from '../motion-types';
import { EvmUnrecognized } from '../evm-addresses';
import { getMotionTypeByScriptFactory } from '../utils/get-motion-type';
import { SdvtNodeOperatorsDeactivate } from './motion-descriptions/sdvt-node-operators-deactivate';
import { SdvtNodeOperatorsActivate } from './motion-descriptions/sdvt-node-operators-activate';
import { SdvtVettedValidatorsLimitsSet } from './motion-descriptions/sdvt-vetted-validators-limits-set';
import { SdvtTargetValidatorLimitsUpdateV1 } from './motion-descriptions/sdvt-target-validator-limits-update-v1';
import { SdvtTargetValidatorLimitsUpdateV2 } from './motion-descriptions/sdvt-target-validator-limits-update-v2';
import { SdvtNodeOperatorRewardAddressesSet } from './motion-descriptions/sdvt-node-operator-reward-addresses-set';
import { SdvtNodeOperatorNamesSet } from './motion-descriptions/sdvt-node-operator-names-set';
import { SdvtNodeOperatorsAdd } from './motion-descriptions/sdvt-node-operators-add';
import { SdvtNodeOperatorManagersChange } from './motion-descriptions/sdvt-node-operator-managers-change';
import { DescNodeOperatorIncreaseLimit } from './motion-descriptions/node-operator-limit-increase';
import { CsmSettleElStealingPenalty } from './motion-descriptions/csm-settle-el-stealing-penalty';
import { SettleGeneralDelayedPenalty } from './motion-descriptions/settle-general-delayed-penalty';
import { ReportWithdrawalsForSlashedValidators } from './motion-descriptions/report-withdrawals-for-slashed-validators';
import { MevBoostRelaysAdd } from './motion-descriptions/mev-boost-relays-add';
import { MevBoostRelaysEdit } from './motion-descriptions/mev-boost-relays-edit';
import { MevBoostRelaysRemove } from './motion-descriptions/mev-boost-relays-remove';
import { CsmSetVettedGateTree } from './motion-descriptions/csm-set-vetted-gate-tree';
import { SetMerkleGateTree } from './motion-descriptions/set-merkle-gate-tree';
import { CuratedExitRequestHashesSubmit } from './motion-descriptions/curated-exit-request-hashes-submit';
import { SdvtExitRequestHashesSubmit } from './motion-descriptions/sdvt-exit-request-hashes-submit';
import { VaultsForceValidatorExitsInVaultHub } from './motion-descriptions/vaults-force-validator-exits-in-vault-hub';
import { VaultsRegisterGroupsInOperatorGrid } from '@easy-track/motion-card-description/motion-descriptions/vaults-register-groups-in-operator-grid';
import { VaultsUpdateGroupsShareLimit } from '@easy-track/motion-card-description/motion-descriptions/vaults-update-groups-share-limit';
import { VaultsSetJailStatusInOperatorGrid } from '@easy-track/motion-card-description/motion-descriptions/vaults-set-jail-status-in-operator-grid';
import { VaultsUpdateVaultsFeesInOperatorGrid } from '@easy-track/motion-card-description/motion-descriptions/vaults-update-vaults-fees-in-operator-grid';
import { VaultsSocializeBadDebtInVaultHub } from '@easy-track/motion-card-description/motion-descriptions/vaults-socialize-bad-debt-in-vault-hub';
import { VaultsAlterTiersInOperatorGrid } from '@easy-track/motion-card-description/motion-descriptions/vaults-alter-tiers-in-operator-grid';
import { VaultsRegisterTiersInOperatorGrid } from '@easy-track/motion-card-description/motion-descriptions/vaults-register-tiers-in-operator-grid';
import { VaultsSetLiabilitySharesTargetInVaultHub } from '@easy-track/motion-card-description/motion-descriptions/vaults-set-liability-shares-target-in-vault-hub';
import { AllowConsolidationPair } from './motion-descriptions/allow-consolidation-pair';
import { CreateOrUpdateOperatorGroup } from './motion-descriptions/create-or-update-operator-group';
import { UpdateStakingModuleShareLimits } from './motion-descriptions/update-staking-module-share-limits';
import { Abi } from 'viem';
import { MotionDescriptionProps } from './types';

// callData and motionType are routed dynamically so they are overridden to any,
// but every other prop stays linked to MotionDescriptionProps and checked
const MOTION_DESCRIPTIONS: Record<
  MotionType,
  React.FunctionComponent<
    Omit<MotionDescriptionProps<Abi>, 'callData' | 'motionType'> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callData: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      motionType: any;
    }
  >
> = {
  [MotionType.NodeOperatorIncreaseLimit]: DescNodeOperatorIncreaseLimit,
  [MotionType.LEGOTopUp]: LEGOTopUp,
  [MotionType.RewardProgramAdd]: RewardProgramAdd,
  [MotionType.RewardProgramTopUp]: RewardProgramTopUp,
  [MotionType.RewardProgramRemove]: RewardProgramRemove,
  [MotionType.ReferralPartnerAdd]: ReferralPartnerAdd,
  [MotionType.ReferralPartnerTopUp]: ReferralPartnerTopUp,
  [MotionType.ReferralPartnerRemove]: ReferralPartnerRemove,
  [MotionType.AllowedRecipientAdd]: AllowedRecipientAdd,
  [MotionType.AllowedRecipientRemove]: AllowedRecipientRemove,
  [MotionType.AllowedRecipientTopUp]: AllowedRecipientTopUp,
  [MotionType.AllowedRecipientAddReferralDai]: AllowedRecipientAdd,
  [MotionType.AllowedRecipientRemoveReferralDai]: AllowedRecipientRemove,
  [MotionType.AllowedRecipientTopUpReferralDai]: AllowedRecipientTopUp,
  [MotionType.AllowedRecipientTopUpTrpLdo]: AllowedRecipientTopUp,
  [MotionType.LegoLDOTopUp]: TopUpWithLimits,
  [MotionType.LegoDAITopUp]: TopUpWithLimits,
  [MotionType.RccDAITopUp]: TopUpWithLimits,
  [MotionType.PmlDAITopUp]: TopUpWithLimits,
  [MotionType.AtcDAITopUp]: TopUpWithLimits,
  [MotionType.GasFunderETHTopUp]: TopUpWithLimits,
  [MotionType.StethRewardProgramAdd]: AllowedRecipientAdd,
  [MotionType.StethRewardProgramRemove]: AllowedRecipientRemove,
  [MotionType.StethRewardProgramTopUp]: TopUpWithLimits,
  [MotionType.StethGasSupplyAdd]: AllowedRecipientAdd,
  [MotionType.StethGasSupplyRemove]: AllowedRecipientRemove,
  [MotionType.StethGasSupplyTopUp]: TopUpWithLimits,
  [MotionType.RewardsShareProgramAdd]: AllowedRecipientAdd,
  [MotionType.RewardsShareProgramRemove]: AllowedRecipientRemove,
  [MotionType.RewardsShareProgramTopUp]: TopUpWithLimits,
  [MotionType.SDVTNodeOperatorsAdd]: SdvtNodeOperatorsAdd,
  [MotionType.SDVTNodeOperatorsActivate]: SdvtNodeOperatorsActivate,
  [MotionType.SDVTNodeOperatorsDeactivate]: SdvtNodeOperatorsDeactivate,
  [MotionType.SDVTVettedValidatorsLimitsSet]: SdvtVettedValidatorsLimitsSet,
  [MotionType.SDVTNodeOperatorRewardAddressesSet]:
    SdvtNodeOperatorRewardAddressesSet,
  [MotionType.SDVTNodeOperatorNamesSet]: SdvtNodeOperatorNamesSet,
  [MotionType.SDVTTargetValidatorLimitsUpdateV2]:
    SdvtTargetValidatorLimitsUpdateV2,
  [MotionType.SDVTTargetValidatorLimitsUpdateV1]:
    SdvtTargetValidatorLimitsUpdateV1,
  [MotionType.SDVTNodeOperatorManagerChange]: SdvtNodeOperatorManagersChange,
  [MotionType.SandboxNodeOperatorIncreaseLimit]: DescNodeOperatorIncreaseLimit,
  [MotionType.RccStablesTopUp]: TopUpWithLimitsAndCustomToken,
  [MotionType.PmlStablesTopUp]: TopUpWithLimitsAndCustomToken,
  [MotionType.AtcStablesTopUp]: TopUpWithLimitsAndCustomToken,
  [MotionType.SandboxStethAdd]: AllowedRecipientAdd,
  [MotionType.SandboxStablesAdd]: AllowedRecipientAdd,
  [MotionType.SandboxStablesRemove]: AllowedRecipientRemove,
  [MotionType.SandboxStablesTopUp]: TopUpWithLimitsAndCustomToken,
  [MotionType.SandboxStethTopUp]: TopUpWithLimits,
  [MotionType.SandboxStethRemove]: AllowedRecipientRemove,
  [MotionType.RccStethTopUp]: TopUpWithLimits,
  [MotionType.PmlStethTopUp]: TopUpWithLimits,
  [MotionType.AtcStethTopUp]: TopUpWithLimits,
  [MotionType.LegoStablesTopUp]: TopUpWithLimitsAndCustomToken,
  [MotionType.StonksStablesTopUp]: TopUpWithLimitsAndCustomToken,
  [MotionType.StonksStethTopUp]: TopUpWithLimits,
  [MotionType.CSMSettleElStealingPenalty]: CsmSettleElStealingPenalty,
  [MotionType.CSMSettleGeneralDelayedPenalty]: SettleGeneralDelayedPenalty,
  [MotionType.CuratedSettleGeneralDelayedPenalty]: SettleGeneralDelayedPenalty,
  [MotionType.CSMReportWithdrawalsForSlashedValidators]:
    ReportWithdrawalsForSlashedValidators,
  [MotionType.CuratedReportWithdrawalsForSlashedValidators]:
    ReportWithdrawalsForSlashedValidators,
  [MotionType.AllianceOpsStablesTopUp]: TopUpWithLimitsAndCustomToken,
  [MotionType.EcosystemOpsStablesTopUp]: TopUpWithLimitsAndCustomToken,
  [MotionType.LabsOpsStablesTopUp]: TopUpWithLimitsAndCustomToken,
  [MotionType.EcosystemOpsStethTopUp]: TopUpWithLimits,
  [MotionType.LabsOpsStethTopUp]: TopUpWithLimits,
  [MotionType.MEVBoostRelaysAdd]: MevBoostRelaysAdd,
  [MotionType.MEVBoostRelaysEdit]: MevBoostRelaysEdit,
  [MotionType.MEVBoostRelaysRemove]: MevBoostRelaysRemove,
  [MotionType.CSMSetVettedGateTree]: CsmSetVettedGateTree,
  [MotionType.CSMSetMerkleGateTree]: SetMerkleGateTree,
  [MotionType.CuratedSetMerkleGateTree]: SetMerkleGateTree,
  [MotionType.CuratedExitRequestHashesSubmit]: CuratedExitRequestHashesSubmit,
  [MotionType.SDVTExitRequestHashesSubmit]: SdvtExitRequestHashesSubmit,

  // Vaults
  [MotionType.RegisterGroupsInOperatorGrid]: VaultsRegisterGroupsInOperatorGrid,
  [MotionType.RegisterTiersInOperatorGrid]: VaultsRegisterTiersInOperatorGrid,
  [MotionType.UpdateGroupsShareLimit]: VaultsUpdateGroupsShareLimit,
  [MotionType.AlterTiersInOperatorGrid]: VaultsAlterTiersInOperatorGrid,
  [MotionType.SetJailStatusInOperatorGrid]: VaultsSetJailStatusInOperatorGrid,
  [MotionType.UpdateVaultsFeesInOperatorGrid]:
    VaultsUpdateVaultsFeesInOperatorGrid,
  [MotionType.ForceValidatorExitsInVaultHub]:
    VaultsForceValidatorExitsInVaultHub,
  [MotionType.SetLiabilitySharesTargetInVaultHub]:
    VaultsSetLiabilitySharesTargetInVaultHub,
  [MotionType.SocializeBadDebtInVaultHub]: VaultsSocializeBadDebtInVaultHub,

  // Vaults Phase One
  [MotionType.RegisterGroupsInOperatorGridPhaseOne]:
    VaultsRegisterGroupsInOperatorGrid,
  [MotionType.UpdateGroupsShareLimitPhaseOne]: VaultsUpdateGroupsShareLimit,
  [MotionType.AlterTiersInOperatorGridPhaseOne]: VaultsAlterTiersInOperatorGrid,
  [MotionType.SetJailStatusInOperatorGridPhaseOne]:
    VaultsSetJailStatusInOperatorGrid,
  [MotionType.UpdateVaultsFeesInOperatorGridPhaseOne]:
    VaultsUpdateVaultsFeesInOperatorGrid,
  [MotionType.ForceValidatorExitsInVaultHubPhaseOne]:
    VaultsForceValidatorExitsInVaultHub,
  [MotionType.SocializeBadDebtInVaultHubPhaseOne]:
    VaultsSocializeBadDebtInVaultHub,

  // Vaults Old
  [MotionType.RegisterGroupsInOperatorGridOld]:
    VaultsRegisterGroupsInOperatorGrid,
  [MotionType.AlterTiersInOperatorGridOld]: VaultsAlterTiersInOperatorGrid,
  [MotionType.RegisterTiersInOperatorGridOld]:
    VaultsRegisterTiersInOperatorGrid,

  [MotionType.AllowConsolidationPair]: AllowConsolidationPair,
  [MotionType.CreateOrUpdateOperatorGroup]: CreateOrUpdateOperatorGroup,
  [MotionType.UpdateStakingModuleShareLimits]: UpdateStakingModuleShareLimits,
};

type Props = {
  motion: Motion;
};

export const MotionDescription = ({ motion }: Props) => {
  const { chainId } = useLidoSDK();
  const motionType = getMotionTypeByScriptFactory(
    chainId,
    motion.evmScriptFactory,
  );
  const callDataRaw = motion.evmScriptCalldata;

  const { data: callData, isLoading } = useQuery({
    queryKey: ['call-data', chainId, Number(motion.id)],
    queryFn: () => {
      if (motionType === EvmUnrecognized || !callDataRaw) {
        return null;
      }
      return decodeEvmScriptCallData(motionType, callDataRaw);
    },
    enabled: motionType !== EvmUnrecognized && !!callDataRaw,
  });

  if (motionType === EvmUnrecognized) {
    return (
      <Text size={14} color="warning">
        Unrecognized motion type
      </Text>
    );
  }

  if (!callData || isLoading) {
    return <>Loading...</>;
  }

  const Desc = MOTION_DESCRIPTIONS[motionType];

  return (
    <Text size={14} color="textv1" as="div">
      <ErrorBoundary fallback={<>Failed to render motion description</>}>
        <Desc
          callData={callData}
          isOnChain={motion.isOnChain}
          motionType={motionType}
        />
      </ErrorBoundary>
    </Text>
  );
};
