import { useCallback, useState } from 'react';
import { ToggleWrapper, StyledButton } from './style';

type Props = {
  values: string[];
  onChange?: () => string;
};

export const ToggleButton = ({ values, onChange }: Props) => {
  const [activeValue, setActiveValue] = useState<string>(values[0]);

  const handleClick = useCallback(
    (value) => {
      setActiveValue(value);
      if (typeof onChange === 'function') {
        onChange(value);
      }
    },
    [setActiveValue, onChange],
  );

  if (!values || values.length === 0) return null;
  return (
    <ToggleWrapper>
      {values.map((value) => (
        <StyledButton
          key={value}
          onClick={() => handleClick(value)}
          $isActive={activeValue === value}
        >
          {value}
        </StyledButton>
      ))}
    </ToggleWrapper>
  );
};
