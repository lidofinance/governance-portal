import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useEthereumBalance } from 'shared/blockchain/hooks/use-ethereum-balance';
import { useTokenBalance } from 'shared/blockchain/hooks/use-token-balance';
import { Token } from 'shared/blockchain/types';
import invariant from 'tiny-invariant';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller-context';
import { useFormControllerRetry } from 'shared/hook-form/use-form-controller-retry';
import { SupportFormValidationResolver } from './support-form-validators';
import { useSupportFormValidationContext } from '../use-support-form-validation-context';
import { SupportFormNetworkData } from './types';
import {
  UseApproveResponse,
  useApprove,
} from 'shared/blockchain/hooks/use-approve';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useEscrowBalances } from 'features/dual-governance/hooks/use-escrow-balances';
import {
  EscrowActionArgs,
  VetoSupportedTokens,
} from 'features/dual-governance/types';
import { useUnstEthBalance } from 'shared/blockchain/hooks/use-unsteth-balance';
import { NftMultiselectValuesMap } from 'features/dual-governance/nft-multiselect';
import { useSupportVetoAction } from 'features/dual-governance/write-actions/support-veto/action';

export type SupportFormInputType = {
  amount: bigint | null;
  token: VetoSupportedTokens;
  selectedNftIds: NftMultiselectValuesMap;
};

type SupportFormContextValue = {
  selectedToken: VetoSupportedTokens;
  networkData: SupportFormNetworkData;
  maxAmount: bigint;
  approveData: UseApproveResponse;
};

const SupportFormContext = createContext<SupportFormContextValue | null>(null);

export const useSupportFormDataContext = () => {
  const value = useContext(SupportFormContext);
  invariant(
    value,
    'useSupportFormDataContext was used outside the SupportFormContext provider',
  );
  return value;
};

const useSupportFormNetworkData = (): SupportFormNetworkData => {
  const {
    vetoSignallingAddress,
    isAssetManagementLocked,
    refetch: refetchDualGovernanceState,
  } = useDualGovernanceContext();

  const { refetch: refetchEscrowBalances } = useEscrowBalances();

  const {
    data: stEthBalance,
    refetch: updateStEthBalance,
    isLoading: isStEthBalanceLoading,
  } = useTokenBalance(Token.stETH);

  const {
    data: wstEthBalance,
    refetch: updateWstEthBalance,
    isLoading: isWstEthBalanceLoading,
  } = useTokenBalance(Token.wstETH);

  const {
    data: etherBalance,
    refetch: updateEtherBalance,
    isLoading: isEtherBalanceLoading,
  } = useEthereumBalance();

  const {
    data: unSthEthData,
    refetch: updateUnStEthBalance,
    isLoading: isUnStEthBalanceLoading,
  } = useUnstEthBalance();

  const refetch = useCallback(async () => {
    await Promise.allSettled([
      updateStEthBalance(),
      updateWstEthBalance(),
      updateEtherBalance(),
      refetchDualGovernanceState(),
      refetchEscrowBalances(),
      updateUnStEthBalance(),
    ]);
  }, [
    refetchDualGovernanceState,
    refetchEscrowBalances,
    updateEtherBalance,
    updateStEthBalance,
    updateWstEthBalance,
    updateUnStEthBalance,
  ]);

  return {
    etherBalance: etherBalance?.value,
    stEthBalance,
    wstEthBalance,
    unstEthBalance: unSthEthData?.requestsTotalStEthAmount,
    withdrawalRequests: unSthEthData?.withdrawalRequests,
    vetoSignallingAddress,
    isAssetManagementLocked,
    isLoading:
      isStEthBalanceLoading ||
      isWstEthBalanceLoading ||
      isEtherBalanceLoading ||
      isUnStEthBalanceLoading,
    refetch,
  };
};

export const SupportFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useSupportFormNetworkData();
  const validationContextPromise = useSupportFormValidationContext({
    networkData,
  });
  const { retryEvent, retryFire } = useFormControllerRetry();

  const formObject = useForm<SupportFormInputType>({
    defaultValues: {
      amount: null,
      token: Token.stETH,
      selectedNftIds: {},
    },
    context: validationContextPromise,
    criteriaMode: 'firstError',
    mode: 'onChange',
    resolver: SupportFormValidationResolver,
  });

  const {
    watch,
    reset,
    setValue,
    formState: { defaultValues },
  } = formObject;

  useEffect(() => {
    const { unsubscribe } = watch((value, { name }) => {
      if (name === 'token' && value.amount !== null) {
        setValue('amount', null, { shouldDirty: true });
      }
    });
    return () => unsubscribe();
  }, [watch, setValue]);

  const { amount, token: selectedToken, selectedNftIds } = watch();

  const nftIdsLength = BigInt(Object.keys(selectedNftIds).length);

  const approveData = useApprove(
    selectedToken === Token.unstETH ? nftIdsLength : amount,
    selectedToken,
    networkData.vetoSignallingAddress,
  );

  const onConfirm = useCallback(async () => {
    await Promise.allSettled([networkData.refetch(), approveData.refetch()]);
  }, [networkData, approveData]);

  const processWrapFormFlow = useSupportVetoAction({
    approveData,
    onConfirm,
    onRetry: retryFire,
  });

  const maxAmount = useMemo(() => {
    if (selectedToken === Token.stETH) {
      return networkData.stEthBalance ?? 0n;
    }
    if (selectedToken === Token.wstETH) {
      return networkData.wstEthBalance ?? 0n;
    }
    return 0n;
  }, [selectedToken, networkData.stEthBalance, networkData.wstEthBalance]);

  const value = useMemo(
    () => ({
      selectedToken,
      networkData,
      maxAmount,
      approveData,
    }),
    [selectedToken, networkData, maxAmount, approveData],
  );

  const formControllerValue = useMemo(
    (): FormControllerContextValueType<EscrowActionArgs> => ({
      onSubmit: processWrapFormFlow,
      onReset: ({ token }: EscrowActionArgs) => {
        reset({
          ...defaultValues,
          token,
        });
      },
      retryEvent,
    }),
    [processWrapFormFlow, retryEvent, reset, defaultValues],
  );

  return (
    <FormProvider {...formObject}>
      <SupportFormContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </SupportFormContext.Provider>
    </FormProvider>
  );
};
