import styled from 'styled-components';
import { Button } from '@lidofinance/lido-ui';

export const Actions = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
  display: flex;
  gap: 10px;

  @media (max-width: 375px) {
    flex-direction: column;
  }

  > * {
    flex: 1 1 50%;

    @media (max-width: 375px) {
      flex-basis: auto;
    }
  }
`;

export const VoteButton = styled(Button).attrs({
  size: 'sm',
  color: 'secondary',
  fullwidth: true,
})`
  text-align: left;
  svg {
    display: block;
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
`;

export const ActionButtonsStyled = styled.section`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 12px;
`;
