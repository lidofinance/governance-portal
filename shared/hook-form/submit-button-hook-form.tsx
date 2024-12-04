import { useFormState } from 'react-hook-form';

import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { UnsupportedChainButton } from 'shared/wallet';
import { isValidationErrorTypeValidate } from './validation-error';
import { Button } from 'shared/components/button';
import { LockIcon } from 'shared/components/icons';

type SubmitButtonHookFormProps = Partial<
  React.ComponentProps<typeof Button>
> & {
  errorField?: string;
  icon?: React.ReactNode;
  isLocked?: boolean;
};

export const SubmitButtonHookForm: React.FC<SubmitButtonHookFormProps> = ({
  isLocked,
  errorField,
  disabled: disabledProp,
  icon,
  ...props
}) => {
  const isSupportedChain = useIsSupportedChain();

  const { isValidating, isSubmitting } = useFormState();
  const { errors } = useFormState<Record<string, unknown>>();

  if (!isSupportedChain) {
    return <UnsupportedChainButton />;
  }

  const disabled =
    (errorField &&
      !!errors[errorField] &&
      isValidationErrorTypeValidate(errors[errorField]?.type)) ||
    disabledProp;

  return (
    <Button
      fullwidth
      type="submit"
      loading={isValidating || isSubmitting}
      disabled={disabled}
      icon={icon || isLocked ? <LockIcon /> : <></>}
      {...props}
    />
  );
};
