import { encodeFunctionResult, type Hex } from 'viem';
import { lidoLendMarketManagerActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { CheckboxHookForm } from 'shared/hook-form/checkbox-hook-form';
import { validateAddress } from 'utils/validate-address';
import { MarketIdField } from '@easy-track/lido-lend/market-id-field';
import { Fieldset } from '../style';

export const SetInstantActivationFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'marketId' | 'caller' | 'enabled'>;
}) => (
  <>
    <MarketIdField fieldName={fieldNames.marketId} />
    <Fieldset>
      <InputHookForm
        fieldName={fieldNames.caller}
        label="Caller address"
        rules={{
          required: 'Field is required',
          validate: (value: string) => validateAddress(value) ?? true,
        }}
      />
    </Fieldset>
    <Fieldset>
      <CheckboxHookForm
        fieldName={fieldNames.enabled}
        label="Instant activation enabled"
      />
    </Fieldset>
  </>
);

export const encodeSetInstantActivation = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeSetInstantActivationPayload',
    result: [
      formData.marketId as Hex,
      formData.caller as Hex,
      formData.enabled,
    ],
  });
