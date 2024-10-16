import styled, { css } from 'styled-components';
import { Checkbox, Text } from '@lidofinance/lido-ui';

type StatusBadgeProps = {
  $variant: 'success' | 'default';
};

export const Wrapper = styled.div`
  width: 100%;
  border-radius: 24px;
`;

export const ItemsList = styled.div`
  padding: 16px;
  border-radius: 18px;
  border: 1px solid #0000001a;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  margin: 0 -16px;
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
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
  margin-top: 20px;
`;

export const StatusBadge = styled.span<StatusBadgeProps>`
  padding: 10px 30px;
  border-radius: 20px;
  background-color: ${({ $variant }) =>
    $variant === 'success' ? '#29C38C33' : '#1312170F'};
  color: ${({ $variant }) =>
    $variant === 'success' ? '#29C38C' : '#131217B8'};
`;
