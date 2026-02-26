import { useController } from 'react-hook-form';
import { Checkbox } from '@lidofinance/lido-ui';
import type { RegisterOptions } from 'react-hook-form';
import { ReactNode } from 'react';

type CheckboxHookFormProps = Partial<React.ComponentProps<typeof Checkbox>> & {
  fieldName: string;
  rules?: RegisterOptions;
  label: ReactNode;
};

export const CheckboxHookForm = ({
  fieldName,
  rules,
  label,
  ...props
}: CheckboxHookFormProps) => {
  const {
    field: { onChange, value, ...field },
  } = useController({ name: fieldName, rules });

  return (
    <Checkbox
      {...props}
      {...field}
      checked={value}
      label={label}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
};
