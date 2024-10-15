import { createGlobalStyle, css } from 'styled-components';

import { GovernanceState } from '../types/dual-governance';

import { NAV_MOBILE_HEIGHT, NAV_MOBILE_MAX_WIDTH } from './constants';
import { ThemeName } from '@lidofinance/lido-ui';

export const devicesHeaderMedia = {
  mobile: `screen and (max-width: ${NAV_MOBILE_MAX_WIDTH}px)`,
};

type GlobalLayoutProps = {
  $layoutVariant: GovernanceState | 'default';
};

const LayoutVariants = {
  normal: css`
    background-color: var(--layout-background-normal);
  `,
  blocked: css`
    background-color: var(--layout-background-blocked);
  `,
  default: css`
    background-color: var(--lido-color-background);
  `,
};

const GlobalStyle = createGlobalStyle<GlobalLayoutProps>`
  :root {
    --nav-mobile-height: ${NAV_MOBILE_HEIGHT}px;
    --nav-mobile-max-width: ${NAV_MOBILE_MAX_WIDTH}px;
    --nav-desktop-gutter-x: 46px;

    --header-padding-y: 18px;
    --dot-size: 6px;

    --footer-max-width: 1424px;
    --footer-desktop-padding-x: 32px;
    --footer-desktop-padding-y: 24px;

    --footer-mobile-padding-x: 20px;
    --footer-mobile-padding-y: 18px;
    --footer-mobile-margin-bottom: 60px;

    --layout-background-normal: #EAF6F1;
    --layout-background-blocked: #FFF1F1;
    
    --layout-gradient-start-normal: #29c38c;
    --layout-gradient-stop-normal: #29c38c00;
    
    --layout-gradient-start-blocked: #D74758;
    --layout-gradient-stop-blocked: #D7475800;

    --custom-inverse-color-black: ${({ theme }) => (theme.name === ThemeName.light ? '#000' : '#fff')} ;
    --custom-inverse-color-white: ${({ theme }) => (theme.name === ThemeName.dark ? '#000' : '#fff')} ;
    
    --custom-border: ${({ theme }) => (theme.name === ThemeName.dark ? '#fff' : '#0000000A')} ;
    
    --custom-background-secondary: ${({ theme }) => (theme.name === ThemeName.light ? '#F6F8FA' : '#2D2D35')} ;
  }
  * {
    margin: 0;
    padding: 0;
  }
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  svg {
    box-sizing: content-box;
  }
  html,
  body {
    width: 100%;
  }
  body {
    ${({ $layoutVariant }) => LayoutVariants[$layoutVariant]};
    color: var(--lido-color-text);
    position: relative;
    box-sizing: border-box;
    font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
    line-height: 1.5em;
    font-weight: 500;
    text-size-adjust: none;
  }
  main {
    min-height: calc(100vh - 150px);
  }
  a {
    cursor: pointer;
    text-decoration: none;
    color: var(--lido-color-primary);

    &:visited {
      color: var(--lido-color-primary);
    }

    &:hover {
      color: var(--lido-color-primaryHover);
    }

   
  }
`;

export default GlobalStyle;
