import type { PopulatedTransaction } from 'ethers';
import { MotionType } from '../../motion-types';

type Args<FormData> = {
  motionType: MotionType;

  populateTx: (args: {
    formData: FormData;
    evmScriptFactory: string;
    contract: any;
  }) => Promise<PopulatedTransaction | `0x${string}`>;

  getDefaultFormData: () => FormData;

  Component: React.ComponentType<{
    fieldNames: Record<keyof FormData, string>;
    submitAction: React.ReactNode;
  }>;
};

export const createMotionFormPart = <FormData extends object>({
  motionType,
  populateTx,
  Component,
  getDefaultFormData,
}: Args<FormData>) => {
  const fieldNames = Object.keys(getDefaultFormData()).reduce(
    (res, key) => ({
      ...res,
      [key]: `${motionType}.${key}`,
    }),
    {} as Record<keyof FormData, string>,
  );
  return {
    populateTx,
    getDefaultFormData,
    fieldNames,
    Component,
  };
};
