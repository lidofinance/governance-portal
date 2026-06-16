import { ContainerProps, H1 } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';

export const LayoutTitleStyle = styled((props) => <H1 {...props} />)`
  font-weight: 800;
  font-size: ${({ theme }) => theme.fontSizesMap.xl}px;
  margin-bottom: 0.2em;
  line-height: 1.2em;
  text-align: center;

  &:empty {
    display: none;
  }
`;

export const LayoutSubTitleStyle = styled.h4`
  font-weight: 500;
  color: var(--lido-color-textSecondary);
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 1.5em;
  text-align: center;

  &:empty {
    display: none;
  }
`;

export const IPFSInfoBoxOnlyMobileAndPortableWrapper = styled.div`
  display: none;

  @media ${devicesHeaderMedia.tablet} {
    display: block;
    margin-top: -6px;
    margin-bottom: 40px;
  }
`;

const CONTAINER_MAX_WIDTH: Record<
  NonNullable<ContainerProps['size']>,
  number
> = {
  full: 1424,
  content: 960,
  tight: 560,
};

export const ContainerStyled = styled.main<{
  $size: NonNullable<ContainerProps['size']>;
  $paddingX?: number;
}>`
  box-sizing: border-box;
  width: 100%;
  min-width: 320px;
  margin: 0 auto;
  position: relative;
  padding-top: 24px;
  padding-left: ${({ $paddingX, theme }) => $paddingX ?? theme.spaceMap.xxl}px;
  padding-right: ${({ $paddingX, theme }) => $paddingX ?? theme.spaceMap.xxl}px;
  max-width: ${({ $size }) => CONTAINER_MAX_WIDTH[$size]}px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: ${({ $paddingX, theme }) => $paddingX ?? theme.spaceMap.lg}px;
    padding-right: ${({ $paddingX, theme }) =>
      $paddingX ?? theme.spaceMap.lg}px;
  }
`;
