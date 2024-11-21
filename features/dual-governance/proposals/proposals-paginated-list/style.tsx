import styled from 'styled-components';
import { Input, Pagination } from '@lidofinance/lido-ui';

export const ProposalsListContainer = styled.div``;

export const ProposalsListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Heading = styled.h1`
  font-size: 34px;
  font-weight: 600;
  color: var(--primary-color-black);
`;

export const StyledSearchInput = styled(Input)`
  width: 50%;
  span {
    border-radius: 40px;
    background-color: transparent;
    border-color: var(--border-color-fog);
  }
`;

export const ProposalsListGrid = styled.section`
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
`;

export const ProposalsListItem = styled.div`
  background: white;
  padding: 30px;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
`;

export const ProposalTimeLockCountdownWrapper = styled.div`
  margin-top: 8px;
  color: var(--primary-color-black-50);
`;

export const ProposalTimeLockCountdown = styled.span`
  color: var(--primary-color-black);
  font-weight: 600;
`;

export const ProposalDescription = styled.p`
  padding-top: 28px;
  margin-top: 20px;
  border-top: 1px solid var(--border-color-fog);
  font-size: 15px;
  color: var(--primary-color-black-72);
  max-width: 300px;
  width: 300px;
  max-height: 310px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledPagination = styled(Pagination)`
  margin: 40px 0;
  justify-content: center;
  width: 100%;

  button {
    border-radius: 50%;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 400;
    background: transparent;
    border: 1px solid var(--primary-color-black-20;
  }
`;
