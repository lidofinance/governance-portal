import { createContext, useContext, useEffect, useState } from 'react';
import invariant from 'tiny-invariant';
import { GovernanceStateIndicator } from 'features/dual-governance/types';

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

type Props = {
  children: React.ReactNode;
};

export const DualGovernanceStateProvider = ({ children }: Props) => {
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
