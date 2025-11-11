import { useSWR } from 'modules/network/hooks/useSwr';
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3';
import { useContractEvmScript } from 'modules/motions/hooks/useContractEvmScript';

import { DescLEGOTopUp } from './lego';
import {
  DescReferralPartnerAdd,
  DescReferralPartnerTopUp,
  DescReferralPartnerRemove,
} from './referral-partner';
import {
  DescRewardProgramAdd,
  DescRewardProgramTopUp,
  DescRewardProgramRemove,
} from './reward-program';
import {
  DescAllowedRecipientAdd,
  DescAllowedRecipientTopUp,
  DescAllowedRecipientRemove,
} from './allowed-recipient';

import { TopUpWithLimits } from './top-up-with-limits';
import { TopUpWithLimitsAndCustomToken } from './top-up-with-limits-and-custom-token';

import {
  TopUpWithLimitsAbi,
  RemoveAllowedRecipientAbi,
  AddAllowedRecipientAbi,
  EvmIncreaseNodeOperatorStakingLimitAbi,
} from 'generated';
import { Motion, MotionType } from 'modules/motions/types';
import { EvmUnrecognized } from 'modules/motions/evmAddresses';
import { getMotionTypeByScriptFactory } from 'modules/motions/utils/getMotionType';
import { NestProps } from './types';
import { DescWrap } from './MotionDescriptionStyle';
import { SdvtNodeOperatorsDeactivate } from './sdvt-node-operators-deactivate';
import { SdvtNodeOperatorsActivate } from './sdvt-node-operators-activate';
import { SdvtVettedValidatorsLimitsSet } from './sdvt-vetted-validators-limits-set';
import { SdvtTargetValidatorLimitsUpdateV1 } from './sdvt-target-validator-limits-updateV1';
import { SdvtTargetValidatorLimitsUpdateV2 } from './sdvt-target-validator-limits-update-v2';
import { SdvtNodeOperatorRewardAddressesSet } from './sdvt-node-operator-reward-addresses-set';
import { SdvtNodeOperatorNamesSet } from './sdvt-node-operator-names-set';
import { SdvtNodeOperatorsAdd } from './sdvt-node-operators-add';
import { SdvtNodeOperatorManagersChange } from './sdvt-node-operator-managers-change';
import { DescNodeOperatorIncreaseLimit } from './node-operator-limit-increase';
import { CsmSettleElStealingPenalty } from './csm-settle-el-stealing-penalty';
import { MevBoostRelaysAdd } from './mev-boost-relays-add';
import { MevBoostRelaysEdit } from './mev-boost-relays-edit';
import { MevBoostRelaysRemove } from './mev-boost-relays-remove';
import { CsmSetVettedGateTree } from './csm-set-vetted-gate-tree';
import { CuratedExitRequestHashesSubmit } from './curated-exit-request-hashes-submit';
import { SdvtExitRequestHashesSubmit } from './sdvt-exit-request-hashes-submit';

type DescWithLimitsProps = NestProps<
  TopUpWithLimitsAbi['decodeEVMScriptCallData']
>;
type DescAllowedRecipientRemoveProps = NestProps<
  RemoveAllowedRecipientAbi['decodeEVMScriptCallData']
>;
type DescAllowedRecipientAddProps = NestProps<
  AddAllowedRecipientAbi['decodeEVMScriptCallData']
>;

type DescNodeOperatorIncreaseLimitProps = NestProps<
  EvmIncreaseNodeOperatorStakingLimitAbi['decodeEVMScriptCallData']
>;

type GenericDescProps = {
  isOnChain?: boolean;
  callData: any;
};

