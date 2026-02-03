import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { useFieldArray } from 'react-hook-form';
import { EMPTY_TIER } from '../constants';
import { useMemo } from 'react';
import { OperatorGridTierFieldsets } from './operator-grid-tier-fieldsets';
import {
  Fieldset,
  FieldsHeader,
  FieldsHeaderDesc,
  FieldsWrapper,
  RemoveItemButton,
} from '../../start-motion/parts/style';
import { parseEther } from 'viem';

type Props = {
  tierArrayFieldName: string;
  maxShareLimit: bigint | string | undefined;
  groupTiersCount: number | undefined;
};

export const OperatorGridAddTiersFieldsWrapper = ({
  tierArrayFieldName,
  maxShareLimit,
  groupTiersCount,
}: Props) => {
  const tiersFieldArray = useFieldArray({
    name: tierArrayFieldName,
  });

  const handleAddTier = () => tiersFieldArray.append({ ...EMPTY_TIER });

  const maxShareLimitBn = useMemo(() => {
    if (!maxShareLimit) {
      return 0n;
    }
    if (typeof maxShareLimit === 'string') {
      try {
        return parseEther(maxShareLimit);
      } catch (error) {
        return 0n;
      }
    }
    return maxShareLimit;
  }, [maxShareLimit]);

  return (
    <>
      <FieldsHeaderDesc>Tiers</FieldsHeaderDesc>

      {tiersFieldArray.fields.map((tierItem, tierIndex) => (
        <FieldsWrapper key={tierItem.id}>
          <FieldsHeader>
            <FieldsHeaderDesc>
              Tier
              {groupTiersCount === undefined
                ? ''
                : ` #${groupTiersCount + tierIndex + 1}`}
            </FieldsHeaderDesc>
            {tiersFieldArray.fields.length > 1 && (
              <RemoveItemButton
                onClick={() => tiersFieldArray.remove(tierIndex)}
              >
                Remove tier
              </RemoveItemButton>
            )}
          </FieldsHeader>

          <OperatorGridTierFieldsets
            tierArrayFieldName={tierArrayFieldName}
            fieldIndex={tierIndex}
            maxShareLimit={maxShareLimitBn}
          />
        </FieldsWrapper>
      ))}

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
    </>
  );
};
