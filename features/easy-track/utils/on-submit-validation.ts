import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { getDefaultFormPartsData } from '@easy-track/start-motion/parts';
import { MotionType, MotionTypeForms } from '@easy-track/motion-types';
import { validateGateTreeIpfs } from '@easy-track/utils/validate-gate-tree-ipfs';
import { validateForceExits } from '@easy-track/utils/validate-force-exits';
import { validateCreateOrUpdateOperatorGroup } from '@easy-track/utils/validate-create-or-update-operator-group';
import { PublicClient } from 'viem';

type FormPartsData = ReturnType<typeof getDefaultFormPartsData>;
type MotionFormData<M extends MotionTypeForms> = M extends keyof FormPartsData
  ? FormPartsData[M]
  : never;

type ChainData = {
  chainId: CHAINS;
  provider: PublicClient;
};

type ValidateFn<M extends MotionTypeForms> = (
  formData: MotionFormData<M>,
  chainData: ChainData,
) => Promise<string | null> | string | null;

const EXTRA_VALIDATION_MAP: {
  [K in MotionTypeForms]?: ValidateFn<K>;
} = {
  [MotionType.CSMSetVettedGateTree]: validateGateTreeIpfs,
  [MotionType.ForceValidatorExitsInVaultHub]: validateForceExits,
  [MotionType.CreateOrUpdateOperatorGroup]: validateCreateOrUpdateOperatorGroup,
};

export const validateMotionExtraData = <M extends MotionTypeForms>(
  motionType: M,
  formValues: MotionFormData<M>,
  chainData: ChainData,
) => {
  const validateFn = (
    EXTRA_VALIDATION_MAP as Partial<Record<MotionTypeForms, ValidateFn<M>>>
  )[motionType];

  if (!validateFn) {
    return null;
  }

  return validateFn(formValues, chainData);
};
