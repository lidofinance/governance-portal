import styled from 'styled-components';
import { Text } from 'shared/components/text';
import { DashboardCard } from 'shared/components/dashboard-card';

export const VoteDashboardCard = styled(DashboardCard)`
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 999px) {
    flex-direction: column;
    height: auto;
  }
`;

export const VoteTitle = styled(Text).attrs({
  size: 20,
  weight: 700,
})``;

export const VoteDescriptionWrap = styled(Text).attrs({
  size: 14,
  weight: 400,
})`
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
  line-height: 20px;
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;

  span {
    white-space: normal;
  }

  div {
    display: inline-flex;
    vertical-align: middle;
  }
`;

export const VoteSummary = styled.section`
  width: 70%;

  @media (max-width: 999px) {
    width: 100%;
  }
`;

export const VoteQuorum = styled.section`
  width: 274px;
  margin-left: auto;

  @media (max-width: 999px) {
    width: 100%;
    margin-left: 0;
    margin-top: ${({ theme }) => theme.spaceMap.xl}px;
  }
`;

export const QuorumRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
`;

export const QuorumLabel = styled(Text).attrs({
  size: 14,
  weight: 700,
})`
  color: var(--lido-color-text);
`;

export const QuorumValue = styled(Text).attrs({
  as: 'span',
  size: 14,
})`
  color: var(--lido-color-text);
  font-weight: 400;
`;

export const QuorumReachedWrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--lido-color-textSecondary);
  cursor: pointer;
`;

export const QuorumReached = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: var(--lido-color-textSecondary);
`;

export const QuorumTooltipBody = styled.span`
  display: block;
  font-size: 12px;
`;

export const QuorumTooltipRow = styled.span`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const VoteTotalsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
`;
