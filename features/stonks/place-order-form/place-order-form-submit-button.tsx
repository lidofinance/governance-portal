import { SubmitButtonHookForm } from 'shared/hook-form/submit-button-hook-form';
import { usePlaceOrderFormData } from '@stonks/providers/place-order-form-context';
import { useFormContext } from 'react-hook-form';
import { ConnectWalletButton } from 'shared/wallet';
import { useAccount } from 'wagmi';

export const PlaceOrderFormSubmitButton = () => {
  const { isConnected } = useAccount();
  const { formState } = useFormContext();
  const { isLoading, isStonksManagerConnected } = usePlaceOrderFormData();

  if (!isConnected) {
    return <ConnectWalletButton buttonStyleVersion="default" />;
  }

  return (
    <SubmitButtonHookForm
      loading={isLoading}
      disabled={!formState.isValid || !isStonksManagerConnected}
      data-testid="placeOrderBtn"
      buttonStyleVersion="default"
    >
      {isStonksManagerConnected === false
        ? 'Only Stonks manager can place orders'
        : 'Place Order'}
    </SubmitButtonHookForm>
  );
};
