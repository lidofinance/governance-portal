import styled from 'styled-components';
import { PopupMenu, PopupMenuProps, Text } from '@lidofinance/lido-ui';
import { Button } from 'shared/components/button';

export const RevokeTokenItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

export const RevokeStEthPopupStyled = styled(PopupMenu)<PopupMenuProps>`
  box-shadow: 0 4px 50px #18284933;
  border: 1px solid #0000001a;
  border-radius: 24px;
  min-width: 400px;
`;

export const RevokeStEthPopupItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  width: 100%;
  padding: 16px 24px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 133, 255, 0.1);
  }

  &:not(:last-child) {
    border-bottom: 1px solid #0000001a;
  }

  & > div:first-child {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const RevocableTokensList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  margin-bottom: 30px;
`;

export const RevocableTokenItemStyled = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: var(--primary-color-white);
  line-height: 0;

  ${({ $disabled }) =>
    $disabled &&
    `
    background: rgba(0, 0, 0, 0.04);

    & > ${InQueueInfo} {
    cursor: default;
    &:hover > svg {
      background-color: transparent;
    }
      }
  `}
`;

export const InQueueInfo = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  cursor: pointer;

  svg {
    border-radius: 50%;
  }

  &:hover > svg {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const RevokeButton = styled(Button)`
  display: flex;
  align-items: center;
  padding: 5px 7px 5px 20px;
  line-height: 0;

  svg {
    fill: white;
  }
`;

export const NoTokensMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const NftClaimTrigger = styled(Text)`
  color: var(--accent-color-ocean-light);
  cursor: pointer;
  padding-bottom: 10px;
  text-align: right;
`;
