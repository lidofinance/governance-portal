import styled from 'styled-components';
import { Text } from 'shared/components/text';
import { DashboardCard } from 'shared/components/dashboard-card';
import { VOTE_MOBILE_MAX_WIDTH } from 'styles/constants';

export const VoteDashboardCard = styled(DashboardCard)`
  flex-direction: row;
  gap: 64px;
  padding: ${({ theme }) => theme.spaceMap.xxl}px;
  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    flex-direction: column;
    height: auto;
    gap: ${({ theme }) => theme.spaceMap.xl}px;
  }
`;

export const VoteTitle = styled(Text).attrs({
  size: 20,
  weight: 700,
})`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    && {
      font-size: 16px;
    }
  }
`;

export const VoteDescriptionWrap = styled(Text).attrs({
  size: 14,
  weight: 400,
})`
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;

  span {
    white-space: normal;
  }

  button > div {
    display: inline-flex;
    vertical-align: middle;
  }

  && > div > * {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }

  && p {
    white-space: normal;
  }
`;

export const VoteSummary = styled.section`
  flex: 1 1 auto;
  min-width: 0;

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    flex: 0 0 auto;
    width: 100%;
  }
`;

export const VoteQuorum = styled.section`
  flex: 0 0 274px;

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    flex: 0 0 auto;
    width: 100%;
  }
`;

export const VetoSupportWrap = styled.div`
  margin-top: ${({ theme }) => theme.spaceMap.lg}px;
  padding-top: ${({ theme }) => theme.spaceMap.lg}px;
  border-top: 1px solid var(--lido-color-border);
`;
