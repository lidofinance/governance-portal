import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import Link from 'next/link';

export const CommitteeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 31px;
  line-height: 1;
`;

export const CommitteeTitle = styled.span`
  font-size: 76px;
  font-weight: normal;
  letter-spacing: -2px;
  color: var(--primary-color-black);
`;
export const CommitteeQuorum = styled.span`
  font-size: 34px;
  color: var(--primary-color-black-72);
  background-color: #1312170f;
  border-radius: 60px;
  padding: 18px 24px;
`;

export const CommitteeCardWrapper = styled(Block)`
  display: flex;
  justify-content: space-between;
  gap: 60px;
`;

export const CommitteeCardHeading = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 24px;
  align-items: center;
`;

export const StyledDGLink = styled(Link)`
  &:visited,
  &:active {
    color: var(--accent-color-ocean-light);
  }
  font-size: 17px;
  font-weight: 600;
`;

export const StyledAragonLink = styled(Link)`
  &:visited,
  &:active {
    color: var(--accent-color-ocean-light);
  }

  font-weight: 400;
`;
