import { encodeFunctionResult, type Hex } from 'viem';
import { lidoLendCircuitBreakerActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateAddress } from 'utils/validate-address';
import { MarketIdField } from '@easy-track/lido-lend/market-id-field';
import { Fieldset } from '../style';

export const RegisterPauserFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'marketId' | 'pauser'>;
}) => (
  <>
    <MarketIdField fieldName={fieldNames.marketId} />
    <Fieldset>
      <InputHookForm
        fieldName={fieldNames.pauser}
        label="Pauser address (zero address unregisters)"
        rules={{
          required: 'Field is required',
          validate: (value: string) =>
            validateAddress(value, { allowZero: true }) ?? true,
        }}
      />
    </Fieldset>
  </>
);

export const encodeRegisterPauser = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeRegisterPauserPayload',
    result: [formData.marketId as Hex, formData.pauser as Hex],
  });
