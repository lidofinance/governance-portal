import styled from 'styled-components';
import { PopupMenu, PopupMenuProps, Text } from '@lidofinance/lido-ui';

export const RevokeTokenItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
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
