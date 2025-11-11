import styled from 'styled-components';
import { Text } from 'shared/components/text';
import { Block } from '@lidofinance/lido-ui';

export const CardTitle = styled(Text).attrs({
  size: 14,
  weight: 800,
})`
  margin-bottom: 8px;
`;

export const Card = styled(Block)`
  padding: 16px;
`;
