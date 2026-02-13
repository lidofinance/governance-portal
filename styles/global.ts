import { createGlobalStyle, css } from 'styled-components';

import {
  NAV_MOBILE_HEIGHT,
  NAV_MOBILE_MAX_WIDTH,
  NAV_TABLET_MAX_WIDTH,
} from './constants';
import { ThemeName } from '@lidofinance/lido-ui';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { themeDefault } from '@lidofinance/lido-ui';

export const BREAKPOINT_MOBILE = '960px';
export const BREAKPOINT_MD = themeDefault.breakpointsMap.md.width;

export const devicesHeaderMedia = {
  tablet: `screen and (max-width: ${NAV_TABLET_MAX_WIDTH}px)`,
  mobile: `screen and (max-width: ${NAV_MOBILE_MAX_WIDTH}px)`,
};

type GlobalLayoutProps = {
  $layoutVariant?: VisibleGovernanceState;
};

const LayoutVariants = {
  [VisibleGovernanceState.Normal]: css`
    background-color: var(--layout-background-normal);
  `,
  [VisibleGovernanceState.Warning]: css`
    background-color: var(--layout-background-attention);
  `,
  [VisibleGovernanceState.BlockedDeactivation]: css`
    background-color: var(--layout-background-deactivation);
  `,
  [VisibleGovernanceState.BlockedRageQuit]: css`
    background-color: var(--layout-background-blocked);
  `,
  [VisibleGovernanceState.BlockedVetoSignalling]: css`
    background-color: var(--layout-background-blocked);
  `,
  [VisibleGovernanceState.Cooldown]: css`
    background-color: var(--layout-background-cooldown);
  `,
  [VisibleGovernanceState.Loading]: css`
    background-color: var(--layout-background-normal);
  `,
  [VisibleGovernanceState.Emergency]: css`
    background-color: var(--layout-background-blocked);
  `,
  [VisibleGovernanceState.Unset]: css`
    background-color: var(--layout-background-attention);
  `,
};

const GlobalStyle = createGlobalStyle<GlobalLayoutProps>`
  :root {
    --nav-mobile-height: ${NAV_MOBILE_HEIGHT}px;
    --nav-mobile-max-width: ${NAV_MOBILE_MAX_WIDTH}px;
    --nav-desktop-gutter-x: 46px;

    --dot-size: 6px;

    --footer-max-width: 1424px;
    --footer-desktop-padding-x: 32px;
    --footer-desktop-padding-y: 24px;

    --footer-mobile-padding-x: 20px;
    --footer-mobile-padding-y: 18px;
    --footer-mobile-margin-bottom: 60px;

    // ----- Layout gradient & background colors

    --layout-background-default: #FFF9F9;
    --layout-background-normal: #EAF6F1;
    --layout-background-attention: #FBF4EF;
    --layout-background-blocked: #FFF1F1;
    --layout-background-deactivation: #FFEDE7;
    --layout-background-cooldown: #F1FBFF;


    --layout-gradient-start-normal: #29c38c;
    --layout-gradient-stop-normal: #29c38c00;

    --layout-gradient-start-attention: #FFE176;
    --layout-gradient-stop-attention: #FFE17600;

    --layout-gradient-start-blocked: #D74758;
    --layout-gradient-stop-blocked: #D7475800;

    --layout-gradient-start-deactivation: #FF633C;
    --layout-gradient-stop-deactivation: #FF633C00;

    --layout-gradient-start-cooldown: #4450FF;
    --layout-gradient-stop-cooldown: #4450FF00;



    // ----- Primary: For ext & icons

    --primary-color-black: #000000;
    --primary-color-white: #FFFFFF;
    --primary-color-black-72: #131217B8;
    --primary-color-black-50: #13121780;
    --primary-color-black-32: #13121752;
    --primary-color-black-20: #13121733;
    --primary-color-black-8: #13121714;

    // ----- Accent: For links and icons

    --accent-color-ocean: #4854FF;
    --accent-color-ocean-light: #0085FF;
    --accent-color-sky: #00A3FF;
    --accent-color-coral: #FF9900;
    --accent-color-coral-light: #FF8E7633;
    --accent-color-berry: #D74758;
    --accent-color-berry-light: #D7475833;
    --accent-color-leaf: #29C38C;
    --accent-color-leaf-light: #29C38C33;
    --accent-color-orange: #FF633C;

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
    font-family: 'Manrope', sans-serif;
  }
  svg {
    box-sizing: content-box;
  }
  html,
  body {
    width: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    ${({ $layoutVariant }) =>
      $layoutVariant
        ? LayoutVariants[$layoutVariant]
        : css`
            background-color: #eff2f6;
          `};
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

  html.html-scroll-lock {
    overflow-y: scroll;
  }

  body.body-scroll-lock {
    overflow: hidden;
    position: fixed;
    height: auto;
  }

    button {
    cursor: pointer;
    }
`;

export default GlobalStyle;
