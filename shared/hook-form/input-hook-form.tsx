import { useController } from 'react-hook-form';

import { isValidationErrorTypeValidate } from './utils';
import { Input } from '@lidofinance/lido-ui';

type InputHookFormProps = Partial<React.ComponentProps<typeof Input>> & {
  fieldName: string;
  showErrorMessage?: boolean;
};

export const InputHookForm = ({
  fieldName,
  showErrorMessage = true,
  error: errorProp,
  ...props
}: InputHookFormProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name: fieldName });
  const hasErrorHighlight = isValidationErrorTypeValidate(error?.type);
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);
  return (
    <Input
      {...props}
      {...field}
      disabled={props.disabled ?? field.disabled}
      error={errorProp ?? (showErrorMessage ? errorMessage : hasErrorHighlight)}
      fullwidth
    />
  );
};
