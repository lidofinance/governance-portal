import { Text, Container } from '@lidofinance/lido-ui';
import styled, { keyframes } from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';

export const HeaderStyle = styled((props) => <Container {...props} />)`
  position: relative;
  padding-top: var(--header-padding-y);
  padding-bottom: var(--header-padding-y);
  display: flex;
  align-items: center;
`;

export const HeaderBorderWrapper = styled.div`
  border-bottom: 1px solid var(--custom-border);
`;

export const HeaderActionsStyle = styled.div`
  position: relative;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-shrink: 1;
`;

const glimmer = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  60% { opacity: 1; }
  100% { opacity: 0; }
`;

export const LogoTextStyle = styled(Text).attrs({
  strong: true,
})`
  color: var(--custom-inverse-color-black);
  text-transform: uppercase;
  margin-left: ${({ theme }) => theme.spaceMap.xl}px;
  padding-left: ${({ theme }) => theme.spaceMap.xl}px;
  border-left: 1px solid var(--custom-inverse-color-black);
`;

export const IPFSInfoBoxOnlyDesktopWrapper = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 15px);
  width: 255px;
  z-index: 3;

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;

export const VaultInfo = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  margin-right: 8px;
  border: 1px solid var(--custom-border);
  padding: 10px;
  border-radius: 30px;
  cursor: pointer;
  color: #131217b8;
`;

export const VaultInfoMenuTitle = styled.p`
  font-size: 28px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 20px;
  height: 46px;
  line-height: 1.5;
`;

// TODO: uncomment or remove when we decide if we have dark theme
// export const ThemeTogglerWrapper = styled.div`
//   button {
//     border-radius: 50%;
//     background: transparent;
//     border: 1px solid var(--custom-border);
//     width: 46px;
//     height: 46px;
//   }
// `;
