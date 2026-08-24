import { PlaceOrderFormProvider } from '@stonks/providers/place-order-form-context';
import { PlaceOrderFormAmountInput } from './place-order-form-amount-input';
import { PlaceOrderFormController, PlaceOrderFormControls } from './style';
import { PlaceOrderFormSubmitButton } from './place-order-form-submit-button';
import { PlaceOrderFormResetButton } from './place-order-form-reset-button';
import { PlaceOrderFormInfo } from './place-order-form-info';
import { StonksMetadata } from '@stonks/types';
import { PlaceOrderFormMinBuyInput } from './place-order-form-min-buy-input';
import { BackButton } from 'shared/components/back-button';
import { STONKS_PATH } from 'constants/urls';

type Props = {
  stonksMetadata: StonksMetadata;
};

export const StonksPlaceOrderForm = ({ stonksMetadata }: Props) => {
  return (
    <PlaceOrderFormProvider stonksMetadata={stonksMetadata}>
      <PlaceOrderFormController>
        <BackButton label="stonks" href={STONKS_PATH} />
        <PlaceOrderFormControls>
          <PlaceOrderFormAmountInput />
          <PlaceOrderFormMinBuyInput />
          <PlaceOrderFormSubmitButton />
          <PlaceOrderFormResetButton />
        </PlaceOrderFormControls>
        <PlaceOrderFormInfo />
      </PlaceOrderFormController>
    </PlaceOrderFormProvider>
  );
};
