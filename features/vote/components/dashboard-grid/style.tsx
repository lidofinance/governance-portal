import styled from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';

export const GridWrap = styled.div`
  margin: 0 auto;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr;
`;

export const DashboardGridHeading = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spaceMap.xl}px;

  @media ${devicesHeaderMedia.tablet} {
    p {
      font-size: 20px;
    }
  }

  @media (max-width: 999px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;
