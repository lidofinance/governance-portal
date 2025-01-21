import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  FC,
} from 'react';
import invariant from 'tiny-invariant';
import {
  DualGovernanceState,
  VisibleGovernanceState,
} from 'features/dual-governance/types';
import {
  useDualGovernanceState,
  useEscrowAddresses,
} from 'features/dual-governance/hooks';
import { Address } from 'viem';
import { useActivateNextStateEventWatcher } from '../features/dual-governance/hooks/use-dual-governance-state';
import { useLidoSDK } from './lido-sdk';

type WithUndefined<T> = {
  [K in keyof T]?: T[K];
};

type DualGovernanceContextValue = {
  vetoSignallingAddress?: Address;
  rageQuitAddress?: Address;
  visibleState: VisibleGovernanceState;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} & WithUndefined<DualGovernanceState>;

export const DualGovernanceContext = createContext<DualGovernanceContextValue>({
  visibleState: VisibleGovernanceState.Loading,
  isLoading: true,
  error: null,
  refetch: async () => {},
});

export const useDualGovernanceContext = () => {
  const value = useContext(DualGovernanceContext);
  invariant(
    value,
    'useDualGovernanceContext was used outside the SupportFormContext provider',
  );
  return value;
};

export const DualGovernanceStateProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { chainId } = useLidoSDK();
  const {
    vetoSignallingAddress,
    rageQuitAddress,
    isLoading: isAddressDataLoading,
    error: addressDataError,
  } = useEscrowAddresses();

  const {
    data: dualGovernanceState,
    isLoading: isDualGovernanceStateLoading,
    error: dualGovernanceStateError,
    refetch: refetchDualGovernanceState,
  } = useDualGovernanceState({ vetoSignallingAddress });

  useActivateNextStateEventWatcher({
    chainId,
    refetchFn: refetchDualGovernanceState,
  });

  const value: DualGovernanceContextValue = useMemo(
    () => ({
      ...dualGovernanceState,
      vetoSignallingAddress,
      rageQuitAddress,
      visibleState:
        dualGovernanceState?.visibleState ?? VisibleGovernanceState.Loading,
      isLoading: isAddressDataLoading || isDualGovernanceStateLoading,
      error: addressDataError || dualGovernanceStateError,
      refetch: async () => {
        await refetchDualGovernanceState();
      },
    }),
    [
      vetoSignallingAddress,
      rageQuitAddress,
      dualGovernanceState,
      isAddressDataLoading,
      isDualGovernanceStateLoading,
      addressDataError,
      dualGovernanceStateError,
      refetchDualGovernanceState,
    ],
  );

  return (
    <DualGovernanceContext.Provider value={value}>
      {children}
    </DualGovernanceContext.Provider>
  );
};
