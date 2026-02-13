import { useQuery } from '@tanstack/react-query';
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
import { MevBoostRelaysAdd } from './motion-descriptions/mev-boost-relays-add';
import { MevBoostRelaysEdit } from './motion-descriptions/mev-boost-relays-edit';
import { MevBoostRelaysRemove } from './motion-descriptions/mev-boost-relays-remove';
import { CsmSetVettedGateTree } from './motion-descriptions/csm-set-vetted-gate-tree';
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

// Generic props type for all motion descriptions
type GenericDescProps = {
  isOnChain?: boolean;
  callData: any;
};

const MOTION_DESCRIPTIONS = {
  [MotionType.NodeOperatorIncreaseLimit]: (props: GenericDescProps) => (
    <DescNodeOperatorIncreaseLimit
      {...props}
      motionType={MotionType.NodeOperatorIncreaseLimit}
    />
  ),
  [MotionType.LEGOTopUp]: (props: GenericDescProps) => <LEGOTopUp {...props} />,
  [MotionType.RewardProgramAdd]: (props: GenericDescProps) => (
    <RewardProgramAdd {...props} />
  ),
  [MotionType.RewardProgramTopUp]: (props: GenericDescProps) => (
    <RewardProgramTopUp {...props} />
  ),
  [MotionType.RewardProgramRemove]: (props: GenericDescProps) => (
    <RewardProgramRemove {...props} />
  ),
  [MotionType.ReferralPartnerAdd]: (props: GenericDescProps) => (
    <ReferralPartnerAdd {...props} />
  ),
  [MotionType.ReferralPartnerTopUp]: (props: GenericDescProps) => (
    <ReferralPartnerTopUp {...props} />
  ),
  [MotionType.ReferralPartnerRemove]: (props: GenericDescProps) => (
    <ReferralPartnerRemove {...props} />
  ),
  [MotionType.AllowedRecipientAdd]: (props: GenericDescProps) => (
    <AllowedRecipientAdd
      {...props}
      registryType={MotionType.AllowedRecipientAdd}
    />
  ),
  [MotionType.AllowedRecipientRemove]: (props: GenericDescProps) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.AllowedRecipientRemove}
    />
  ),
  [MotionType.AllowedRecipientTopUp]: (props: GenericDescProps) => (
    <AllowedRecipientTopUp
      {...props}
      registryType={MotionType.AllowedRecipientTopUp}
    />
  ),
  [MotionType.AllowedRecipientAddReferralDai]: (props: GenericDescProps) => (
    <AllowedRecipientAdd
      {...props}
      registryType={MotionType.AllowedRecipientAddReferralDai}
    />
  ),
  [MotionType.AllowedRecipientRemoveReferralDai]: (props: GenericDescProps) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.AllowedRecipientRemoveReferralDai}
    />
  ),
  [MotionType.AllowedRecipientTopUpReferralDai]: (props: GenericDescProps) => (
    <AllowedRecipientTopUp
      {...props}
      registryType={MotionType.AllowedRecipientTopUpReferralDai}
    />
  ),
  [MotionType.AllowedRecipientTopUpTrpLdo]: (props: GenericDescProps) => (
    <AllowedRecipientTopUp
      {...props}
      registryType={MotionType.AllowedRecipientTopUpTrpLdo}
    />
  ),
  [MotionType.LegoLDOTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.LegoLDOTopUp} />
  ),
  [MotionType.LegoDAITopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.LegoDAITopUp} />
  ),
  [MotionType.RccDAITopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.RccDAITopUp} />
  ),
  [MotionType.PmlDAITopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.PmlDAITopUp} />
  ),
  [MotionType.AtcDAITopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.AtcDAITopUp} />
  ),
  [MotionType.GasFunderETHTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.GasFunderETHTopUp} />
  ),
  [MotionType.StethRewardProgramAdd]: (props: GenericDescProps) => (
    <AllowedRecipientAdd
      {...props}
      registryType={MotionType.StethRewardProgramAdd}
    />
  ),
  [MotionType.StethRewardProgramRemove]: (props: GenericDescProps) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.StethRewardProgramRemove}
    />
  ),
  [MotionType.StethRewardProgramTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits
      {...props}
      registryType={MotionType.StethRewardProgramTopUp}
    />
  ),

  [MotionType.StethGasSupplyAdd]: (props: GenericDescProps) => (
    <AllowedRecipientAdd
      {...props}
      registryType={MotionType.StethGasSupplyAdd}
    />
  ),
  [MotionType.StethGasSupplyRemove]: (props: GenericDescProps) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.StethGasSupplyRemove}
    />
  ),
  [MotionType.StethGasSupplyTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.StethGasSupplyTopUp} />
  ),
  [MotionType.RewardsShareProgramAdd]: (props: GenericDescProps) => (
    <AllowedRecipientAdd
      {...props}
      registryType={MotionType.RewardsShareProgramAdd}
    />
  ),
  [MotionType.RewardsShareProgramRemove]: (props: GenericDescProps) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.RewardsShareProgramRemove}
    />
  ),
  [MotionType.RewardsShareProgramTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits
      {...props}
      registryType={MotionType.RewardsShareProgramTopUp}
    />
  ),
  [MotionType.SDVTNodeOperatorsAdd]: (props: GenericDescProps) => (
    <SdvtNodeOperatorsAdd {...props} />
  ),
  [MotionType.SDVTNodeOperatorsActivate]: (props: GenericDescProps) => (
    <SdvtNodeOperatorsActivate {...props} />
  ),
  [MotionType.SDVTNodeOperatorsDeactivate]: (props: GenericDescProps) => (
    <SdvtNodeOperatorsDeactivate {...props} />
  ),
  [MotionType.SDVTVettedValidatorsLimitsSet]: (props: GenericDescProps) => (
    <SdvtVettedValidatorsLimitsSet {...props} />
  ),
  [MotionType.SDVTNodeOperatorRewardAddressesSet]: (
    props: GenericDescProps,
  ) => <SdvtNodeOperatorRewardAddressesSet {...props} />,
  [MotionType.SDVTNodeOperatorNamesSet]: (props: GenericDescProps) => (
    <SdvtNodeOperatorNamesSet {...props} />
  ),
  [MotionType.SDVTTargetValidatorLimitsUpdateV2]: (props: GenericDescProps) => (
    <SdvtTargetValidatorLimitsUpdateV2 {...props} />
  ),
  [MotionType.SDVTTargetValidatorLimitsUpdateV1]: (props: GenericDescProps) => (
    <SdvtTargetValidatorLimitsUpdateV1 {...props} />
  ),
  [MotionType.SDVTNodeOperatorManagerChange]: (props: GenericDescProps) => (
    <SdvtNodeOperatorManagersChange {...props} />
  ),
  [MotionType.SandboxNodeOperatorIncreaseLimit]: (props: GenericDescProps) => (
    <DescNodeOperatorIncreaseLimit
      {...props}
      motionType={MotionType.SandboxNodeOperatorIncreaseLimit}
    />
  ),
  [MotionType.RccStablesTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.RccStablesTopUp}
    />
  ),
  [MotionType.PmlStablesTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.PmlStablesTopUp}
    />
  ),
  [MotionType.AtcStablesTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.AtcStablesTopUp}
    />
  ),
  [MotionType.SandboxStethAdd]: (props: GenericDescProps) => (
    <AllowedRecipientAdd {...props} registryType={MotionType.SandboxStethAdd} />
  ),
  [MotionType.SandboxStablesAdd]: (props: GenericDescProps) => (
    <AllowedRecipientAdd
      {...props}
      registryType={MotionType.SandboxStablesAdd}
    />
  ),
  [MotionType.SandboxStablesRemove]: (props: GenericDescProps) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.SandboxStablesRemove}
    />
  ),
  [MotionType.SandboxStablesTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.SandboxStablesTopUp}
    />
  ),
  [MotionType.SandboxStethTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.SandboxStethTopUp} />
  ),
  [MotionType.SandboxStethRemove]: (props: GenericDescProps) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.SandboxStethRemove}
    />
  ),
  [MotionType.RccStethTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.RccStethTopUp} />
  ),
  [MotionType.PmlStethTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.PmlStethTopUp} />
  ),
  [MotionType.AtcStethTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.AtcStethTopUp} />
  ),
  [MotionType.LegoStablesTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.LegoStablesTopUp}
    />
  ),
  [MotionType.StonksStablesTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.StonksStablesTopUp}
    />
  ),
  [MotionType.StonksStethTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.StonksStethTopUp} />
  ),
  [MotionType.CSMSettleElStealingPenalty]: (props: GenericDescProps) => (
    <CsmSettleElStealingPenalty {...props} />
  ),
  [MotionType.AllianceOpsStablesTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.AllianceOpsStablesTopUp}
    />
  ),
  [MotionType.EcosystemOpsStablesTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.EcosystemOpsStablesTopUp}
    />
  ),
  [MotionType.LabsOpsStablesTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.LabsOpsStablesTopUp}
    />
  ),
  [MotionType.EcosystemOpsStethTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits
      {...props}
      registryType={MotionType.EcosystemOpsStethTopUp}
    />
  ),
  [MotionType.LabsOpsStethTopUp]: (props: GenericDescProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.LabsOpsStethTopUp} />
  ),
  [MotionType.MEVBoostRelaysAdd]: (props: GenericDescProps) => (
    <MevBoostRelaysAdd {...props} />
  ),
  [MotionType.MEVBoostRelaysEdit]: (props: GenericDescProps) => (
    <MevBoostRelaysEdit {...props} />
  ),
  [MotionType.MEVBoostRelaysRemove]: (props: GenericDescProps) => (
    <MevBoostRelaysRemove {...props} />
  ),
  [MotionType.CSMSetVettedGateTree]: (props: GenericDescProps) => (
    <CsmSetVettedGateTree {...props} />
  ),
  [MotionType.CuratedExitRequestHashesSubmit]: (props: GenericDescProps) => (
    <CuratedExitRequestHashesSubmit {...props} />
  ),
  [MotionType.SDVTExitRequestHashesSubmit]: (props: GenericDescProps) => (
    <SdvtExitRequestHashesSubmit {...props} />
  ),

  // Vaults
  [MotionType.RegisterGroupsInOperatorGrid]: (props: GenericDescProps) => (
    <VaultsRegisterGroupsInOperatorGrid {...props} />
  ),
  [MotionType.RegisterTiersInOperatorGrid]: (props: GenericDescProps) => (
    <VaultsRegisterTiersInOperatorGrid {...props} />
  ),
  [MotionType.UpdateGroupsShareLimit]: (props: GenericDescProps) => (
    <VaultsUpdateGroupsShareLimit {...props} />
  ),
  [MotionType.AlterTiersInOperatorGrid]: (props: GenericDescProps) => (
    <VaultsAlterTiersInOperatorGrid {...props} />
  ),
  [MotionType.SetJailStatusInOperatorGrid]: (props: GenericDescProps) => (
    <VaultsSetJailStatusInOperatorGrid {...props} />
  ),
  [MotionType.UpdateVaultsFeesInOperatorGrid]: (props: GenericDescProps) => (
    <VaultsUpdateVaultsFeesInOperatorGrid {...props} />
  ),
  [MotionType.ForceValidatorExitsInVaultHub]: (props: GenericDescProps) => (
    <VaultsForceValidatorExitsInVaultHub {...props} />
  ),
  [MotionType.SetLiabilitySharesTargetInVaultHub]: (
    props: GenericDescProps,
  ) => <VaultsSetLiabilitySharesTargetInVaultHub {...props} />,
  [MotionType.SocializeBadDebtInVaultHub]: (props: GenericDescProps) => (
    <VaultsSocializeBadDebtInVaultHub {...props} />
  ),

  // Vaults Phase One
  [MotionType.RegisterGroupsInOperatorGridPhaseOne]: (
    props: GenericDescProps,
  ) => <VaultsRegisterGroupsInOperatorGrid {...props} />,
  [MotionType.UpdateGroupsShareLimitPhaseOne]: (props: GenericDescProps) => (
    <VaultsUpdateGroupsShareLimit {...props} />
  ),
  [MotionType.AlterTiersInOperatorGridPhaseOne]: (props: GenericDescProps) => (
    <VaultsAlterTiersInOperatorGrid {...props} />
  ),
  [MotionType.SetJailStatusInOperatorGridPhaseOne]: (
    props: GenericDescProps,
  ) => <VaultsSetJailStatusInOperatorGrid {...props} />,
  [MotionType.UpdateVaultsFeesInOperatorGridPhaseOne]: (
    props: GenericDescProps,
  ) => <VaultsUpdateVaultsFeesInOperatorGrid {...props} />,
  [MotionType.ForceValidatorExitsInVaultHubPhaseOne]: (
    props: GenericDescProps,
  ) => <VaultsForceValidatorExitsInVaultHub {...props} />,
  [MotionType.SocializeBadDebtInVaultHubPhaseOne]: (
    props: GenericDescProps,
  ) => <VaultsSocializeBadDebtInVaultHub {...props} />,
} as const;

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
    return <>Unrecognized motion type</>;
  }

  if (!callData || isLoading) {
    return <>Loading...</>;
  }

  const Desc: React.FunctionComponent<GenericDescProps> =
    MOTION_DESCRIPTIONS[motionType as MotionType];

  return (
    <Text size={14} weight={400} color="secondary" as="div">
      <Desc callData={callData} isOnChain={motion.isOnChain} />
    </Text>
  );
};
