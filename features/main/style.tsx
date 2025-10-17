import styled from 'styled-components';

const DefaultGrid = styled.section`
  margin: 24px 0 80px;
  display: grid;
  gap: 24px;
`;

export const AppsWrapper = styled(DefaultGrid)`
  grid-template-columns: 1fr 1fr;
`;

export const ProposalsWrapper = styled(DefaultGrid)`
  grid-template-columns: 1fr 1fr 1fr;
`;

export const ResourcesWrapper = styled(DefaultGrid)`
  grid-template-columns: 1fr 1fr 1fr;
`;
