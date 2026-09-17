import { encodeFunctionResult, type Hex } from 'viem';
import { lidoLendGuardianActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { MarketIdField } from '@easy-track/lido-lend/market-id-field';
import { validateInteger } from '@easy-track/lido-lend/validation';
import { Fieldset } from '../style';

export const SetSuspectWindowFields = ({
  fieldNames,
}: {
  fieldNames: {
    marketId: string;
    newSuspectWindow: string;
  };
}) => (
  <>
    <MarketIdField fieldName={fieldNames.marketId} />
    <Fieldset>
      <InputNumberHookForm
        fieldName={fieldNames.newSuspectWindow}
        label="New suspect window (s)"
        rules={{
          required: 'Field is required',
          validate: (value: string) => validateInteger(value) ?? true,
        }}
      />
    </Fieldset>
  </>
);

export const encodeSetSuspectWindow = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeSetSuspectWindowPayload',
    result: [formData.marketId as Hex, BigInt(formData.newSuspectWindow)],
  });
