import styled from 'styled-components';

export const SearchSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: -8px;
  margin-bottom: ${({ theme }) => theme.spaceMap.xl}px;
  font-size: 16px;
  color: var(--lido-color-textSecondary);
`;

export const SearchSummaryQuery = styled.span`
  color: var(--lido-color-text);
`;

export const ClearFilterButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 16px;
  color: var(--accent-color-sky);
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
