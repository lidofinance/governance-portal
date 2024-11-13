import styled, { css } from 'styled-components';
import { Text } from '../text';

export const TokenLabel = styled(Text)<{ $compact?: boolean }>`
  font-weight: 600;

  ${({ $compact }) =>
    $compact &&
    css`
      flex: 1;
    `}
`;

export const TokenBalanceStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  & > svg {
    width: 40px;
    height: 40px;
  }
`;
