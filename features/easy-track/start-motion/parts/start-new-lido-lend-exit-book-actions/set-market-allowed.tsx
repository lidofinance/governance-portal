import { encodeFunctionResult, type Address } from 'viem';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { lidoLendExitBookActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { CheckboxHookForm } from 'shared/hook-form/checkbox-hook-form';
import {
  DEFAULT_ADDRESS_RULES,
  parsePercentInput,
  validatePercentValue,
} from '@easy-track/lido-lend/validation';
import {
  Fieldset,
  FieldsWrapper,
  FieldsHeader,
  RemoveItemButton,
} from '../style';

type Market = FormData['markets'][number];

const isSameMarket = (a: Market, b: Market) =>
  (['loanToken', 'collateralToken', 'oracle', 'irm'] as const).every(
    (key) => a[key].toLowerCase() === b[key].toLowerCase(),
  ) &&
  validatePercentValue(a.lltv) === null &&
  validatePercentValue(b.lltv) === null &&
  parsePercentInput(a.lltv) === parsePercentInput(b.lltv);

// LidoLendExitBookActions.Action.SetMorphoExitBookAllowed
// -> IMorphoExitBook.setMarketAllowed(MarketParams, bool) on `morphoExitBook`
export const SetMarketAllowedFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'markets' | 'allowed'>;
}) => {
  const { watch } = useFormContext();
  const marketsFieldArray = useFieldArray({ name: fieldNames.markets });
  const markets: FormData['markets'] = watch(fieldNames.markets);

  return (
    <>
      {marketsFieldArray.fields.map((field, index) => (
        <FieldsWrapper key={field.id}>
          <FieldsHeader>
            Market {index + 1}
            {marketsFieldArray.fields.length > 1 && (
              <RemoveItemButton onClick={() => marketsFieldArray.remove(index)}>
                Remove
              </RemoveItemButton>
            )}
          </FieldsHeader>
          <Fieldset>
            <InputHookForm
              fieldName={`${fieldNames.markets}.${index}.loanToken`}
              label="Loan token"
              rules={DEFAULT_ADDRESS_RULES}
            />
          </Fieldset>
          <Fieldset>
            <InputHookForm
              fieldName={`${fieldNames.markets}.${index}.collateralToken`}
              label="Collateral token"
              rules={DEFAULT_ADDRESS_RULES}
            />
          </Fieldset>
          <Fieldset>
            <InputHookForm
              fieldName={`${fieldNames.markets}.${index}.oracle`}
              label="Oracle"
              rules={DEFAULT_ADDRESS_RULES}
            />
          </Fieldset>
          <Fieldset>
            <InputHookForm
              fieldName={`${fieldNames.markets}.${index}.irm`}
              label="IRM"
              rules={DEFAULT_ADDRESS_RULES}
            />
          </Fieldset>
          <Fieldset>
            <InputNumberHookForm
              fieldName={`${fieldNames.markets}.${index}.lltv`}
              label="LLTV (%)"
              rules={{
                required: 'Field is required',
                validate: (value: string) => {
                  const lltvErr = validatePercentValue(value);
                  if (lltvErr) {
                    return lltvErr;
                  }

                  // The factory emits one call per market, so a repeated
                  // market would set the same flag twice in the same motion.
                  const market = { ...markets[index], lltv: value };
                  const duplicateIndex = markets.findIndex(
                    (other, otherIndex) =>
                      otherIndex !== index && isSameMarket(other, market),
                  );

                  if (duplicateIndex !== -1) {
                    return 'Value must not duplicate another market';
                  }

                  return true;
                },
              }}
            />
          </Fieldset>
        </FieldsWrapper>
      ))}
      <ButtonIcon
        type="button"
        variant="ghost"
        size="sm"
        icon={<Plus />}
        onClick={() =>
          marketsFieldArray.append({
            loanToken: '',
            collateralToken: '',
            oracle: '',
            irm: '',
            lltv: '',
          })
        }
      >
        Add market
      </ButtonIcon>
      <Fieldset>
        <CheckboxHookForm
          fieldName={fieldNames.allowed}
          label="Allow these markets on the Morpho exit book (unchecked disallows them)"
        />
      </Fieldset>
    </>
  );
};

export const encodeSetMarketAllowed = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeSetMorphoExitBookAllowedPayload',
    result: [
      formData.markets.map(
        ({ loanToken, collateralToken, oracle, irm, lltv }) => ({
          loanToken: loanToken as Address,
          collateralToken: collateralToken as Address,
          oracle: oracle as Address,
          irm: irm as Address,
          lltv: parsePercentInput(lltv),
        }),
      ),
      formData.allowed,
    ],
  });
