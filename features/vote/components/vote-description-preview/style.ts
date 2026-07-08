import styled from 'styled-components';
import { VOTE_CARD_MAX_WIDTH } from 'styles/constants';

export const PreviewWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  margin: ${({ theme }) => theme.spaceMap.lg}px 0;
`;

export const DashboardPreviewBreakout = styled.div`
  width: 100vw;
  margin-left: calc(50% - 50vw);
`;

export const DashboardPreviewContainer = styled.div`
  max-width: ${VOTE_CARD_MAX_WIDTH}px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
`;

export const DashboardPreviewQuorum = styled.div`
  flex: 0 0 274px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--lido-color-border);
  border-radius: 12px;
  color: var(--lido-color-textSecondary);
  font-size: 14px;
`;
