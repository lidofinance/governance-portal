import { DashboardCard } from 'shared/components/dashboard-card';
import styled from 'styled-components';

export const Title = styled.div`
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MotionDashboardCard = styled(DashboardCard)`
  height: 300px;
  padding: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const MotionCardBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
`;
