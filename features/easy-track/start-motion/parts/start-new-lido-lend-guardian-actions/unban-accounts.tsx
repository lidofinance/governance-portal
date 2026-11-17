import { encodeFunctionResult, type Hex } from 'viem';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { lidoLendGuardianActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateAddress } from 'utils/validate-address';
import { MarketIdListFields } from '@easy-track/lido-lend/market-id-list-fields';
import {
  Fieldset,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  RemoveItemButton,
} from '../style';

export const UnbanAccountsFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'unbanRequests'>;
}) => {
  const { watch } = useFormContext();
  const requestsFieldArray = useFieldArray({ name: fieldNames.unbanRequests });
  const unbanRequests: FormData['unbanRequests'] = watch(
    fieldNames.unbanRequests,
  );

  return (
    <>
      {requestsFieldArray.fields.map((field, index) => (
        <FieldsWrapper key={field.id}>
          <FieldsHeader>
            <FieldsHeaderDesc>Unban request #{index + 1}</FieldsHeaderDesc>
            {requestsFieldArray.fields.length > 1 && (
              <RemoveItemButton
                onClick={() => requestsFieldArray.remove(index)}
              >
                Remove request {index + 1}
              </RemoveItemButton>
            )}
          </FieldsHeader>
          <Fieldset>
            <InputHookForm
              fieldName={`${fieldNames.unbanRequests}.${index}.account`}
              label="Account to unban"
              rules={{
                required: 'Field is required',
                validate: (value: string) => {
                  const addressErr = validateAddress(value);
                  if (addressErr) {
                    return addressErr;
                  }

                  // The factory emits one call per request, so a repeated
                  // account would unban it twice in the same motion.
                  const duplicateIndex = unbanRequests.findIndex(
                    (request, requestIndex) =>
                      request.account.toLowerCase() === value.toLowerCase() &&
                      requestIndex !== index,
                  );

                  if (duplicateIndex !== -1) {
                    return 'Value must not duplicate another account';
                  }

                  return true;
                },
              }}
            />
          </Fieldset>
          <FieldsHeaderDesc>Markets</FieldsHeaderDesc>
          <MarketIdListFields
            fieldName={`${fieldNames.unbanRequests}.${index}.marketIds`}
          />
        </FieldsWrapper>
      ))}
      <Fieldset>
        <ButtonIcon
          type="button"
          variant="ghost"
          size="sm"
          icon={<Plus />}
          color="secondary"
          onClick={() =>
            requestsFieldArray.append({
              account: '',
              marketIds: [{ value: '' }],
            })
          }
        >
          Add unban request
        </ButtonIcon>
      </Fieldset>
    </>
  );
};

export const encodeUnbanAccounts = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeUnbanAccountsPayload',
    result: formData.unbanRequests.map(({ account, marketIds }) => ({
      account: account as Hex,
      marketIds: marketIds.map(({ value }) => value as Hex),
    })),
  });
