import styled from 'styled-components';

export const ProposalsListWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: ${({ theme }) => theme.spaceMap.xl}px;
  width: 100%;
`;
