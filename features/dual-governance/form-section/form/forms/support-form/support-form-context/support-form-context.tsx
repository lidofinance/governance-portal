import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
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
import { useEscrowAddresses } from 'features/dual-governance/hooks/use-escrow-addresses';
import { useSupportFormProcessor } from './use-support-form-processor';

const TOKENS = [Token.stETH, Token.wstETH, Token.unstETH] as const;

type TokenLocal = (typeof TOKENS)[number];

export type SupportFormInputType = {
  amount: null | bigint;
  token: TokenLocal;
};

type SupportFormContextValue = {
  activeToken: TokenLocal;
  setActiveToken: (token: TokenLocal) => void;
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

  const { vetoSignallingAddress, isLoading: isEscrowAddressLoading } =
    useEscrowAddresses();

  const refetch = useCallback(async () => {
    await Promise.allSettled([
      updateStEthBalance(),
      updateWstEthBalance(),
      updateEtherBalance(),
    ]);
  }, [updateEtherBalance, updateStEthBalance, updateWstEthBalance]);

  return {
    etherBalance: etherBalance?.value,
    stEthBalance,
    wstEthBalance,
    vetoSignallingAddress,
    isLoading:
      isStEthBalanceLoading ||
      isWstEthBalanceLoading ||
      isEtherBalanceLoading ||
      isEscrowAddressLoading,
    refetch,
  };
};

export const SupportFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useSupportFormNetworkData();
  const [activeToken, setActiveToken] = useState<TokenLocal>(TOKENS[0]);
  const validationContextPromise = useSupportFormValidationContext({
    networkData,
  });
  const { retryEvent, retryFire } = useFormControllerRetry();

  const formObject = useForm<SupportFormInputType>({
    defaultValues: {
      amount: null,
      token: TOKENS[0],
    },
    context: validationContextPromise,
    criteriaMode: 'firstError',
    mode: 'onChange',
    resolver: SupportFormValidationResolver,
  });

  const {
    watch,
    reset,
    formState: { defaultValues },
  } = formObject;

  const amount = watch('amount');

  const approveData = useApprove(
    amount,
    activeToken,
    networkData.vetoSignallingAddress,
  );

  const onConfirm = useCallback(async () => {
    await Promise.allSettled([networkData.refetch(), approveData.refetch()]);
  }, [networkData, approveData]);

  const processWrapFormFlow = useSupportFormProcessor({
    approveData,
    escrowAddress: networkData.vetoSignallingAddress,
    onConfirm,
    onRetry: retryFire,
  });

  const maxAmount = useMemo(() => {
    if (activeToken === Token.stETH) {
      return networkData.stEthBalance ?? 0n;
    }
    if (activeToken === Token.wstETH) {
      return networkData.wstEthBalance ?? 0n;
    }
    return 0n;
  }, [activeToken, networkData.stEthBalance, networkData.wstEthBalance]);

  const value = useMemo(
    () => ({
      activeToken,
      setActiveToken,
      networkData,
      maxAmount,
      approveData,
    }),
    [activeToken, approveData, maxAmount, networkData],
  );

  const formControllerValue = useMemo(
    (): FormControllerContextValueType<SupportFormInputType> => ({
      onSubmit: processWrapFormFlow,
      onReset: ({ token }: SupportFormInputType) => {
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
