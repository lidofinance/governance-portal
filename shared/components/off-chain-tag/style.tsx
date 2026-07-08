import styled from 'styled-components';

export const Pill = styled.span`
  vertical-align: text-bottom;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 700;
  line-height: 1.5;
  white-space: nowrap;
  color: var(--lido-color-textSecondary);
  background: var(--lido-color-backgroundSecondary);
  margin-right: 6px;
`;
