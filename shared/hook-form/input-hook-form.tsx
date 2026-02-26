import { useController } from 'react-hook-form';

import { isValidationErrorTypeValidate } from './utils';
import { Input } from '@lidofinance/lido-ui';
import type { RegisterOptions } from 'react-hook-form';

type InputHookFormProps = Partial<React.ComponentProps<typeof Input>> & {
  fieldName: string;
  showErrorMessage?: boolean;
  rules?: RegisterOptions;
};

export const InputHookForm = ({
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
    <Input
      {...props}
      {...field}
      value={field.value ?? ''}
      disabled={props.disabled ?? field.disabled}
      error={errorProp ?? (showErrorMessage ? errorMessage : hasErrorHighlight)}
      fullwidth
    />
  );
};
