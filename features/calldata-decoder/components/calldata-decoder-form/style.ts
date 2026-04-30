import { Block } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const FormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  margin: ${({ theme }) => theme.spaceMap.lg}px 0;
`;

export const CalldataDecoderResultStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  margin-top: ${({ theme }) => theme.spaceMap.md}px;
`;

export const BlockStyled = styled(Block)<{ $gapLess?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  padding: 18px;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  word-break: break-all;

  ${({ $gapLess }) =>
    $gapLess &&
    `
    gap: 0;
  `}
`;
