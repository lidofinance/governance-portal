import { useFormContext } from 'react-hook-form';
import { useFormControllerContext } from 'shared/hook-form/form-controller-context';
import { Button } from 'shared/components/button';

export const PlaceOrderFormResetButton = () => {
  const { formState, getValues } = useFormContext();
  const { onReset } = useFormControllerContext();

  return (
    <Button
      fullwidth
      type="button"
      variant="translucent"
      buttonStyleVersion="default"
      disabled={!formState.isDirty || formState.isSubmitting}
      onClick={() => onReset?.(getValues())}
    >
      Reset
    </Button>
  );
};
