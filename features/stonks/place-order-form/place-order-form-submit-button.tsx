import { SubmitButtonHookForm } from 'shared/hook-form/submit-button-hook-form';
import { usePlaceOrderFormData } from '@stonks/providers/place-order-form-context';
import { useFormContext } from 'react-hook-form';

export const PlaceOrderFormSubmitButton = () => {
  const { formState } = useFormContext();
  const { isLoading } = usePlaceOrderFormData();
  return (
    <SubmitButtonHookForm
      loading={isLoading}
      disabled={!formState.isValid}
      data-testid="placeOrderBtn"
    >
      Place Order
    </SubmitButtonHookForm>
  );
};
