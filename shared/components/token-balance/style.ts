import styled, { css } from 'styled-components';
import { Text } from '../text';

export const TokenLabel = styled(Text)<{ $compact?: boolean }>`
  font-weight: 600;
  display: inline-flex;
  gap: 10px;

  ${({ $compact }) =>
    $compact &&
    css`
      flex: 1;
    `}
`;

export const TokenBalanceStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  & > svg {
    width: 40px;
    height: 40px;
  }
`;
