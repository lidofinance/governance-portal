import styled from 'styled-components';
import { Button } from 'shared/components/button';

export const Actions = styled.div`
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
  fullwidth: true,
})`
  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ActionButtonsStyled = styled.section`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 12px;
`;
