import { useController } from 'react-hook-form';
import type { RegisterOptions } from 'react-hook-form';
import { Select } from '@lidofinance/lido-ui';

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
  ...props
}: InputHookFormProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name: fieldName, rules });
  const hasErrorHighlight = isValidationErrorTypeValidate(error?.type);
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);
  return (
    <Select
      {...props}
      {...field}
      disabled={props.disabled ?? field.disabled}
      error={errorProp ?? (showErrorMessage ? errorMessage : hasErrorHighlight)}
      fullwidth
    />
  );
};
