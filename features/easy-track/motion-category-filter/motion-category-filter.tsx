import { Check } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import {
  FILTER_CATEGORIES,
  FilterCategory,
} from '@easy-track/motion-categories';
import { CategoryButton, Wrap } from './style';

type Props = {
  selected: FilterCategory[];
  onChange: (categories: FilterCategory[]) => void;
};

export const MotionCategoryFilter = ({ selected, onChange }: Props) => {
  return (
    <Wrap>
      <Text size={14}>Filter by category:</Text>
      <CategoryButton
        type="button"
        aria-pressed={selected.length === 0}
        $isActive={selected.length === 0}
        onClick={() => onChange([])}
      >
        All
      </CategoryButton>
      {FILTER_CATEGORIES.map((category) => {
        const isActive = selected.includes(category);

        return (
          <CategoryButton
            key={category}
            type="button"
            aria-pressed={isActive}
            $isActive={isActive}
            $category={category}
            onClick={() =>
              onChange(
                selected.includes(category)
                  ? selected.filter((item) => item !== category)
                  : [...selected, category],
              )
            }
          >
            {isActive && <Check />}
            {category}
          </CategoryButton>
        );
      })}
    </Wrap>
  );
};
