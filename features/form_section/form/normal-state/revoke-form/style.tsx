import styled, { css } from 'styled-components';

export const RevokeItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

type RevokeItemProps = {
  $plain?: boolean;
  $interactive?: boolean;
};

export const RevokeItem = styled.div<RevokeItemProps>`
  padding: 20px;
  border-radius: ${({ $plain }) => ($plain ? 0 : '24px')};
  border: ${({ $plain }) => ($plain ? 'none' : '1px solid #0000001a;')};
  display: flex;
  align-items: center;
  gap: 12px;
  ${({ $interactive }) =>
    $interactive &&
    css`
      cursor: pointer;
    `}
  &:not(:last-child) {
    ${({ $plain }) =>
      $plain &&
      css`
        border-bottom: 1px solid #0000001a;
      `}
  }
`;

export const RevokeAction = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;
