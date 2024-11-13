import { VisibleGovernanceState } from 'features/dual-governance/types';
import { StateIndicator, StateInfoStyled, StateStatus } from './style';
import { Text } from 'shared/components/text';

const getStateLabel = (state: VisibleGovernanceState) => {
  switch (state) {
    case VisibleGovernanceState.Normal:
    case VisibleGovernanceState.NormalWarning:
      return 'Normal';
    case VisibleGovernanceState.BlockedVetoSignalling:
    case VisibleGovernanceState.BlockedDeactivation:
    case VisibleGovernanceState.BlockedRageQuit:
      return 'Blocked';
    case VisibleGovernanceState.Cooldown:
      return 'Cooldown';
  }
};

const getStateSubtitle = (state: VisibleGovernanceState) => {
  switch (state) {
    case VisibleGovernanceState.BlockedDeactivation:
      return 'Deactivation';
    case VisibleGovernanceState.BlockedVetoSignalling:
      return 'VetoSignalling';
    case VisibleGovernanceState.BlockedRageQuit:
      return 'RageQuit';
    default:
      return null;
  }
};

type Props = {
  state: VisibleGovernanceState;
};

export const StateInfo = ({ state }: Props) => {
  const subtitle = getStateSubtitle(state);

  return (
    <StateInfoStyled>
      <Text size={22} weight={300} color="secondary">
        State
      </Text>
      <StateStatus>
        <Text size={34}>{getStateLabel(state)}</Text>
        <StateIndicator $state={state} />
      </StateStatus>
      {subtitle ? <Text>{subtitle}</Text> : null}
    </StateInfoStyled>
  );
};
