import styled from 'styled-components';

export const ProposalsListWrapper = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 30px;
  margin-top: ${({ theme }) => theme.spaceMap.xl}px;
  margin-bottom: 200px;
`;
