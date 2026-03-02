import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';

type BoxProps = {
  isCentered?: boolean;
};

export const ContentHighlightBox = styled.div<BoxProps>`
  margin-bottom: 10px;
  padding: 10px;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  text-align: ${({ isCentered }) => (isCentered ? 'center' : 'left')};
  background-color: var(--lido-color-backgroundSecondary);
`;

export const Card = styled(Block).attrs({
  paddingLess: true,
})`
  padding: 20px;
  max-width: 560px;
  margin: 0 auto 40px;
`;

export const VoteHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const VoteTitle = styled(Text).attrs({
  size: 20,
  weight: 700,
})`
  flex-shrink: 0;
`;

export const BlockWrap = styled.div`
  text-align: right;
  margin-left: auto;
`;

export const VoteTimestamp = styled(Text).attrs({
  size: 12,
  color: 'secondary',
})`
  margin-bottom: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const DetailsBoxWrap = styled.div`
  margin-top: ${({ theme }) => theme.spaceMap.lg}px;
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
`;

export const BoxVotes = styled(ContentHighlightBox)`
  padding: 0;
  background: none;
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
`;

export const SectionHeading = styled(Text).attrs({
  size: 16,
  weight: 700,
})`
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
`;

export const DescriptionWrap = styled.div`
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 400;
  line-height: 24px;
`;
