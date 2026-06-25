import { StyledInput, ClearButton } from './style';
import { VoteSearchIcon } from 'shared/components/icons';
import { useCallback } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

export const VoteSearch = ({ value, onChange, onClear }: Props) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <StyledInput
      value={value}
      placeholder="Search"
      onChange={handleChange}
      leftDecorator={<VoteSearchIcon />}
      rightDecorator={
        value ? (
          <ClearButton onClick={onClear} aria-label="Clear search" />
        ) : null
      }
    />
  );
};
