import styled from 'styled-components';

export const DashboardCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  height: 280px;
  word-break: break-all;
  background-color: var(--lido-color-foreground);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  box-shadow: 0 4px 32px var(--lido-color-shadowLight);
  text-decoration: none;
`;
