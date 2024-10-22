import styled, { css } from 'styled-components';
import { Checkbox, Text } from '@lidofinance/lido-ui';

type StatusBadgeProps = {
  $variant: 'success' | 'default';
};

export const Wrapper = styled.div`
  width: 100%;
  background: white;
`;

export const NftItemsList = styled.section`
  padding: 0 16px;
  border-radius: 30px;
  border: 1px solid #0000001a;
`;

type ItemProps = {
  $checked?: boolean;
};

export const NftItem = styled.div<ItemProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  margin: 0 -16px;
  ${({ $checked }) =>
    $checked &&
    css`
      background-color: #0085ff14;
    `}
  &:first-child {
    border-top-left-radius: 28px;
    border-top-right-radius: 28px;
  }
  &:last-child {
    border-bottom-left-radius: 28px;
    border-bottom-right-radius: 28px;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #0000001a;
  }
`;

export const Amount = styled(Text)`
  margin-left: auto;
  margin-right: 8px;
`;

export const StyledCheckbox = styled(Checkbox)`
  // ignore flex gap
  margin-right: calc(20px - 8px);
`;

export const ActionsWrapper = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 10px;
`;

export const StatusBadge = styled.span<StatusBadgeProps>`
  padding: 10px 30px;
  border-radius: 20px;
  background-color: ${({ $variant }) =>
    $variant === 'success' ? '#29C38C33' : '#1312170F'};
  color: ${({ $variant }) =>
    $variant === 'success' ? '#29C38C' : '#131217B8'};
`;

export const SelectAllWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px;
`;

export const SelectAllButton = styled(Text)`
  cursor: pointer;
  color: var(--lido-color-primary);
`;
