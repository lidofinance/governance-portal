import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';

export const SupportPercentage = styled(Text)`
  color: #000;
  text-transform: capitalize;
  font-size: 34px;
  font-weight: 500;
`;

export const SupportValue = styled(Text).attrs({
  size: 'md',
})`
  color: #000;
  font-weight: 600;
`;
