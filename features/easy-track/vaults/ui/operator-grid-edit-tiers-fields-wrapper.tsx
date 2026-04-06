import { Plus, ButtonIcon, Option } from '@lidofinance/lido-ui';
import { useFieldArray, useWatch } from 'react-hook-form';
import { TierParams } from '@easy-track/vaults/types';
import { Tier } from '@easy-track/vaults/hooks/use-operator-grid-tier-map';
import { EMPTY_TIER } from '@easy-track/vaults/constants';
import {
  Fieldset,
  FieldsHeader,
  FieldsHeaderDesc,
  FieldsWrapper,
  RemoveItemButton,
} from '@easy-track/start-motion/parts/style';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import { convertShareLimitToInputValue } from '@easy-track/vaults/utils/convert-share-limit-to-input-value';
import { OperatorGridTierFieldsets } from '@easy-track/vaults/ui/operator-grid-tier-fieldsets';

type TierInput = {
  tierId: string;
} & TierParams;

type Props = {
  tierArrayFieldName: string;
  currentTierIds: readonly bigint[];
  maxShareLimit?: bigint | undefined;
  getOperatorGridTier: (tierId: string) => Promise<Tier | null>;
};

export const OperatorGridEditTiersFieldsWrapper = ({
  tierArrayFieldName,
  maxShareLimit,
  currentTierIds,
  getOperatorGridTier,
}: Props) => {
  const tiersFieldArray = useFieldArray({
    name: tierArrayFieldName,
  });

  const selectedTiers: TierInput[] = useWatch({
    name: tierArrayFieldName,
    defaultValue: [],
  });

  const handleAddTier = () =>
    tiersFieldArray.append({ tierId: '', ...EMPTY_TIER });

  const getFilteredTierIdOptions = (tierIndex: number) => {
    const allOptions = currentTierIds.map((tierId, index) => ({
      tierId: Number(tierId),
      index,
    }));

    const selectedIds = selectedTiers.map(({ tierId }) => parseInt(tierId));
    const thisId = parseInt(selectedTiers[tierIndex]?.tierId);
    return allOptions.filter(({ tierId }) => {
      return tierId === thisId || !selectedIds.includes(tierId);
    });
  };

  return (
    <>
      <FieldsHeaderDesc>Tiers</FieldsHeaderDesc>

      {tiersFieldArray.fields.map((tierItem, tierIndex) => (
        <FieldsWrapper key={tierItem.id}>
          <FieldsHeader>
            <FieldsHeaderDesc>Update #{tierIndex + 1}</FieldsHeaderDesc>
            {tiersFieldArray.fields.length > 1 && (
              <RemoveItemButton
                onClick={() => tiersFieldArray.remove(tierIndex)}
              >
                Remove update
              </RemoveItemButton>
            )}
          </FieldsHeader>

          <Fieldset>
            <SelectHookForm
              label="Tier to alter"
              fieldName={`${tierArrayFieldName}.${tierIndex}.tierId`}
              rules={{ required: 'Field is required' }}
              onChange={(value) => {
                void getOperatorGridTier(String(value)).then((tier) => {
                  if (tier) {
                    tiersFieldArray.update(tierIndex, {
                      tierId: value,
                      shareLimit: convertShareLimitToInputValue(
                        tier.shareLimit,
                      ),
                      reserveRatioBP: tier.reserveRatioBP.toString(),
                      forcedRebalanceThresholdBP:
                        tier.forcedRebalanceThresholdBP.toString(),
                      infraFeeBP: tier.infraFeeBP.toString(),
                      liquidityFeeBP: tier.liquidityFeeBP.toString(),
                      reservationFeeBP: tier.reservationFeeBP.toString(),
                    });
                  }
                });
              }}
            >
              {getFilteredTierIdOptions(tierIndex).map(({ tierId, index }) => (
                <Option
                  key={tierId}
                  value={tierId}
                >{`#${index + 1} (global tierId = ${tierId})`}</Option>
              ))}
            </SelectHookForm>
          </Fieldset>

          <OperatorGridTierFieldsets
            tierArrayFieldName={tierArrayFieldName}
            fieldIndex={tierIndex}
            maxShareLimit={maxShareLimit}
          />
        </FieldsWrapper>
      ))}

      {tiersFieldArray.fields.length < currentTierIds.length && (
        <Fieldset>
          <ButtonIcon
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddTier}
            icon={<Plus />}
            color="secondary"
          >
            Add tier
          </ButtonIcon>
        </Fieldset>
      )}
    </>
  );
};
