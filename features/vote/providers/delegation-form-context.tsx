import { FC, useMemo, createContext, useContext, useCallback } from 'react';
import invariant from 'tiny-invariant';
import { FormProvider, useForm } from 'react-hook-form';
import {
  DelegationFormContextValue,
  DelegationFormInput,
  DelegationFormMode,
  DelegationFormNetworkData,
} from '../types';
import { useDaoTokenBalance } from '../hooks/use-dao-token-balance';
import { useDelegationInfo } from '../hooks/use-delegation-info';
import { useProcessedPublicDelegatesList } from '../hooks/use-processed-public-delegates-list';
import { useDelegateAction } from '../write-actions/delegate/action';
import { useFormControllerRetry } from 'shared/hook-form/use-form-controller-retry';
import { useRevokeDelegationAction } from '../write-actions/revoke-delegation/action';
import {
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller-context';

const DelegationFormContext = createContext<
  DelegationFormContextValue | undefined
>(undefined);

export const useDelegationFormData = () => {
  const value = useContext(DelegationFormContext);
  invariant(
    value,
    'useDelegationFormData was used outside the DelegationFormContext provider',
  );
  return value;
};

const useDelegationFormNetworkData = (): DelegationFormNetworkData => {
  const { data: daoTokenBalance, isLoading: isDaoTokenBalanceLoading } =
    useDaoTokenBalance();

  const {
    data: delegationInfo,
    isLoading: isDelegationInfoLoading,
    refetch: refetchDelegationInfo,
  } = useDelegationInfo();

  const { refetch: refetchDelegatesList } = useProcessedPublicDelegatesList();

  const refetch = useCallback(async () => {
    await Promise.allSettled([refetchDelegationInfo(), refetchDelegatesList()]);
  }, [refetchDelegatesList, refetchDelegationInfo]);

  const loading = useMemo(
    () => ({
      isDelegationInfoLoading,
      isDaoTokenBalanceLoading,
    }),
    [isDelegationInfoLoading, isDaoTokenBalanceLoading],
  );

  return {
    aragonDelegateAddress: delegationInfo?.aragonDelegateAddress,
    aragonPublicDelegate: delegationInfo?.aragonPublicDelegate,
    snapshotDelegateAddress: delegationInfo?.snapshotDelegateAddress,
    snapshotPublicDelegate: delegationInfo?.snapshotPublicDelegate,
    daoTokenBalance,
    loading,
    refetch,
  };
};

export type DelegationFormProviderProps = {
  mode: DelegationFormMode;
  children?: React.ReactNode;
};

export const DelegationFormProvider: FC<DelegationFormProviderProps> = ({
  children,
  mode,
}) => {
  const networkData = useDelegationFormNetworkData();
  // const validationContextPromise = useSupportFormValidationContext({
  //   networkData,
  // });
  const { retryEvent, retryFire } = useFormControllerRetry();

  const formObject = useForm<DelegationFormInput>({
    defaultValues: { delegateAddress: null },
    // context: validationContextPromise,
    criteriaMode: 'firstError',
    mode: 'onChange',
    // resolver: SupportFormValidationResolver,
  });

  const { watch, reset, register } = formObject;

  const processDelegation = useDelegateAction({
    mode,
    onConfirm: networkData.refetch,
    onRetry: retryFire,
  });

  const processRevoke = useRevokeDelegationAction({
    onConfirm: networkData.refetch,
    onRetry: retryFire,
  });

  const value = useMemo(
    () => ({
      ...networkData,
      mode,
      onRevoke: processRevoke,
      register,
      watch,
    }),
    [networkData, mode, processRevoke, register, watch],
  );

  const formControllerValue = useMemo(
    (): FormControllerContextValueType<DelegationFormInput> => ({
      onSubmit: processDelegation,
      onReset: ({ delegateAddress }: DelegationFormInput) => {
        reset({ delegateAddress });
      },
      retryEvent,
    }),
    [retryEvent, processDelegation, reset],
  );

  return (
    <FormProvider {...formObject}>
      <DelegationFormContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </DelegationFormContext.Provider>
    </FormProvider>
  );
};
