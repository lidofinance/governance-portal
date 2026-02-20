import { MotionTypeForms } from '../motion-types';
import { validateGateTreeIpfs } from './validate-gate-tree-ipfs';
import { getDefaultFormPartsData, formParts } from '../start-motion/parts';

type MotionFormData<M extends keyof typeof formParts> = ReturnType<
  typeof getDefaultFormPartsData
>[M];

// Separate validation map for all motion types (including ones without form parts)
const EXTRA_VALIDATION_MAP: Record<
  string,
  (data: any) => Promise<string | null> | string | null
> = {
  [MotionTypeForms.CSMSetVettedGateTree]: validateGateTreeIpfs,
};

export const validateMotionExtraData = <M extends keyof typeof formParts>(
  motionType: M,
  formValues: MotionFormData<M>,
) => {
  const validateFn = EXTRA_VALIDATION_MAP[motionType as string];

  if (!validateFn) {
    return null;
  }

  return validateFn(formValues);
};
