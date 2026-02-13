import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useDebounce } from 'shared/hooks/use-debounce';
import { usePlaceOrderFormData } from '@stonks/providers/place-order-form-context';
import { TokenAmountInputHookForm } from 'shared/hook-form/token-amount-input-hook-form';
import { MIN_BUY_AMOUNT_NAME, SELL_AMOUNT_NAME } from './constants';
import { MIN_STONKS_BALANCE_WEI } from '@stonks/constants';

export const PlaceOrderFormAmountInput = () => {
  const { setError, setValue, formState } = useFormContext();

  const { stonksMetadata, balance, isFetched, fetchEstimatedOutput } =
    usePlaceOrderFormData();

  const fieldValue = useWatch({ name: SELL_AMOUNT_NAME });

  const debouncedValue: bigint = useDebounce(fieldValue, 1000);

  useEffect(() => {
    if (!formState.isDirty) {
      // Don't validate if there was no interaction
      return;
    }

    let isCurrent = true; // Guard against race conditions

    const fetchOutput = async () => {
      // Check if this effect is still the latest one before setting state
      if (!isCurrent) return;

      try {
        const estimatedOutput = await fetchEstimatedOutput(debouncedValue);

        setValue(MIN_BUY_AMOUNT_NAME, estimatedOutput);
      } catch (error) {
        setError(SELL_AMOUNT_NAME, {
          type: 'validate',
          message: 'Failed to fetch estimated output',
        });
      }
    };

    void fetchOutput();

    // Cleanup
    return () => {
      isCurrent = false;
    };

    // Only run when the debounced value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <TokenAmountInputHookForm
      disabled={!isFetched}
      fieldName={SELL_AMOUNT_NAME}
      token={stonksMetadata.tokenFrom.symbol}
      data-testid="stonksPlaceOrderInput"
      maxValue={balance}
      dgStyle={false}
      decimals={stonksMetadata.tokenFrom.decimals}
      label="Amount to sell"
      rules={{
        validate: (value: bigint) => {
          if (!value) {
            return 'Field is required';
          }

          if (value === 0n) {
            return 'Amount must be greater than zero';
          }

          if (value < MIN_STONKS_BALANCE_WEI) {
            return `Amount must be at least ${MIN_STONKS_BALANCE_WEI} wei`;
          }

          if (balance !== undefined && value > balance) {
            return 'Amount exceeds balance';
          }

          return true; // No error
        },
      }}
    />
  );
};
