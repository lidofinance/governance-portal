import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';
import { GovernanceStateIndicator } from 'features/dual-governance/types';

type IndicatorProps = {
  $state: GovernanceStateIndicator;
};

const indicatorColors = {
  [GovernanceStateIndicator.Normal]: '#29C38C',
  [GovernanceStateIndicator.Blocked]: '#D74758',
  [GovernanceStateIndicator.Attention]: '#FF9900',
};

export const CurrentStateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StateName = styled(Text)`
  color: #000;
  text-transform: capitalize;
  font-size: 34px;
  font-weight: 500;
`;

export const StateIndicator = styled.div<IndicatorProps>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) =>
    indicatorColors[props.$state] ||
    indicatorColors[GovernanceStateIndicator.Normal]};
`;

export const StateDescription = styled(Text).attrs({
  size: 'md',
})`
  color: #000;
  font-weight: 600;
`;
