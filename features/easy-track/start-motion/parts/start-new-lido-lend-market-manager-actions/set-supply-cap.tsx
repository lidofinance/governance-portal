import { encodeFunctionResult, type Hex } from 'viem';
import { lidoLendMarketManagerActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { MarketIdField } from './market-id-field';
import { validateInteger } from '@easy-track/lido-lend/validation';
import { Fieldset } from '../style';

export const SetSupplyCapFields = ({
  fieldNames,
}: {
  fieldNames: {
    marketId: string;
    newCap: string;
  };
}) => (
  <>
    <MarketIdField fieldName={fieldNames.marketId} />
    <Fieldset>
      <InputNumberHookForm
        fieldName={fieldNames.newCap}
        label="New supply cap"
        rules={{
          required: 'Field is required',
          validate: (value: string) => validateInteger(value) ?? true,
        }}
      />
    </Fieldset>
  </>
);

export const encodeSetSupplyCap = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeSetSupplyCapPayload',
    result: [formData.marketId as Hex, BigInt(formData.newCap)],
  });
