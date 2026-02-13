import React from 'react';
import { usePlaceOrderFormData } from '@stonks/providers/place-order-form-context';
import { TokenAmountInputHookForm } from 'shared/hook-form/token-amount-input-hook-form';
import { MIN_BUY_AMOUNT_NAME } from './constants';

export const PlaceOrderFormMinBuyInput = () => {
  const { stonksMetadata } = usePlaceOrderFormData();

  return (
    <TokenAmountInputHookForm
      disabled
      readOnly
      fieldName={MIN_BUY_AMOUNT_NAME}
      token={stonksMetadata.tokenFrom.symbol}
      data-testid="stonksPlaceOrderInput"
      decimals={stonksMetadata.tokenTo.decimals}
      dgStyle={false}
      label={`Estimated output amount in ${stonksMetadata.tokenTo.symbol}`}
      showMaxButton={false}
    />
  );
};
