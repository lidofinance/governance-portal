import { encodeFunctionResult, type Address } from 'viem';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { lidoLendExitBookActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateAddress } from 'utils/validate-address';
import { CheckboxHookForm } from 'shared/hook-form/checkbox-hook-form';
import {
  Fieldset,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  RemoveItemButton,
} from '../style';

// LidoLendExitBookActions.Action.SetErc4626ExitBookAllowed
// -> IErc4626ExitBook.setVaultAllowed(address, bool) on `erc4626ExitBook`
export const SetVaultAllowedFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'vaults' | 'allowed'>;
}) => {
  const { watch } = useFormContext();
  const vaultsFieldArray = useFieldArray({ name: fieldNames.vaults });
  const vaults: FormData['vaults'] = watch(fieldNames.vaults);

  return (
    <>
      {vaultsFieldArray.fields.map((field, index) => (
        <FieldsWrapper key={field.id}>
          <FieldsHeader>
            <FieldsHeaderDesc>Vault #{index + 1}</FieldsHeaderDesc>
            {vaultsFieldArray.fields.length > 1 && (
              <RemoveItemButton onClick={() => vaultsFieldArray.remove(index)}>
                Remove vault {index + 1}
              </RemoveItemButton>
            )}
          </FieldsHeader>
          <Fieldset>
            <InputHookForm
              fieldName={`${fieldNames.vaults}.${index}.value`}
              label="Vault address"
              rules={{
                required: 'Field is required',
                validate: (value: string) => {
                  const addressErr = validateAddress(value);
                  if (addressErr) {
                    return addressErr;
                  }

                  // The factory emits one call per vault, so a repeated vault
                  // would set the same flag twice in the same motion.
                  const duplicateIndex = vaults.findIndex(
                    (vault, vaultIndex) =>
                      vault.value.toLowerCase() === value.toLowerCase() &&
                      vaultIndex !== index,
                  );

                  if (duplicateIndex !== -1) {
                    return 'Value must not duplicate another vault';
                  }

                  return true;
                },
              }}
            />
          </Fieldset>
        </FieldsWrapper>
      ))}
      <Fieldset>
        <ButtonIcon
          type="button"
          variant="ghost"
          size="sm"
          icon={<Plus />}
          color="secondary"
          onClick={() => vaultsFieldArray.append({ value: '' })}
        >
          Add vault
        </ButtonIcon>
      </Fieldset>
      <Fieldset>
        <CheckboxHookForm
          fieldName={fieldNames.allowed}
          label="Allow these vaults on the ERC-4626 exit book (unchecked disallows them)"
        />
      </Fieldset>
    </>
  );
};

export const encodeSetVaultAllowed = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeSetErc4626ExitBookAllowedPayload',
    result: [
      formData.vaults.map(({ value }) => value as Address),
      formData.allowed,
    ],
  });
