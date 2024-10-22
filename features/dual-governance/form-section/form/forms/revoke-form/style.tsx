import styled, { css } from 'styled-components';
import { PopupMenu, PopupMenuProps, Text } from '@lidofinance/lido-ui';

export const RevokeTokenItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

type RevokeItemProps = {
  $plain?: boolean;
  $interactive?: boolean;
  onClick?: () => void;
};

export const StyledRevokeTokenItem = styled.div<RevokeItemProps>`
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

export const StyledRevokePopup = styled(PopupMenu)<PopupMenuProps>`
  box-shadow: 0 4px 50px #18284933;
  border: 1px solid #0000001a;
  border-radius: 24px;
`;

export const ContractLink = styled(Text).attrs({
  as: 'span',
})`
  cursor: pointer;
  color: #0085ff;
  font-size: 18px;
`;
