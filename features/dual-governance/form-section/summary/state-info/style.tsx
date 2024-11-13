import styled from 'styled-components';
import { VisibleGovernanceState } from 'features/dual-governance/types';

type IndicatorProps = {
  $state: VisibleGovernanceState;
};

const getIndicatorColor = (state: VisibleGovernanceState) => {
  switch (state) {
    case VisibleGovernanceState.Normal:
      return 'var(--accent-color-leaf)';
    case VisibleGovernanceState.NormalWarning:
      return 'var(--accent-color-coral)';
    case VisibleGovernanceState.BlockedDeactivation:
      return 'var(--accent-color-orange)';
    case VisibleGovernanceState.BlockedVetoSignalling:
    case VisibleGovernanceState.BlockedRageQuit:
      return 'var(--accent-color-berry)';
    case VisibleGovernanceState.Cooldown:
      return 'var(--accent-color-ocean)';
  }
};

export const StateInfoStyled = styled.div`
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color-fog);
`;

export const StateIndicator = styled.div<IndicatorProps>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => getIndicatorColor(props.$state)};
`;

export const StateStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
