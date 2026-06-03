import styled from 'styled-components';
import { Text } from 'shared/components/text';
import { DashboardCard } from 'shared/components/dashboard-card';
import { VOTE_MOBILE_MAX_WIDTH } from 'styles/constants';

export const VoteDashboardCard = styled(DashboardCard)`
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
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

  button > div {
    display: inline-flex;
    vertical-align: middle;
  }
`;

export const VoteSummary = styled.section`
  width: 70%;

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    width: 100%;
  }
`;

export const VoteQuorum = styled.section`
  width: 274px;
  margin-left: auto;

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    width: 100%;
    margin-left: 0;
    margin-top: ${({ theme }) => theme.spaceMap.xl}px;
  }
`;
