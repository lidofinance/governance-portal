import { encodeFunctionResult, type Hex } from 'viem';
import { lidoLendMarketManagerActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateBytes32 } from 'utils/validate-bytes32';
import {
  Fieldset,
  FieldsWrapper,
  FieldsHeader,
  RemoveItemButton,
} from '../style';

export const UnfreezeMarketsFields = ({
  fieldNames,
}: {
  fieldNames: {
    marketIds: string;
  };
}) => {
  const { watch } = useFormContext();
  const marketIdsFieldArray = useFieldArray({ name: fieldNames.marketIds });
  const selectedMarketIds: FormData['marketIds'] = watch(fieldNames.marketIds);

  return (
    <FieldsWrapper>
      <FieldsHeader>Markets to unfreeze</FieldsHeader>
      {marketIdsFieldArray.fields.map((field, index) => (
        <Fieldset key={field.id}>
          <InputHookForm
            fieldName={`${fieldNames.marketIds}.${index}.value`}
            label={`Market ID ${index + 1}`}
            rules={{
              required: 'Field is required',
              validate: (value: string) => {
                const marketIdErr = validateBytes32(value);
                if (marketIdErr) {
                  return marketIdErr;
                }

                const duplicateIndex = selectedMarketIds.findIndex(
                  (marketId, marketIndex) =>
                    marketId.value.toLowerCase() === value.toLowerCase() &&
                    marketIndex !== index,
                );

                if (duplicateIndex !== -1) {
                  return 'Value must not duplicate another market ID';
                }

                return true;
              },
            }}
          />
          {marketIdsFieldArray.fields.length > 1 && (
            <RemoveItemButton onClick={() => marketIdsFieldArray.remove(index)}>
              Remove
            </RemoveItemButton>
          )}
        </Fieldset>
      ))}
      <ButtonIcon
        type="button"
        variant="ghost"
        size="sm"
        icon={<Plus />}
        onClick={() => marketIdsFieldArray.append({ value: '' })}
      >
        Add market
      </ButtonIcon>
    </FieldsWrapper>
  );
};

export const encodeUnfreezeMarkets = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeUnfreezeMarketsPayload',
    result: formData.marketIds.map(({ value }) => value as Hex),
  });
