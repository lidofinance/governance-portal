import styled, { css } from 'styled-components';

export const VotesTitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spaceMap.xs}px;
`;

type VotesBarWrapProps = { showOnForeground?: boolean };
export const VotesBarWrap = styled.div<VotesBarWrapProps>`
  display: flex;
  height: 4px;
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
