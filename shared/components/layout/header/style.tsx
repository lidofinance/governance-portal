import { InlineLoader } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import styled from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';
import Link from 'next/link';

export const HeaderContainer = styled.section<{ $isMenuOpen?: boolean }>`
  background: white;
  border-bottom: 1px solid #000a3d1f;
  position: ${({ $isMenuOpen }) => ($isMenuOpen ? 'fixed' : 'sticky')};
  left: 0;
  top: 0;
  right: 0;
  width: 100%;
  z-index: 5;
  padding: 0 60px;
  display: flex;
  align-items: center;
  height: 90px;

  @media ${devicesHeaderMedia.tablet} {
    padding: 32px;
  }
`;

export const HeaderActionsWrapper = styled.div`
  position: relative;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-shrink: 1;
  gap: 12px;

  @media ${devicesHeaderMedia.tablet} {
    display: none;
  }

  @media ${devicesHeaderMedia.mobile} {
    gap: 10px;
  }
`;

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
export const HeaderControlButton = styled(Link)`
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

  &:hover,
  &:not(:disabled):hover {
    background-color: #0085ff1a;
    border-color: #0085ffb8;
    svg {
      path {
        stroke: #0085ffb8;
      }
    }
  }

  svg {
    margin-left: 2px;
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