const MOTION_DESCRIPTIONS = {
  [MotionType.NodeOperatorIncreaseLimit]: (
    props: DescNodeOperatorIncreaseLimitProps,
  ) => (
    <DescNodeOperatorIncreaseLimit
      {...props}
      motionType={MotionType.NodeOperatorIncreaseLimit}
    />
  ),
  [MotionType.LEGOTopUp]: DescLEGOTopUp,
  [MotionType.RewardProgramAdd]: DescRewardProgramAdd,
  [MotionType.RewardProgramTopUp]: DescRewardProgramTopUp,
  [MotionType.RewardProgramRemove]: DescRewardProgramRemove,
  [MotionType.ReferralPartnerAdd]: DescReferralPartnerAdd,
  [MotionType.ReferralPartnerTopUp]: DescReferralPartnerTopUp,
  [MotionType.ReferralPartnerRemove]: DescReferralPartnerRemove,
  [MotionType.AllowedRecipientAdd]: (props: GenericDescProps) => (
    <DescAllowedRecipientAdd
      {...props}
      registryType={MotionType.AllowedRecipientAdd}
    />
  ),
  [MotionType.AllowedRecipientRemove]: (
    props: DescAllowedRecipientRemoveProps,
  ) => (
    <DescAllowedRecipientRemove
      {...props}
      registryType={MotionType.AllowedRecipientRemove}
    />
  ),
  [MotionType.AllowedRecipientTopUp]: (props: DescWithLimitsProps) => (
    <DescAllowedRecipientTopUp
      {...props}
      registryType={MotionType.AllowedRecipientTopUp}
    />
  ),
  [MotionType.AllowedRecipientAddReferralDai]: (
    props: DescAllowedRecipientAddProps,
  ) => (
    <DescAllowedRecipientAdd
      {...props}
      registryType={MotionType.AllowedRecipientAddReferralDai}
    />
  ),
  [MotionType.AllowedRecipientRemoveReferralDai]: (
    props: DescAllowedRecipientRemoveProps,
  ) => (
    <DescAllowedRecipientRemove
      {...props}
      registryType={MotionType.AllowedRecipientRemoveReferralDai}
    />
  ),
  [MotionType.AllowedRecipientTopUpReferralDai]: (
    props: DescWithLimitsProps,
  ) => (
    <DescAllowedRecipientTopUp
      {...props}
      registryType={MotionType.AllowedRecipientTopUpReferralDai}
    />
  ),
  [MotionType.AllowedRecipientTopUpTrpLdo]: (props: DescWithLimitsProps) => (
    <DescAllowedRecipientTopUp
      {...props}
      registryType={MotionType.AllowedRecipientTopUpTrpLdo}
    />
  ),
  [MotionType.LegoLDOTopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.LegoLDOTopUp} />
  ),
  [MotionType.LegoDAITopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.LegoDAITopUp} />
  ),
  [MotionType.RccDAITopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.RccDAITopUp} />
  ),
  [MotionType.PmlDAITopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.PmlDAITopUp} />
  ),
  [MotionType.AtcDAITopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.AtcDAITopUp} />
  ),
  [MotionType.GasFunderETHTopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.GasFunderETHTopUp} />
  ),
  [MotionType.StethRewardProgramAdd]: (props: DescAllowedRecipientAddProps) => (
    <DescAllowedRecipientAdd
      {...props}
      registryType={MotionType.StethRewardProgramAdd}
    />
  ),
  [MotionType.StethRewardProgramRemove]: (
    props: DescAllowedRecipientRemoveProps,
  ) => (
    <DescAllowedRecipientRemove
      {...props}
      registryType={MotionType.StethRewardProgramRemove}
    />
  ),
  [MotionType.StethRewardProgramTopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits
      {...props}
      registryType={MotionType.StethRewardProgramTopUp}
    />
  ),

  [MotionType.StethGasSupplyAdd]: (props: DescAllowedRecipientAddProps) => (
    <DescAllowedRecipientAdd
      {...props}
      registryType={MotionType.StethGasSupplyAdd}
    />
  ),
  [MotionType.StethGasSupplyRemove]: (
    props: DescAllowedRecipientRemoveProps,
  ) => (
    <DescAllowedRecipientRemove
      {...props}
      registryType={MotionType.StethGasSupplyRemove}
    />
  ),
  [MotionType.StethGasSupplyTopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.StethGasSupplyTopUp} />
  ),

  [MotionType.RewardsShareProgramAdd]: (
    props: DescAllowedRecipientAddProps,
  ) => (
    <DescAllowedRecipientAdd
      {...props}
      registryType={MotionType.RewardsShareProgramAdd}
    />
  ),
  [MotionType.RewardsShareProgramRemove]: (
    props: DescAllowedRecipientRemoveProps,
  ) => (
    <DescAllowedRecipientRemove
      {...props}
      registryType={MotionType.RewardsShareProgramRemove}
    />
  ),
  [MotionType.RewardsShareProgramTopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits
      {...props}
      registryType={MotionType.RewardsShareProgramTopUp}
    />
  ),
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
  [MotionType.SandboxNodeOperatorIncreaseLimit]: (
    props: DescNodeOperatorIncreaseLimitProps,
  ) => (
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
  [MotionType.SandboxStablesAdd]: (props: DescAllowedRecipientAddProps) => (
    <DescAllowedRecipientAdd
      {...props}
      registryType={MotionType.SandboxStablesAdd}
    />
  ),
  [MotionType.SandboxStablesRemove]: (
    props: DescAllowedRecipientRemoveProps,
  ) => (
    <DescAllowedRecipientRemove
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
  [MotionType.RccStethTopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.RccStethTopUp} />
  ),
  [MotionType.PmlStethTopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.PmlStethTopUp} />
  ),
  [MotionType.AtcStethTopUp]: (props: DescWithLimitsProps) => (
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
  [MotionType.StonksStethTopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.StonksStethTopUp} />
  ),
  [MotionType.CSMSettleElStealingPenalty]: CsmSettleElStealingPenalty,
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
  [MotionType.EcosystemOpsStethTopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits
      {...props}
      registryType={MotionType.EcosystemOpsStethTopUp}
    />
  ),
  [MotionType.LabsOpsStethTopUp]: (props: DescWithLimitsProps) => (
    <TopUpWithLimits {...props} registryType={MotionType.LabsOpsStethTopUp} />
  ),
  [MotionType.MEVBoostRelaysAdd]: MevBoostRelaysAdd,
  [MotionType.MEVBoostRelaysEdit]: MevBoostRelaysEdit,
  [MotionType.MEVBoostRelaysRemove]: MevBoostRelaysRemove,
  [MotionType.CSMSetVettedGateTree]: CsmSetVettedGateTree,
  [MotionType.CuratedExitRequestHashesSubmit]: CuratedExitRequestHashesSubmit,
  [MotionType.SDVTExitRequestHashesSubmit]: SdvtExitRequestHashesSubmit,
} as const;

type Props = {
  motion: Motion;
};

export const MotionDescription = ({ motion }: Props) => {
  const { chainId } = useWeb3();
  const motionType = getMotionTypeByScriptFactory(
    chainId,
    motion.evmScriptFactory,
  );
  const contract = useContractEvmScript(motionType);
  const callDataRaw = motion.evmScriptCalldata;

  const { data: callData, initialLoading } = useSWR(
    `call-data-${chainId}-${motion.id}`,
    () => {
      if (motionType === EvmUnrecognized || !contract || !callDataRaw) {
        return null;
      }
      return contract.decodeEVMScriptCallData(callDataRaw);
    },
  );

  if (motionType === EvmUnrecognized) {
    return <>Unrecognized motion type</>;
  }

  if (!callData || initialLoading) {
    return <>Loading...</>;
  }

  const Desc: React.FunctionComponent<GenericDescProps> =
    MOTION_DESCRIPTIONS[motionType];

  return (
    <DescWrap>
      <Desc callData={callData} isOnChain={motion.isOnChain} />
    </DescWrap>
  );
};
