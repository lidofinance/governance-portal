import { SubmitButtonHookForm } from 'shared/hook-form/submit-button-hook-form';
import { usePlaceOrderFormData } from '@stonks/providers/place-order-form-context';

export const PlaceOrderFormSubmitButton = () => {
  const { isLoading } = usePlaceOrderFormData();
  return (
    <SubmitButtonHookForm loading={isLoading} data-testid="placeOrderBtn">
      Place Order
    </SubmitButtonHookForm>
  );
};
