import Link from 'next/link';
import styled from 'styled-components';

export const ListStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 20px;
`;

export const Card = styled(Link)<{ $empty?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  background-color: var(--lido-color-foreground);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  box-shadow: 0px 4px 32px var(--lido-color-shadowLight);
  color: inherit;
  text-decoration: none;
  opacity: ${({ $empty }) => ($empty ? 0.6 : 1)};
`;

export const CardTitle = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;
