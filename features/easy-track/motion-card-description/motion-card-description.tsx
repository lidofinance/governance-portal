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

import { Abi } from 'viem';
import { Motion } from '../types';
import { MotionType } from '../motion-types';
import { EvmUnrecognized } from '../evm-addresses';
import { getMotionTypeByScriptFactory } from '../utils/get-motion-type';
import { MotionDescriptionProps } from './types';
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

type GenericDescProps = MotionDescriptionProps<Abi>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DescDispatchProps = { callData: any; isOnChain?: boolean };

const MOTION_DESCRIPTIONS = {
  [MotionType.NodeOperatorIncreaseLimit]: (props: DescDispatchProps) => (
    <DescNodeOperatorIncreaseLimit
      {...props}
      motionType={MotionType.NodeOperatorIncreaseLimit}
    />
  ),
  [MotionType.LEGOTopUp]: (props: DescDispatchProps) => (
    <LEGOTopUp {...props} />
  ),
  [MotionType.RewardProgramAdd]: (props: DescDispatchProps) => (
    <RewardProgramAdd {...props} />
  ),
  [MotionType.RewardProgramTopUp]: (props: DescDispatchProps) => (
    <RewardProgramTopUp {...props} />
  ),
  [MotionType.RewardProgramRemove]: (props: DescDispatchProps) => (
    <RewardProgramRemove {...props} />
  ),
  [MotionType.ReferralPartnerAdd]: (props: DescDispatchProps) => (
    <ReferralPartnerAdd {...props} />
  ),
  [MotionType.ReferralPartnerTopUp]: (props: DescDispatchProps) => (
    <ReferralPartnerTopUp {...props} />
  ),
  [MotionType.ReferralPartnerRemove]: (props: DescDispatchProps) => (
    <ReferralPartnerRemove {...props} />
  ),
  [MotionType.AllowedRecipientAdd]: (props: DescDispatchProps) => (
    <AllowedRecipientAdd
      {...props}
      registryType={MotionType.AllowedRecipientAdd}
    />
  ),
  [MotionType.AllowedRecipientRemove]: (props: DescDispatchProps) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.AllowedRecipientRemove}
    />
  ),
  [MotionType.AllowedRecipientTopUp]: (props: DescDispatchProps) => (
    <AllowedRecipientTopUp
      {...props}
      registryType={MotionType.AllowedRecipientTopUp}
    />
  ),
  [MotionType.AllowedRecipientAddReferralDai]: (props: DescDispatchProps) => (
    <AllowedRecipientAdd
      {...props}
      registryType={MotionType.AllowedRecipientAddReferralDai}
    />
  ),
  [MotionType.AllowedRecipientRemoveReferralDai]: (
    props: DescDispatchProps,
  ) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.AllowedRecipientRemoveReferralDai}
    />
  ),
  [MotionType.AllowedRecipientTopUpReferralDai]: (props: DescDispatchProps) => (
    <AllowedRecipientTopUp
      {...props}
      registryType={MotionType.AllowedRecipientTopUpReferralDai}
    />
  ),
  [MotionType.AllowedRecipientTopUpTrpLdo]: (props: DescDispatchProps) => (
    <AllowedRecipientTopUp
      {...props}
      registryType={MotionType.AllowedRecipientTopUpTrpLdo}
    />
  ),
  [MotionType.LegoLDOTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.LegoLDOTopUp} />
  ),
  [MotionType.LegoDAITopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.LegoDAITopUp} />
  ),
  [MotionType.RccDAITopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.RccDAITopUp} />
  ),
  [MotionType.PmlDAITopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.PmlDAITopUp} />
  ),
  [MotionType.AtcDAITopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.AtcDAITopUp} />
  ),
  [MotionType.GasFunderETHTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.GasFunderETHTopUp} />
  ),
  [MotionType.StethRewardProgramAdd]: (props: DescDispatchProps) => (
    <AllowedRecipientAdd
      {...props}
      registryType={MotionType.StethRewardProgramAdd}
    />
  ),
  [MotionType.StethRewardProgramRemove]: (props: DescDispatchProps) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.StethRewardProgramRemove}
    />
  ),
  [MotionType.StethRewardProgramTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits
      {...props}
      registryType={MotionType.StethRewardProgramTopUp}
    />
  ),

  [MotionType.StethGasSupplyAdd]: (props: DescDispatchProps) => (
    <AllowedRecipientAdd
      {...props}
      registryType={MotionType.StethGasSupplyAdd}
    />
  ),
  [MotionType.StethGasSupplyRemove]: (props: DescDispatchProps) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.StethGasSupplyRemove}
    />
  ),
  [MotionType.StethGasSupplyTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.StethGasSupplyTopUp} />
  ),
  [MotionType.RewardsShareProgramAdd]: (props: DescDispatchProps) => (
    <AllowedRecipientAdd
      {...props}
      registryType={MotionType.RewardsShareProgramAdd}
    />
  ),
  [MotionType.RewardsShareProgramRemove]: (props: DescDispatchProps) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.RewardsShareProgramRemove}
    />
  ),
  [MotionType.RewardsShareProgramTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits
      {...props}
      registryType={MotionType.RewardsShareProgramTopUp}
    />
  ),
  [MotionType.SDVTNodeOperatorsAdd]: (props: DescDispatchProps) => (
    <SdvtNodeOperatorsAdd {...props} />
  ),
  [MotionType.SDVTNodeOperatorsActivate]: (props: DescDispatchProps) => (
    <SdvtNodeOperatorsActivate {...props} />
  ),
  [MotionType.SDVTNodeOperatorsDeactivate]: (props: DescDispatchProps) => (
    <SdvtNodeOperatorsDeactivate {...props} />
  ),
  [MotionType.SDVTVettedValidatorsLimitsSet]: (props: DescDispatchProps) => (
    <SdvtVettedValidatorsLimitsSet {...props} />
  ),
  [MotionType.SDVTNodeOperatorRewardAddressesSet]: (
    props: DescDispatchProps,
  ) => <SdvtNodeOperatorRewardAddressesSet {...props} />,
  [MotionType.SDVTNodeOperatorNamesSet]: (props: DescDispatchProps) => (
    <SdvtNodeOperatorNamesSet {...props} />
  ),
  [MotionType.SDVTTargetValidatorLimitsUpdateV2]: (
    props: DescDispatchProps,
  ) => <SdvtTargetValidatorLimitsUpdateV2 {...props} />,
  [MotionType.SDVTTargetValidatorLimitsUpdateV1]: (
    props: DescDispatchProps,
  ) => <SdvtTargetValidatorLimitsUpdateV1 {...props} />,
  [MotionType.SDVTNodeOperatorManagerChange]: (props: DescDispatchProps) => (
    <SdvtNodeOperatorManagersChange {...props} />
  ),
  [MotionType.SandboxNodeOperatorIncreaseLimit]: (props: DescDispatchProps) => (
    <DescNodeOperatorIncreaseLimit
      {...props}
      motionType={MotionType.SandboxNodeOperatorIncreaseLimit}
    />
  ),
  [MotionType.RccStablesTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.RccStablesTopUp}
    />
  ),
  [MotionType.PmlStablesTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.PmlStablesTopUp}
    />
  ),
  [MotionType.AtcStablesTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.AtcStablesTopUp}
    />
  ),
  [MotionType.SandboxStethAdd]: (props: DescDispatchProps) => (
    <AllowedRecipientAdd {...props} registryType={MotionType.SandboxStethAdd} />
  ),
  [MotionType.SandboxStablesAdd]: (props: DescDispatchProps) => (
    <AllowedRecipientAdd
      {...props}
      registryType={MotionType.SandboxStablesAdd}
    />
  ),
  [MotionType.SandboxStablesRemove]: (props: DescDispatchProps) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.SandboxStablesRemove}
    />
  ),
  [MotionType.SandboxStablesTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.SandboxStablesTopUp}
    />
  ),
  [MotionType.SandboxStethTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.SandboxStethTopUp} />
  ),
  [MotionType.SandboxStethRemove]: (props: DescDispatchProps) => (
    <AllowedRecipientRemove
      {...props}
      registryType={MotionType.SandboxStethRemove}
    />
  ),
  [MotionType.RccStethTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.RccStethTopUp} />
  ),
  [MotionType.PmlStethTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.PmlStethTopUp} />
  ),
  [MotionType.AtcStethTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.AtcStethTopUp} />
  ),
  [MotionType.LegoStablesTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.LegoStablesTopUp}
    />
  ),
  [MotionType.StonksStablesTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.StonksStablesTopUp}
    />
  ),
  [MotionType.StonksStethTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.StonksStethTopUp} />
  ),
  [MotionType.CSMSettleElStealingPenalty]: (props: DescDispatchProps) => (
    <CsmSettleElStealingPenalty {...props} />
  ),
  [MotionType.AllianceOpsStablesTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.AllianceOpsStablesTopUp}
    />
  ),
  [MotionType.EcosystemOpsStablesTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.EcosystemOpsStablesTopUp}
    />
  ),
  [MotionType.LabsOpsStablesTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimitsAndCustomToken
      {...props}
      registryType={MotionType.LabsOpsStablesTopUp}
    />
  ),
  [MotionType.EcosystemOpsStethTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits
      {...props}
      registryType={MotionType.EcosystemOpsStethTopUp}
    />
  ),
  [MotionType.LabsOpsStethTopUp]: (props: DescDispatchProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.LabsOpsStethTopUp} />
  ),
  [MotionType.MEVBoostRelaysAdd]: (props: DescDispatchProps) => (
    <MevBoostRelaysAdd {...props} />
  ),
  [MotionType.MEVBoostRelaysEdit]: (props: DescDispatchProps) => (
    <MevBoostRelaysEdit {...props} />
  ),
  [MotionType.MEVBoostRelaysRemove]: (props: DescDispatchProps) => (
    <MevBoostRelaysRemove {...props} />
  ),
  [MotionType.CSMSetVettedGateTree]: (props: DescDispatchProps) => (
    <CsmSetVettedGateTree {...props} />
  ),
  [MotionType.CuratedExitRequestHashesSubmit]: (props: DescDispatchProps) => (
    <CuratedExitRequestHashesSubmit {...props} />
  ),
  [MotionType.SDVTExitRequestHashesSubmit]: (props: DescDispatchProps) => (
    <SdvtExitRequestHashesSubmit {...props} />
  ),

  // Vaults
  [MotionType.RegisterGroupsInOperatorGrid]: (props: DescDispatchProps) => (
    <VaultsRegisterGroupsInOperatorGrid {...props} />
  ),
  [MotionType.RegisterTiersInOperatorGrid]: (props: DescDispatchProps) => (
    <VaultsRegisterTiersInOperatorGrid {...props} />
  ),
  [MotionType.UpdateGroupsShareLimit]: (props: DescDispatchProps) => (
    <VaultsUpdateGroupsShareLimit {...props} />
  ),
  [MotionType.AlterTiersInOperatorGrid]: (props: DescDispatchProps) => (
    <VaultsAlterTiersInOperatorGrid {...props} />
  ),
  [MotionType.SetJailStatusInOperatorGrid]: (props: DescDispatchProps) => (
    <VaultsSetJailStatusInOperatorGrid {...props} />
  ),
  [MotionType.UpdateVaultsFeesInOperatorGrid]: (props: DescDispatchProps) => (
    <VaultsUpdateVaultsFeesInOperatorGrid {...props} />
  ),
  [MotionType.ForceValidatorExitsInVaultHub]: (props: DescDispatchProps) => (
    <VaultsForceValidatorExitsInVaultHub {...props} />
  ),
  [MotionType.SetLiabilitySharesTargetInVaultHub]: (
    props: DescDispatchProps,
  ) => <VaultsSetLiabilitySharesTargetInVaultHub {...props} />,
  [MotionType.SocializeBadDebtInVaultHub]: (props: DescDispatchProps) => (
    <VaultsSocializeBadDebtInVaultHub {...props} />
  ),

  // Vaults Phase One
  [MotionType.RegisterGroupsInOperatorGridPhaseOne]: (
    props: DescDispatchProps,
  ) => <VaultsRegisterGroupsInOperatorGrid {...props} />,
  [MotionType.UpdateGroupsShareLimitPhaseOne]: (props: DescDispatchProps) => (
    <VaultsUpdateGroupsShareLimit {...props} />
  ),
  [MotionType.AlterTiersInOperatorGridPhaseOne]: (props: DescDispatchProps) => (
    <VaultsAlterTiersInOperatorGrid {...props} />
  ),
  [MotionType.SetJailStatusInOperatorGridPhaseOne]: (
    props: DescDispatchProps,
  ) => <VaultsSetJailStatusInOperatorGrid {...props} />,
  [MotionType.UpdateVaultsFeesInOperatorGridPhaseOne]: (
    props: DescDispatchProps,
  ) => <VaultsUpdateVaultsFeesInOperatorGrid {...props} />,
  [MotionType.ForceValidatorExitsInVaultHubPhaseOne]: (
    props: DescDispatchProps,
  ) => <VaultsForceValidatorExitsInVaultHub {...props} />,
  [MotionType.SocializeBadDebtInVaultHubPhaseOne]: (
    props: DescDispatchProps,
  ) => <VaultsSocializeBadDebtInVaultHub {...props} />,
} as const;

type Props = {
  motion: Motion;
  textSize?: 'default' | 'small';
};

export const MotionDescription = ({ motion, textSize }: Props) => {
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
      <Text size={12} color="warning">
        Unrecognized motion type
      </Text>
    );
  }

  if (!callData || isLoading) {
    return <>Loading...</>;
  }

  const Desc: React.FunctionComponent<GenericDescProps> =
    MOTION_DESCRIPTIONS[motionType as MotionType];

  return (
    <Text
      size={textSize === 'small' ? 12 : 14}
      weight={400}
      color="secondary"
      as="div"
    >
      <ErrorBoundary fallback={<>Failed to render motion description</>}>
        <Desc callData={callData} isOnChain={motion.isOnChain} />
      </ErrorBoundary>
    </Text>
  );
};
