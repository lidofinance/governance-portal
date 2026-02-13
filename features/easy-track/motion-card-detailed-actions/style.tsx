import styled from 'styled-components';
import { Button } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;

  > *:not(:last-child) {
    margin-right: 10px;
  }
`;

export const Hint = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  margin-bottom: 10px;
  opacity: 0.8;
`;

export const ButtonStyled = styled(Button)`
  flex-grow: 1;
  flex-basis: 40%;
`;
