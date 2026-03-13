import styled from 'styled-components';
import { Text } from 'shared/components/text';
import { MotionDisplayStatus } from '../types';
import { DashboardCard } from 'shared/components/dashboard-card';

export const CardTitle = styled(Text).attrs({
  size: 14,
  weight: 700,
})`
  color: rgb(39, 56, 82);
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const DescWrapper = styled.div`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;

  ul,
  li {
    list-style-position: inside;
  }
`;

export const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border-radius: 24px;
  background: rgba(39, 56, 82, 0.1);
`;

const statusColorMap: Record<MotionDisplayStatus, string> = {
  [MotionDisplayStatus.ACTIVE]: 'var(--lido-color-primary)',
  [MotionDisplayStatus.ATTENDED]: 'var(--accent-color-coral)',
  [MotionDisplayStatus.DANGER]: 'var(--accent-color-berry-light)',
  [MotionDisplayStatus.ATTENDED_DANGER]: 'var(--accent-color-berry)',
  [MotionDisplayStatus.ENACTED]: 'var(--accent-color-leaf)',
  [MotionDisplayStatus.DEFAULT]: 'var(--primary-color-black-50)',
};

export const CardStatusWrapper = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
`;

export const Card = styled(DashboardCard)<{
  $displayStatus: MotionDisplayStatus;
}>`
  & > ${CardStatusWrapper} > * {
    color: ${({ $displayStatus }) => statusColorMap[$displayStatus]};
  }
`;
