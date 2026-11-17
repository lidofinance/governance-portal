import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateBytes32 } from 'utils/validate-bytes32';
import {
  Fieldset,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  RemoveItemButton,
} from '@easy-track/start-motion/parts/style';

export const MarketIdListFields = ({ fieldName }: { fieldName: string }) => {
  const { watch } = useFormContext();
  const marketIdsFieldArray = useFieldArray({ name: fieldName });
  const selectedMarketIds: { value: string }[] = watch(fieldName);

  return (
    <>
      {marketIdsFieldArray.fields.map((field, index) => (
        <FieldsWrapper key={field.id}>
          <FieldsHeader>
            <FieldsHeaderDesc>Market #{index + 1}</FieldsHeaderDesc>
            {marketIdsFieldArray.fields.length > 1 && (
              <RemoveItemButton
                onClick={() => marketIdsFieldArray.remove(index)}
              >
                Remove market {index + 1}
              </RemoveItemButton>
            )}
          </FieldsHeader>
          <Fieldset>
            <InputHookForm
              fieldName={`${fieldName}.${index}.value`}
              label="Market ID"
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
          onClick={() => marketIdsFieldArray.append({ value: '' })}
        >
          Add market
        </ButtonIcon>
      </Fieldset>
    </>
  );
};
