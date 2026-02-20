import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import invariant from 'tiny-invariant';
import {
  DualGovernanceDetailedState,
  GovernanceState,
  VisibleGovernanceState,
} from '../features/dual-governance/types';
import { useDualGovernanceState } from '../features/dual-governance/hooks';
import { useIsEmergencyModeActive } from '../features/dual-governance/hooks/use-is-emergency-mode-active';
import { useDualGovernanceVisibleState } from '../features/dual-governance/hooks/use-dual-governance-visible-state';

type DualGovernanceStateContextValue = {
  isAssetManagementLocked: boolean;
  visibleState: VisibleGovernanceState;
  detailedState: DualGovernanceDetailedState;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

const defaultDetailedState: DualGovernanceDetailedState = {
  effectiveState: 0,
  persistedState: 0,
  persistedStateEnteredAt: 0,
  vetoSignallingActivatedAt: 0,
  vetoSignallingReactivationTime: 0,
  normalOrVetoCooldownExitedAt: 0,
  rageQuitRound: 0n,
  vetoSignallingDuration: 0,
};

const DualGovernanceStateContext =
  createContext<DualGovernanceStateContextValue>({
    visibleState: VisibleGovernanceState.Loading,
    isAssetManagementLocked: false,
    detailedState: {
      effectiveState: 0,
      persistedState: 0,
      persistedStateEnteredAt: 0,
      vetoSignallingActivatedAt: 0,
      vetoSignallingReactivationTime: 0,
      normalOrVetoCooldownExitedAt: 0,
      rageQuitRound: 0n,
      vetoSignallingDuration: 0,
    },
    isLoading: true,
    error: null,
    refetch: async () => {},
  });

export const useDualGovernanceStateContext = () => {
  const value = useContext(DualGovernanceStateContext);
  invariant(
    value,
    'useDualGovernanceStateContext was used outside the DualGovernanceStateContext provider',
  );
  return value;
};

export const DualGovernanceStateProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { isEmergencyModeActive, isLoading: isEmergencyModeActiveLoading } =
    useIsEmergencyModeActive();

  const {
    data: detailedState,
    isLoading: isDualGovernanceStateLoading,
    error: dualGovernanceStateError,
    refetch: refetchDualGovernanceState,
  } = useDualGovernanceState({
    isEnabled: !isEmergencyModeActive && !isEmergencyModeActiveLoading,
  });

  const actualDetailedState = !detailedState
    ? defaultDetailedState
    : detailedState;

  const persistedState = detailedState
    ? detailedState.persistedState
    : GovernanceState.Normal;

  const isAssetManagementLocked =
    actualDetailedState.persistedState !== GovernanceState.RageQuit &&
    actualDetailedState.effectiveState === GovernanceState.RageQuit;

  const hookVisibleState = useDualGovernanceVisibleState({
    persistedState,
    isEmergencyModeActive,
    isEmergencyModeActiveLoading,
  });

  const visibleState = useMemo(() => {
    if (isDualGovernanceStateLoading) {
      return VisibleGovernanceState.Loading;
    }
    if (isEmergencyModeActive) {
      return VisibleGovernanceState.Emergency;
    }
    return hookVisibleState;
  }, [isDualGovernanceStateLoading, isEmergencyModeActive, hookVisibleState]);

  const value: DualGovernanceStateContextValue = {
    visibleState,
    isAssetManagementLocked,
    detailedState: actualDetailedState,
    isLoading: isDualGovernanceStateLoading,
    error: dualGovernanceStateError,
    refetch: async () => {
      try {
        await refetchDualGovernanceState();
      } catch (error) {
        console.error('Failed to refetch dual governance state:', error);
      }
    },
  };

  return (
    <DualGovernanceStateContext.Provider value={value}>
      {children}
    </DualGovernanceStateContext.Provider>
  );
};
