import { VisibleGovernanceState } from '../types';

export const getDualGovernanceBannerColor = (
  status: VisibleGovernanceState,
) => {
  switch (status) {
    case VisibleGovernanceState.Unset:
      return 'gray'; // TODO - add a color for this status
    case VisibleGovernanceState.BlockedVetoSignalling:
    case VisibleGovernanceState.BlockedRageQuit:
    case VisibleGovernanceState.Emergency:
      return 'rgba(214, 72, 90, 1)';
    case VisibleGovernanceState.BlockedDeactivation:
      return 'rgba(252, 97, 62, 1)';
    case VisibleGovernanceState.Warning:
      return 'rgba(255, 154, 1, 1)';
    case VisibleGovernanceState.Cooldown:
      return 'rgba(72, 84, 255, 1)';
    default:
      return 'rgba(53, 192, 139, 1)';
  }
};
