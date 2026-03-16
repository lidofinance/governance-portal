import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';

export const VoteBody = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
`;

export const VoteTitle = styled(Text).attrs({
  size: 'xs',
  weight: 700,
})``;

export const VoteDescriptionWrap = styled(Text).attrs({
  size: 'xxs',
  weight: 400,
})`
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const VotesBarWrap = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 0;
`;

export const NeededToQuorum = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
`;
