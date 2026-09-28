import { encodeFunctionResult, type Hex } from 'viem';
import { useFormContext } from 'react-hook-form';
import { lidoLendGuardianActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateAddress } from 'utils/validate-address';
import { MarketIdField } from '@easy-track/lido-lend/market-id-field';
import { Fieldset } from '../style';

export const ReplaceGuardianFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'marketId' | 'oldGuardian' | 'newGuardian'>;
}) => {
  const { getValues, trigger } = useFormContext();

  // Only the new guardian checks the pair, and only the old one re-triggers it.
  // Validating both ways would make the two fields trigger each other forever.
  const validateOldGuardian = (value: string) => {
    const addressErr = validateAddress(value);
    if (addressErr) {
      return addressErr;
    }

    void trigger(fieldNames.newGuardian);
    return true;
  };

  // The factory requires isGuardian(old) and !isGuardian(new), so the two
  // addresses can never be equal.
  const validateNewGuardian = (value: string) => {
    const addressErr = validateAddress(value);
    if (addressErr) {
      return addressErr;
    }

    const oldGuardian: string = getValues(fieldNames.oldGuardian);
    if (oldGuardian && oldGuardian.toLowerCase() === value.toLowerCase()) {
      return 'New guardian must differ from the old one';
    }

    return true;
  };

  return (
    <>
      <MarketIdField fieldName={fieldNames.marketId} />
      <Fieldset>
        <InputHookForm
          fieldName={fieldNames.oldGuardian}
          label="Guardian address to replace"
          rules={{
            required: 'Field is required',
            validate: validateOldGuardian,
          }}
        />
      </Fieldset>
      <Fieldset>
        <InputHookForm
          fieldName={fieldNames.newGuardian}
          label="New guardian address"
          rules={{
            required: 'Field is required',
            validate: validateNewGuardian,
          }}
        />
      </Fieldset>
    </>
  );
};

export const encodeReplaceGuardian = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeReplaceGuardianPayload',
    result: [
      formData.marketId as Hex,
      formData.oldGuardian as Hex,
      formData.newGuardian as Hex,
    ],
  });
