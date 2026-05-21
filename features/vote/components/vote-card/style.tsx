import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';

export const Layout = styled.div`
  max-width: 1024px;
  margin: 0 auto 40px;
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  align-items: flex-start;

  @media (max-width: 999px) {
    flex-direction: column;
    max-width: 560px;
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

  @media (max-width: 999px) {
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

  @media (max-width: 999px) {
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

  @media (max-width: 999px) {
    display: block;
    margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
  }
`;

export const MobileCTASlot = styled.div`
  display: none;

  @media (max-width: 999px) {
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
