import styled from 'styled-components';

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  font-size: 14px;
`;

export const Label = styled.span`
  color: var(--lido-color-textSecondary);
`;

export const Value = styled.span`
  color: var(--lido-color-text);
  text-align: right;
`;

export const ProposerWrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;
