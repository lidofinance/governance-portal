import styled, { css } from 'styled-components';
import { Text } from 'shared/components/text';

export const VotesTitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spaceMap.xs}px;
`;

type VotesBarWrapProps = { showOnForeground?: boolean };
export const VotesBarWrap = styled.div<VotesBarWrapProps>`
  position: relative;
  display: flex;
  height: 8px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm}px;
  overflow: hidden;
  ${({ showOnForeground }) =>
    showOnForeground
      ? css`
          background-color: var(--lido-color-backgroundSecondary);
        `
      : css`
          border: 1px solid var(--lido-color-foreground);
          background-color: var(--lido-color-foreground);
        `}

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    transform: translateX(-50%);
    background-color: var(--lido-color-text);
    pointer-events: none;
  }
`;

const VotesBar = styled.div`
  height: 100%;
  overflow: hidden;
`;

export const VotesBarNay = styled(VotesBar)`
  background-color: var(--lido-color-error);
`;

export const VotesBarYea = styled(VotesBar)`
  background-color: var(--lido-color-success);
`;

export const VoteYeaNayText = styled(Text).attrs({ as: 'span', size: 14 })<{
  $variant: 'success' | 'error';
}>`
  color: var(--lido-color-${({ $variant }) => $variant});
  font-weight: 700;
  margin: 0 2px;
`;
