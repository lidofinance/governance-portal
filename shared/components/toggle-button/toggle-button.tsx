import { useCallback, useState } from 'react';
import { ToggleWrapper, ButtonWrapper } from './style';
import { Button } from '../button';

type ToggleItem = {
  label: string;
  value: string;
};

type Props = {
  items: ToggleItem[];
  onChange?: (value: string) => void;
};

export const ToggleButton = ({ items, onChange }: Props) => {
  const [activeItem, setActiveItem] = useState<string | null>(
    items[0].value || null,
  );

  const handleClick = useCallback(
    (value: string) => () => {
      setActiveItem(value);
      if (typeof onChange === 'function') {
        onChange(value);
      }
    },
    [setActiveItem, onChange],
  );

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ToggleWrapper>
      {items.map((item) => (
        <ButtonWrapper key={item.value} $isActive={activeItem === item.value}>
          <Button
            size="sm"
            variant={activeItem === item.value ? 'filled' : 'outlined'}
            onClick={handleClick(item.value)}
          >
            {item.label}
          </Button>
        </ButtonWrapper>
      ))}
    </ToggleWrapper>
  );
};
