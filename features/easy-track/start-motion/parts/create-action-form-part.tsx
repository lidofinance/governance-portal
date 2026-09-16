import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Option } from '@lidofinance/lido-ui';
import { encodeAbiParameters, getAbiItem, type Hex } from 'viem';
import { PageLoader } from 'shared/components/page-loader';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import {
  FACTORIES,
  type ActionFactoryName,
  type FactoryAction,
} from '../../factories-metadata';
import { MOTION_TYPE_ABI_MAP } from '../../hooks/use-decode-evm-script-call-data';
import {
  createMotionFormPart,
  type FactoryContractObject,
} from './create-motion-form-part';
import { Fieldset, MessageBox } from './style';

// Encodes calldata as (Action, bytes) and uses factory metadata for action titles.
// Each factory provides its action fields, validation, and payload encoders.

export type ActionFormData = { action: string };

type Args<FormData extends ActionFormData, M extends ActionFactoryName> = {
  motionType: M;
  requiresTrustedCaller?: boolean;
  getDefaultFormData: () => FormData;
  actions: Record<
    FactoryAction<M>,
    {
      encode: (formData: FormData) => Hex;
      Fields: React.ComponentType<{
        fieldNames: Record<keyof FormData, string>;
      }>;
    }
  >;
};

export const createActionFormPart = <
  FormData extends ActionFormData,
  M extends ActionFactoryName,
>({
  motionType,
  requiresTrustedCaller = false,
  getDefaultFormData,
  actions,
}: Args<FormData, M>) => {
  const actionTitles = FACTORIES[motionType].actionTitles;
  const abi: (typeof MOTION_TYPE_ABI_MAP)[ActionFactoryName] =
    MOTION_TYPE_ABI_MAP[motionType];

  // Reject factories whose calldata envelope differs from (Action, bytes).
  const envelopeParams: readonly [{ type: 'uint8' }, { type: 'bytes' }] =
    getAbiItem({
      abi,
      name: 'decodeEVMScriptCallData',
    }).outputs;

  const parseAction = (value: unknown): FactoryAction<M> | null => {
    const ordinal = actionTitles.findIndex(
      (_, index) => String(index) === value,
    );
    // The lookup accepts only ordinals present in this factory's title tuple.
    if (ordinal === -1) {
      return null;
    }
    return ordinal as FactoryAction<M>;
  };

  const encodeCallData = (formData: FormData): Hex => {
    const action = parseAction(formData.action);
    if (action === null) {
      throw new Error(`Invalid action for ${motionType}`);
    }

    return encodeAbiParameters(envelopeParams, [
      action,
      actions[action].encode(formData),
    ]);
  };

  const Component = ({
    fieldNames,
    submitAction,
    factory,
  }: {
    fieldNames: Record<keyof FormData, string>;
    submitAction: React.ReactNode;
    factory: FactoryContractObject<M>;
  }) => {
    const { watch, trigger } = useFormContext();
    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(factory, { enabled: requiresTrustedCaller });

    const action = parseAction(watch(fieldNames.action));

    // Switching action swaps which fields are mounted, and re-registering an
    // already-known field does not recompute `isValid`.
    useEffect(() => {
      if (action !== null) {
        void trigger();
      }
    }, [action, trigger]);

    if (requiresTrustedCaller && isTrustedCallerLoading) {
      return <PageLoader />;
    }

    if (requiresTrustedCaller && !isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    const Fields = action === null ? null : actions[action].Fields;

    return (
      <>
        <Fieldset>
          <SelectHookForm
            fieldName={fieldNames.action}
            label="Action"
            rules={{
              required: 'Field is required',
              validate: (value) =>
                parseAction(value) !== null || 'Invalid action',
            }}
          >
            {actionTitles.map((title, ordinal) => (
              <Option key={ordinal} value={String(ordinal)}>
                {title}
              </Option>
            ))}
          </SelectHookForm>
        </Fieldset>

        {Fields && <Fields fieldNames={fieldNames} />}

        {submitAction}
      </>
    );
  };

  return {
    ...createMotionFormPart<FormData, M>({
      motionType,
      populateTx: ({ evmScriptFactory, formData, contract }) =>
        contract.write({
          address: contract.address,
          functionName: 'createMotion',
          args: [evmScriptFactory, encodeCallData(formData)],
        }),
      getDefaultFormData,
      Component,
    }),
    encodeCallData,
  };
};
