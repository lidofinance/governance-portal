import { usePlaceOrderFormData } from '@stonks/providers/place-order-form-context';
import { TokenAmountInputHookForm } from 'shared/hook-form/token-amount-input-hook-form';
import { formatToken } from 'shared/blockchain/utils';
import { MIN_BUY_AMOUNT_NAME } from './constants';

export const PlaceOrderFormMinBuyInput = () => {
  const { stonksMetadata, isFetched, estimatedOutputRef } =
    usePlaceOrderFormData();

  return (
    <TokenAmountInputHookForm
      disabled={!isFetched}
      fieldName={MIN_BUY_AMOUNT_NAME}
      token={stonksMetadata.tokenTo.symbol}
      decimals={stonksMetadata.tokenTo.decimals}
      dgStyle={false}
      label={`Minimum buy amount in ${stonksMetadata.tokenTo.symbol}`}
      showMaxButton={false}
      rules={{
        validate: (value: bigint) => {
          if (!value) {
            return 'Field is required';
          }

          const estimatedOutput = estimatedOutputRef.current;

          if (estimatedOutput !== undefined && value < estimatedOutput) {
            // Values below the estimate have no effect: the order uses max(estimate, minBuyAmount)
            return `Amount must be at least the estimated output of ${formatToken(
              {
                amount: estimatedOutput,
                decimals: stonksMetadata.tokenTo.decimals,
                symbol: stonksMetadata.tokenTo.symbol,
              },
            )}`;
          }

          return true;
        },
      }}
    />
  );
};
