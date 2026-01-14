import { MotionTypeForms } from '../../motion-types';
import * as StartNewTopUpWithLimitsAndCustomToken from './start-new-top-up-with-limits-and-custom-token';

export const formParts = {
  [MotionTypeForms.SandboxStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.SandboxStablesTopUp,
    }),
  [MotionTypeForms.LegoStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.LegoStablesTopUp,
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
