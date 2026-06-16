import styled, { css } from 'styled-components';
import { Block } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import {
  VOTE_CARD_MAX_WIDTH,
  VOTE_CARD_MOBILE_MAX_WIDTH,
  VOTE_MOBILE_MAX_WIDTH,
} from 'styles/constants';

export const Layout = styled.div`
  max-width: ${VOTE_CARD_MAX_WIDTH}px;
  margin: 0 auto 40px;
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  align-items: flex-start;

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    flex-direction: column;
    max-width: ${VOTE_CARD_MOBILE_MAX_WIDTH}px;
  }
`;

export const MainCard = styled(Block).attrs({
  paddingLess: true,
})`
  padding: 32px;
  flex: 0 1 664px;
  min-width: 0;
  box-shadow: ${({ theme }) => theme.boxShadows.xl}
    var(--lido-color-shadowLight);

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    flex: 1 0 auto;
    width: 100%;
  }
`;

export const SideCard = styled(Block).attrs({
  paddingLess: true,
})`
  padding: 32px;
  flex: 0 1 336px;
  box-shadow: ${({ theme }) => theme.boxShadows.xl}
    var(--lido-color-shadowLight);

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    display: none;
  }
`;

export const SidebarSection = styled.div`
  & + & {
    margin-top: ${({ theme }) => theme.spaceMap.xl}px;
  }
`;

export const MobileSidebarSlot = styled.div`
  display: none;

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    display: block;
    margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
    padding: ${({ theme }) => theme.spaceMap.xl}px 0;
    border-top: 1px solid var(--lido-color-border);
    border-bottom: 1px solid var(--lido-color-border);

    ${SidebarSection} + ${SidebarSection} {
      padding-top: ${({ theme }) => theme.spaceMap.xl}px;
      border-top: 1px solid var(--lido-color-border);
    }
  }
`;

export const MobileCTASlot = styled.div`
  display: none;

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    display: block;
    margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
  }
`;

export const DetailsBoxWrap = styled.div`
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
`;

export const SectionHeading = styled(Text).attrs({
  size: 12,
  color: 'secondary',
})`
  display: block;
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const VoteTitle = styled(Text).attrs({
  size: 20,
  weight: 700,
})`
  display: block;
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
`;

export const DescriptionWrap = styled.div`
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 400;
  line-height: 24px;
`;

export const EnactButtonWrap = styled.div`
  margin-top: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const YourVoteHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: var(--lido-color-text);
`;

type PillProps = { $supports: boolean };

export const VotedPill = styled.span<PillProps>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  background-color: ${({ $supports }) =>
    $supports ? '#53ba9526' : '#E14D4D26'};
  color: ${({ $supports }) =>
    $supports ? 'var(--lido-color-success)' : 'var(--lido-color-error)'};
`;

export const PowerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spaceMap.md}px;
  font-size: 14px;

  & > span:first-child {
    color: var(--lido-color-textSecondary);
  }

  & > span:last-child {
    font-weight: 700;
    color: var(--lido-color-text);
  }
`;

export const NoticeWrap = styled.div`
  margin-top: ${({ theme }) => theme.spaceMap.md}px;
`;

export const VoteActionsWrap = styled.div<{ $hidden?: boolean }>`
  margin-top: ${({ theme }) => theme.spaceMap.md}px;
  ${({ $hidden }) =>
    $hidden &&
    css`
      display: none;
    `}
`;
