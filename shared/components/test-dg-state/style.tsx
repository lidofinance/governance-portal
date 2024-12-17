import styled from 'styled-components';
import { VisibleGovernanceState } from 'features/dual-governance/types';

const getIndicatorColor = (state: VisibleGovernanceState | undefined) => {
  switch (state) {
    case VisibleGovernanceState.Normal:
      return 'var(--accent-color-leaf)';
    case VisibleGovernanceState.Warning:
      return 'var(--accent-color-coral)';
    case VisibleGovernanceState.BlockedDeactivation:
      return 'var(--accent-color-orange)';
    case VisibleGovernanceState.BlockedVetoSignalling:
    case VisibleGovernanceState.BlockedRageQuit:
      return 'var(--accent-color-berry)';
    case VisibleGovernanceState.Cooldown:
      return 'var(--accent-color-ocean)';
    default:
      return 'var(--accent-color-leaf)';
  }
};

export const Wrapper = styled.div``;

export const Indicator = styled.div<{ $state: VisibleGovernanceState }>`
  height: 100%;
  width: 10px;
  background-color: ${(props) => getIndicatorColor(props.$state)};
  flex-shrink: 0;
  position: absolute;
  left: -5px;
  border-radius: 10px;
`;

export const States = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StateItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  padding-left: 20px;
  p {
    line-height: 1.8;
  }
`;

export const CurrentState = styled.div`
  margin-top: 20px;
  gap: 12px;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

export const Actions = styled.div`
  margin-top: 20px;
  flex-direction: column;
  align-items: flex-start;
  display: flex;
  gap: 12px;
`;
