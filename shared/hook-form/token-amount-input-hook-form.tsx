import { RegisterOptions, useController } from 'react-hook-form';

import { InputAmount } from 'shared/components/input-amount';

import { isValidationErrorTypeValidate } from './utils';

type TokenAmountInputHookFormProps = Partial<
  React.ComponentProps<typeof InputAmount>
> & {
  isLocked?: boolean;
  maxValue?: bigint;
  token: string;
  fieldName: string;
  showErrorMessage?: boolean;
  rules?: RegisterOptions;
};

export const TokenAmountInputHookForm = ({
  isLocked,
  maxValue,
  token,
  fieldName,
  showErrorMessage = true,
  error: errorProp,
  label: labelProp,
  rules,
  ...props
}: TokenAmountInputHookFormProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name: fieldName, rules });
  const hasErrorHighlight = isValidationErrorTypeValidate(error?.type);
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);
  return (
    <InputAmount
      {...props}
      {...field}
      disabled={props.disabled ?? field.disabled}
      error={errorProp ?? (showErrorMessage ? errorMessage : hasErrorHighlight)}
      isLocked={isLocked}
      maxValue={maxValue}
      label={labelProp ?? `Enter your amount of ${token}`}
      fullwidth
    />
  );
};
