import {
  FC,
  useMemo,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import invariant from 'tiny-invariant';
import { FormProvider, useForm } from 'react-hook-form';
import { useFormControllerRetry } from 'shared/hook-form/use-form-controller-retry';
import {
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller-context';
import {
  PlaceOrderFormContextValue,
  PlaceOrderFormInput,
  PlaceOrderFormNetworkData,
  StonksMetadata,
} from '@stonks/types';
import { usePlaceOrderAction } from '@stonks/write-actions/place-order/action';
import { useStonksBalanceMap } from '@stonks/hooks/use-stonks-balance-map';
import { useStonksEstimatedOutput } from '@stonks/hooks/use-stonks-estimated-output';

const PlaceOrderFormContext = createContext<
  PlaceOrderFormContextValue | undefined
>(undefined);

export const usePlaceOrderFormData = () => {
  const value = useContext(PlaceOrderFormContext);
  invariant(
    value,
    'usePlaceOrderFormData was used outside the PlaceOrderFormContext provider',
  );
  return value;
};

const usePlaceOrderFormNetworkData = (
  stonksMetadata: StonksMetadata,
): PlaceOrderFormNetworkData => {
  const {
    data: balanceMap,
    isLoading: isBalanceMapLoading,
    isFetchedAfterMount: isBalanceMapFetched,
    refetch: refetchBalanceMap,
  } = useStonksBalanceMap(stonksMetadata.address);

  const balance = balanceMap?.[stonksMetadata.address];

  const {
    data: estimatedOutputFromBalance,
    isLoading: isEstimatedOutputLoading,
    isFetchedAfterMount: isEstimatedOutputFetched,
    refetch: refetchEstimatedOutput,
    fetchEstimatedOutput,
  } = useStonksEstimatedOutput(stonksMetadata.address, balance);

  return {
    balance,
    estimatedOutputFromBalance,
    isLoading: isBalanceMapLoading || isEstimatedOutputLoading,
    isFetched: isBalanceMapFetched && isEstimatedOutputFetched,
    fetchEstimatedOutput,
    refetch: async () => {
      await Promise.allSettled([refetchBalanceMap(), refetchEstimatedOutput()]);
    },
  };
};

type PlaceOrderFormProviderProps = {
  stonksMetadata: StonksMetadata;
  children?: React.ReactNode;
};

export const PlaceOrderFormProvider: FC<PlaceOrderFormProviderProps> = ({
  children,
  stonksMetadata,
}) => {
  const networkData = usePlaceOrderFormNetworkData(stonksMetadata);
  const { retryEvent, retryFire } = useFormControllerRetry();

  const formObject = useForm<PlaceOrderFormInput>({
    defaultValues: {
      sellAmount: undefined,
      minBuyAmount: undefined,
    },
    criteriaMode: 'firstError',
    mode: 'onChange',
  });

  const { watch, reset, register } = formObject;

  const resetForm = useCallback(() => {
    reset({
      sellAmount: networkData.balance,
      minBuyAmount: networkData.estimatedOutputFromBalance,
    });
  }, [networkData.balance, networkData.estimatedOutputFromBalance, reset]);

  // Set default form values when network data is fetched for the first time
  useEffect(() => {
    if (networkData.isFetched) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkData.isFetched]);

  const processOrderPlacement = usePlaceOrderAction({
    stonksMetadata,
    onConfirm: networkData.refetch,
    onRetry: retryFire,
  });

  const value = useMemo(
    () => ({
      ...networkData,
      stonksMetadata,
      register,
      watch,
    }),
    [networkData, stonksMetadata, register, watch],
  );

  const formControllerValue = useMemo(
    (): FormControllerContextValueType<PlaceOrderFormInput> => ({
      onSubmit: processOrderPlacement,
      onReset: resetForm,
      retryEvent,
    }),
    [processOrderPlacement, resetForm, retryEvent],
  );

  return (
    <FormProvider {...formObject}>
      <PlaceOrderFormContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </PlaceOrderFormContext.Provider>
    </FormProvider>
  );
};
