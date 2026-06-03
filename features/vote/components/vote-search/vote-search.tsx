import { StyledInput } from './style';
import { VoteSearchIcon } from 'shared/components/icons';
import { useCallback } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const VoteSearch = ({ value, onChange }: Props) => {
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
    />
  );
};
