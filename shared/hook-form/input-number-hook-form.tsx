import { useController } from 'react-hook-form';

import { isValidationErrorTypeValidate } from './utils';
import { Input } from '@lidofinance/lido-ui';
import type { RegisterOptions } from 'react-hook-form';
import { useCallback } from 'react';

type InputHookFormProps = Partial<React.ComponentProps<typeof Input>> & {
  fieldName: string;
  showErrorMessage?: boolean;
  rules?: RegisterOptions;
};

const NUM_REGEX = /^(\d+\.?\d*|\d*\.\d+|\.)$/;

export const InputNumberHookForm = ({
  fieldName,
  showErrorMessage = true,
  error: errorProp,
  rules,
  onChange,
  ...props
}: InputHookFormProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name: fieldName, rules });
  const hasErrorHighlight = isValidationErrorTypeValidate(error?.type);
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;

      if (value === '') {
        field.onChange(e);
        onChange?.(e);
        return;
      }

      if (value === '.') {
        e.currentTarget.value = '0.';
        field.onChange(e);
        onChange?.(e);
        return;
      }

      // Validate the input matches numeric pattern
      if (!NUM_REGEX.test(value)) {
        return;
      }
      field.onChange(e);
      onChange?.(e);
    },
    [field, onChange],
  );

  return (
    <Input
      {...props}
      {...field}
      onChange={handleChange}
      value={field.value ?? ''}
      disabled={props.disabled ?? field.disabled}
      error={errorProp ?? (showErrorMessage ? errorMessage : hasErrorHighlight)}
      fullwidth
    />
  );
};
