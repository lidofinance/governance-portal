import { MotionType } from '../../motion-types';
import { Address } from 'viem';
import { easyTrackAbi } from 'abi/generated';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import type { ContractObject } from 'shared/blockchain/types';
import { MOTION_TYPE_ABI_MAP } from '../../hooks/use-decode-evm-script-call-data';
import { EvmAddressesByType } from '../../evm-addresses';

export type PopulateTxArgs<FormData> = {
  evmScriptFactory: Address;
  formData: FormData;
  contract: {
    write: ReturnType<typeof useWriteContract<typeof easyTrackAbi>>;
    address: Address;
  };
};

export type FactoryContractObject<M extends MotionType> = ContractObject<
  (typeof MOTION_TYPE_ABI_MAP)[M]
>;

type Args<FormData, M extends MotionType> = {
  motionType: M;

  populateTx: (args: PopulateTxArgs<FormData>) => Promise<`0x${string}`>;

  getDefaultFormData: () => FormData;

  Component: React.ComponentType<{
    fieldNames: Record<keyof FormData, string>;
    submitAction: React.ReactNode;
    factory: FactoryContractObject<M>;
  }>;
};

export const createMotionFormPart = <
  FormData extends object,
  M extends MotionType,
>({
  motionType,
  populateTx,
  Component,
  getDefaultFormData,
}: Args<FormData, M>) => {
  const fieldNames = Object.keys(getDefaultFormData()).reduce(
    (res, key) => ({
      ...res,
      [key]: `${motionType}.${key}`,
    }),
    {} as Record<keyof FormData, string>,
  );

  const factory: FactoryContractObject<M> = {
    name: motionType,
    abi: MOTION_TYPE_ABI_MAP[motionType],
    chainAddressMap: EvmAddressesByType[motionType],
  };

  return {
    populateTx,
    getDefaultFormData,
    fieldNames,
    factory,
    Component,
  };
};

export type AnyFormPart = ReturnType<
  typeof createMotionFormPart<Record<string, unknown>, MotionType>
>;
