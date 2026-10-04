import { encodeFunctionResult, type Hex } from 'viem';
import { lidoLendRiskStewardActionsAbi as abi } from 'abi/generated';
import { LidoLendRiskStewardAction } from '@easy-track/lido-lend/actions';
import { MarketIdField } from '@easy-track/lido-lend/market-id-field';
import { DEFAULT_ADDRESS_RULES } from '@easy-track/lido-lend/validation';
import { MotionType } from '@easy-track/motion-types';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { createActionFormPart } from './create-action-form-part';
import type { FieldNames } from './create-motion-form-part';
import { Fieldset } from './style';

export type FormData = {
  action: string;
  marketId: string;
  steward: string;
};

type Props = {
  fieldNames: FieldNames<FormData, 'marketId' | 'steward'>;
};

const encodeRiskStewardPayload = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeRiskStewardPayload',
    result: [formData.marketId as Hex, formData.steward as Hex],
  });

const actions = {
  [LidoLendRiskStewardAction.AddRiskSteward]: {
    Fields: ({ fieldNames }: Props) => (
      <>
        <MarketIdField fieldName={fieldNames.marketId} />
        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.steward}
            label="Risk steward address"
            rules={DEFAULT_ADDRESS_RULES}
          />
        </Fieldset>
      </>
    ),
    encode: encodeRiskStewardPayload,
  },
  [LidoLendRiskStewardAction.RemoveRiskSteward]: {
    Fields: ({ fieldNames }: Props) => (
      <>
        <MarketIdField fieldName={fieldNames.marketId} />
        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.steward}
            label="Risk steward address to remove"
            rules={DEFAULT_ADDRESS_RULES}
          />
        </Fieldset>
      </>
    ),
    encode: encodeRiskStewardPayload,
  },
};

export const formParts = createActionFormPart({
  motionType: MotionType.LidoLendRiskStewardActions,
  requiresTrustedCaller: true,
  actions,
  getDefaultFormData: (): FormData => ({
    action: '',
    marketId: '',
    steward: '',
  }),
});

export const encodeRiskStewardActionsCallData = formParts.encodeCallData;
