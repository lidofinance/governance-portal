import { MotionTypeForms } from '../../motion-types';

import * as formAllowedRecipientAdd from './start-new-allowed-recipient-add';
import * as formAllowedRecipientTopUp from './start-new-allowed-recipient-top-up';

import * as StartNewTopUpWithLimitsAndCustomToken from './start-new-top-up-with-limits-and-custom-token';
import * as formAllowedRecipientRemove from './start-new-allowed-recipient-remove';
import * as StartNewTopUpWithLimits from './start-new-top-up-with-limits';
import * as StartNewExitRequestHashesSubmit from './start-new-exit-request-hashes-submit';
import * as StartNewMEVBoostRelaysAdd from './start-new-mev-boost-relays-add';
import * as StartNewMEVBoostRelaysEdit from './start-new-mev-boost-relays-edit';
import * as StartNewMEVBoostRelaysRemove from './start-new-mev-boost-relays-remove';
import * as StartNewCSMSetVettedGateTree from './start-new-csm-set-vetted-gate-tree';
import * as StartNewCSMSettleElStealingPenalty from './start-new-csm-settle-el-stealing-penalty';

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
  [MotionTypeForms.SandboxStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.SandboxStablesTopUp,
    }),
  [MotionTypeForms.LegoStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.LegoStablesTopUp,
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
  [MotionTypeForms.LegoLDOTopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.LegoLDOTopUp,
  }),
  [MotionTypeForms.MEVBoostRelaysAdd]: StartNewMEVBoostRelaysAdd.formParts,
  [MotionTypeForms.MEVBoostRelaysEdit]: StartNewMEVBoostRelaysEdit.formParts,
  [MotionTypeForms.MEVBoostRelaysRemove]:
    StartNewMEVBoostRelaysRemove.formParts,
  [MotionTypeForms.CSMSetVettedGateTree]:
    StartNewCSMSetVettedGateTree.formParts,
  [MotionTypeForms.CSMSettleElStealingPenalty]:
    StartNewCSMSettleElStealingPenalty.formParts,
  [MotionTypeForms.CuratedExitRequestHashesSubmit]:
    StartNewExitRequestHashesSubmit.formParts('curated'),
  [MotionTypeForms.SDVTExitRequestHashesSubmit]:
    StartNewExitRequestHashesSubmit.formParts('sdvt'),
} as const;

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
