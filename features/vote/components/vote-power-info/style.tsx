import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';

export const InfoWrap = styled.div`
  margin-top: ${({ theme }) => theme.spaceMap.md}px;
`;

export const VotingPower = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.spaceMap.sm}px;
  }
`;
export const Amount = styled(Text).attrs({
  size: 'xxs',
  weight: 700,
})``;
