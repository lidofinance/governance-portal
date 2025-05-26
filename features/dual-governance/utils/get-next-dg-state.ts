import { GovernanceState } from '../types';

type Props = {
  currentState?: GovernanceState;
  vetoSignallingThresholdPercent: number;
  rageQuitThresholdPercent: number;
};

export const getNextGovernanceState = ({
  currentState,
  vetoSignallingThresholdPercent,
  rageQuitThresholdPercent,
}: Props) => {
  if (!currentState) {
    return null;
  }

  if (
    [
      GovernanceState.VetoSignalling,
      GovernanceState.RageQuit,
      GovernanceState.VetoSignallingDeactivation,
    ].indexOf(currentState) === -1
  ) {
    return null;
  }

  if (currentState === GovernanceState.VetoSignalling) {
    if (rageQuitThresholdPercent > 100) {
      return GovernanceState.RageQuit;
    }
  } else if (currentState === GovernanceState.VetoSignallingDeactivation) {
    if (rageQuitThresholdPercent > 100) {
      return GovernanceState.RageQuit;
    } else {
      return GovernanceState.VetoCooldown;
    }
  }

  if (currentState === GovernanceState.RageQuit) {
    // If we've reached the VetoSignalling threshold, the next state is VetoSignalling
    // Otherwise, the next state is VetoCooldown
    if (vetoSignallingThresholdPercent >= 100) {
      return GovernanceState.VetoSignalling;
    } else {
      return GovernanceState.VetoCooldown;
    }
  }
};
