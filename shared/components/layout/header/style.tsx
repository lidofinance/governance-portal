import { Container, InlineLoader } from '@lidofinance/lido-ui';
import { Button } from 'shared/components/button';
import { Text } from 'shared/components/text';
import styled, { css } from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';

export const HeaderContainer = styled((props) => <Container {...props} />)`
  position: relative;
  padding: 25px 60px;
  display: flex;
  align-items: center;
`;

export const HeaderActionsWrapper = styled.div`
  position: relative;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-shrink: 1;
`;

export const LogoTextStyle = styled(Text).attrs({
  strong: true,
  size: 19,
})`
  position: relative;
  color: var(--custom-inverse-color-black);
  text-transform: uppercase;
  margin-left: ${({ theme }) => theme.spaceMap.xl}px;
  padding-left: ${({ theme }) => theme.spaceMap.xl}px;
  user-select: none;

  &:before {
    position: absolute;
    content: '';
    width: 1px;
    height: 40px;
    background-color: var(--primary-color-black-72);
    left: 0;
    top: -50%;
  }
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

export const VaultInfoButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  margin-right: 8px;
  border: 1px solid var(--custom-border);
  padding: 10px;
  border-radius: 30px;
  color: #131217b8;
  background: transparent;
  &:not(:disabled) {
    cursor: pointer;
  }
`;

export const VaultInfoPopupTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
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

type HeaderControlButtonProps = {
  isActive?: boolean;
};
export const HeaderControlButton = styled(Button).attrs({
  variant: 'text',
  size: 'xs',
})<HeaderControlButtonProps>`
  border-radius: 50%;
  flex-shrink: 0;
  min-width: 0;
  margin-left: ${({ theme }) => theme.spaceMap.sm}px;
  padding-left: 10px;
  padding-right: 10px;
  line-height: 0;
  font-size: 0;
  background: transparent;
  border: 1px solid var(--custom-border);
  fill: var(--lido-color-secondary);

  svg {
    width: 24px;
    height: 24px;
    fill: var(--lido-color-secondary);
  }

  ${({ isActive }) =>
    isActive &&
    css`
      & svg {
        fill: var(--lido-color-primary);
      }
    `}
`;

export const VaultInfoLoader = styled((props) => <InlineLoader {...props} />)`
  width: 48px;
`;

export const TokensList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
`;

export const VaultInfoSubtitle = styled(Text).attrs({
  size: 14,
  color: 'secondary',
})`
  margin: ${({ theme }) => theme.spaceMap.md}px 0;
`;
