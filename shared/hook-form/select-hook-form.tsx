import { useController } from 'react-hook-form';
import type { RegisterOptions } from 'react-hook-form';
import { OptionValue, Select } from '@lidofinance/lido-ui';
import { useEffect, useRef } from 'react';

import { isValidationErrorTypeValidate } from './utils';

type InputHookFormProps = Partial<React.ComponentProps<typeof Select>> & {
  fieldName: string;
  showErrorMessage?: boolean;
  rules?: RegisterOptions;
};

export const SelectHookForm = ({
  fieldName,
  showErrorMessage = true,
  error: errorProp,
  rules,
  onChange: onChangeProp,
  ...props
}: InputHookFormProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name: fieldName, rules });
  const hasErrorHighlight = isValidationErrorTypeValidate(error?.type);
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);

  // The lido-ui Select forwards its ref to a native <input> element.
  // RHF reads ref.current.value for built-in `required` validation, but the
  // DOM value lags one render behind the controlled value — causing the first
  // selection to always fail validation. Registering a plain object instead
  // makes RHF fall back to reading from formValues, which is always current.
  const syntheticRef = useRef({ name: fieldName });
  useEffect(() => {
    if (typeof field.ref === 'function') {
      field.ref(syntheticRef.current as unknown as HTMLInputElement);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (value: OptionValue) => {
    field.onChange(value);
    onChangeProp?.(value);
  };

  return (
    <Select
      {...props}
      name={field.name}
      value={field.value}
      onBlur={field.onBlur}
      onChange={handleChange}
      disabled={props.disabled ?? field.disabled}
      error={errorProp ?? (showErrorMessage ? errorMessage : hasErrorHighlight)}
      fullwidth
    />
  );
};
