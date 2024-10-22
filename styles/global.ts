import { createGlobalStyle, css } from 'styled-components';

import { GovernanceStateIndicator } from 'features/dual-governance/types';

import { NAV_MOBILE_HEIGHT, NAV_MOBILE_MAX_WIDTH } from './constants';
import { ThemeName } from '@lidofinance/lido-ui';

export const devicesHeaderMedia = {
  mobile: `screen and (max-width: ${NAV_MOBILE_MAX_WIDTH}px)`,
};

type GlobalLayoutProps = {
  $layoutVariant: GovernanceStateIndicator | 'default';
};

const LayoutVariants = {
  normal: css`
    background-color: var(--layout-background-normal);
  `,
  attention: css`
    background-color: var(--layout-background-attention);
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
    
    // ----- Layout gradient & background colors

    --layout-background-normal: #EAF6F1;
    --layout-background-attention: #FBF4EF;
    --layout-background-blocked: #FFF1F1;

    --layout-gradient-start-normal: #29c38c;
    --layout-gradient-stop-normal: #29c38c00;
    
    --layout-gradient-start-attention: #FFE176;
    --layout-gradient-stop-attention: #FFE17600;

    --layout-gradient-start-blocked: #D74758;
    --layout-gradient-stop-blocked: #D7475800;
    
    // ----- Primary: For ext & icons
    
    --primary-color-black: #000000;
    --primary-color-white: #FFFFFF;
    --primary-color-black-72: #131217B8;
    --primary-color-black-50: #13121780;
    --primary-color-black-32: #13121752;
    --primary-color-black-20: #13121733;
    --primary-color-black-8: #13121714;
    
    // ----- Accent: For links and icons
    
    --accent-color-ocean: #0085FF;
    --accent-color-sky: #00A3FF;
    --accent-color-coral: #FF8E76;
    --accent-color-berry: #D74758;
    --accent-color-leaf: #29C38C;
    
    // ----- Borders: For strokes
    
    --border-color-fog: #0000001A;
    --border-color-mist: #3C425447;
    --border-color-water: #0085FF99;
    

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
