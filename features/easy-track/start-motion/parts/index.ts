import { MotionTypeForms } from '../../motion-types';
import * as StartNewTopUpWithLimitsAndCustomToken from './start-new-top-up-with-limits-and-custom-token';
import * as formAllowedRecipientAdd from './start-new-allowed-recipient-add';
import * as StartNewTopUpWithLimits from './start-new-top-up-with-limits';

export const formParts = {
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
  [MotionTypeForms.LegoLDOTopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.LegoLDOTopUp,
  }),
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
