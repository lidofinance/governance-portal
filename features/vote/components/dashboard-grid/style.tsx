import styled from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';
import { VOTE_MOBILE_MAX_WIDTH } from 'styles/constants';

export const DashboardWrap = styled.div`
  max-width: 1024px;
  margin: 0 auto;
`;

export const GridWrap = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr;
`;

export const LoadMoreCard = styled.button`
  width: 100%;
  height: 72px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background-color: var(--lido-color-foreground);
  box-shadow: 0px 4px 32px var(--lido-color-shadowLight);
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  color: var(--lido-color-text);
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
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

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;
