import { InlineLoader } from '@lidofinance/lido-ui';
import { Button } from 'shared/components/button';
import { Text } from 'shared/components/text';
import styled from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';

export const HeaderContainer = styled.section`
  background: white;
  border-bottom: 1px solid #000a3d1f;
  position: sticky;
  left: 0;
  top: 0;
  right: 0;
  z-index: 5;
  padding: 0 60px;
  display: flex;
`;

export const HeaderActionsWrapper = styled.div`
  position: relative;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-shrink: 1;
  gap: 12px;
  @media ${devicesHeaderMedia.mobile} {
    gap: 10px;
  }
`;

export const LogoTextStyle = styled(Text).attrs({
  size: 19,
})`
  font-weight: 500;
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
    top: -25%;
  }
  @media ${devicesHeaderMedia.tablet} {
    display: none;
  }
`;

export const LogoTextStyleMobile = styled(Text).attrs({
  strong: true,
  size: 19,
})`
  display: none;
  position: relative;
  margin-left: 20px;
  padding-left: 20px;
  margin-right: 10px;
    
  &:before {
      position: absolute;
      content: '';
      width: 1px;
      height: 40px;
      background-color: var(--primary-color-black-72);
      left: 0;
      top: -25%;
  }
  @media ${devicesHeaderMedia.tablet} {
      display: block;
  }
}`;

export const IPFSInfoBoxOnlyDesktopWrapper = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 15px);
  width: 255px;
  z-index: 3;

  @media ${devicesHeaderMedia.tablet} {
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
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
  p {
    text-align: center;
  }
`;
export const HeaderControlButton = styled(Button).attrs({
  variant: 'outlined',
  size: 'xs',
})`
  border-radius: 50%;
  flex-shrink: 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 0;
  font-size: 0;
  border: 1px solid #000a3d1f;
  fill: var(--lido-color-secondary);
  width: 48px;
  height: 48px;

  &:hover {
    background-color: transparent !important;
  }

  svg {
    margin-left: 4px;
    margin-top: 2px;
  }
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

export const WalletInfo = styled.div`
  position: relative;
`;

export const UnsupportedChainBannerStyled = styled.div`
  background: var(--primary-color-black);
  padding: 30px;
  position: absolute;
  color: white;
  z-index: 3;
  border-radius: 30px;
  width: 289px;
  top: 70px;
  right: -50px;

  &:after {
    content: '';
    position: absolute;
    top: -8px;
    border-radius: 4px;
    left: 70%;
    transform: rotate(45deg);
    border: 14px solid black;
    border-left-color: var(--primary-color-black);
    border-right-color: transparent;
    border-top-color: var(--primary-color-black);
    border-bottom-color: transparent;
    //border-top-color: black;
    //border-bottom-color: transparent;
  }
`;
