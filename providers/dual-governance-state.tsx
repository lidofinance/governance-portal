import { createContext, useContext, useEffect, useState } from 'react';
import invariant from 'tiny-invariant';
import { GovernanceStateIndicator } from 'types/dual-governance';

type DualGovernanceStateContextValue = {
  currentGovernanceState: GovernanceStateIndicator | null;
};

const DualGovernanceStateContext =
  createContext<DualGovernanceStateContextValue | null>(null);
DualGovernanceStateContext.displayName = 'DualGovernanceStateContext';

export const useDualGovernanceState = () => {
  const value = useContext(DualGovernanceStateContext);
  invariant(
    value,
    'useDualGovernanceState was used outside of DualGovernanceStateProvider',
  );
  return value;
};

export const DualGovernanceStateProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [currentGovernanceState, setCurrentGovernanceState] =
    useState<GovernanceStateIndicator | null>(null);

  // TODO: remove HARDCODE
  // Fetch state
  useEffect(() => {
    setCurrentGovernanceState(GovernanceStateIndicator.Normal);
  }, []);

  const value: DualGovernanceStateContextValue = {
    currentGovernanceState,
  };

  return (
    <DualGovernanceStateContext.Provider value={value}>
      {children}
    </DualGovernanceStateContext.Provider>
  );
};
