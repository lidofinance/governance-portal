import { useFormContext } from 'react-hook-form';
import { Wrap } from './style';
import { formatPercentBp } from '../../utils/format-vault-param';

type Props = {
  fieldName: string;
  label?: string;
};

export const BpValueFormatted = ({ fieldName, label }: Props) => {
  const { watch } = useFormContext();
  const value = watch(fieldName);

  if (!value || isNaN(parseFloat(value))) {
    return null;
  }

  return (
    <Wrap>
      {label ? `${label}: ` : ''}
      {formatPercentBp(value)}
    </Wrap>
  );
};
