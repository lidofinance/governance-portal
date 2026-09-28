import { encodeFunctionResult, type Hex } from 'viem';
import { lidoLendMarketManagerActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { MarketIdField } from '@easy-track/lido-lend/market-id-field';
import {
  parsePercentInput,
  validateFeePercent,
} from '@easy-track/lido-lend/validation';
import { Fieldset } from '../style';

export const SetFeeFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'marketId' | 'newFee'>;
}) => (
  <>
    <MarketIdField fieldName={fieldNames.marketId} />
    <Fieldset>
      <InputNumberHookForm
        fieldName={fieldNames.newFee}
        label="New fee (% of accrued interest)"
        rules={{
          required: 'Field is required',
          validate: (value: string) => validateFeePercent(value) ?? true,
        }}
      />
    </Fieldset>
  </>
);

export const encodeSetFee = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeSetFeePayload',
    result: [formData.marketId as Hex, parsePercentInput(formData.newFee)],
  });
