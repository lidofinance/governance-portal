import { PlaceOrderFormProvider } from '@stonks/providers/place-order-form-context';
import { PlaceOrderFormAmountInput } from './place-order-form-amount-input';
import { PlaceOrderFormController, PlaceOrderFormControls } from './style';
import { PlaceOrderFormSubmitButton } from './place-order-form-submit-button';
import { PlaceOrderFormInfo } from './place-order-form-info';
import { StonksMetadata } from '@stonks/types';
import { PlaceOrderFormMinBuyInput } from './place-order-form-min-buy-input';

type Props = {
  stonksMetadata: StonksMetadata;
};

export const StonksPlaceOrderForm = ({ stonksMetadata }: Props) => {
  return (
    <PlaceOrderFormProvider stonksMetadata={stonksMetadata}>
      <PlaceOrderFormController>
        <PlaceOrderFormControls>
          <PlaceOrderFormAmountInput />
          <PlaceOrderFormMinBuyInput />
          <PlaceOrderFormSubmitButton />
        </PlaceOrderFormControls>
        <PlaceOrderFormInfo />
      </PlaceOrderFormController>
    </PlaceOrderFormProvider>
  );
};
