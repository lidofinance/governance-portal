import type { PopulatedTransaction } from 'ethers';
import { MotionType } from '../../motion-types';
import { Address } from 'viem';
import { easyTrackAbi } from 'abi/generated';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';

export type PopulateTxArgs<FormData> = {
  evmScriptFactory: string;
  formData: FormData;
  contract: {
    write: ReturnType<typeof useWriteContract<typeof easyTrackAbi>>;
    address: Address;
  };
};

type Args<FormData> = {
  motionType: MotionType;

  populateTx: (
    args: PopulateTxArgs<FormData>,
  ) => Promise<PopulatedTransaction | `0x${string}`>;

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
