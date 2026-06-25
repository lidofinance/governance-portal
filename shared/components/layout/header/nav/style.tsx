import styled, { css } from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';

export const NavStyled = styled.nav`
  display: flex;
  align-items: center;
  margin-left: 16px;
  margin-right: auto;

  @media ${devicesHeaderMedia.tablet} {
    display: none;
  }
`;

export const NavMobileStyled = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: fixed;
  overflow: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  background: #eff2f6;
  padding: 90px 18px 0;
`;

export const NavMobileWrapper = styled.div`
  padding-top: 10px;
  max-width: 400px;
  width: 100%;
`;

export const NavItem = styled.div<{ $isActive?: boolean }>`
  font-size: 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  a {
    display: block;
    padding: 33px 16px;
    text-decoration: none;
    color: inherit;
  }
  ${({ $isActive }) =>
    $isActive &&
    css`
      border-bottom-color: var(--accent-color-ocean-light);
      a {
        color: var(--accent-color-ocean-light);
        font-weight: 600;
      }
    `}
`;

export const NavMobileItem = styled(NavItem)<{ $isActive?: boolean }>`
  margin: 16px 0 16px -16px;
  a {
    padding: 6px 16px;
  }
  ${({ $isActive }) =>
    $isActive &&
    css`
      border-left: 2px solid var(--accent-color-ocean-light);
      border-bottom: none;
    `}
`;

export const NavMobileActions = styled.section`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #000a3d1f;
`;

type BurgerProps = { $isOpened: boolean };

export const NavBurgerStyled = styled.div<BurgerProps>`
  display: none;
  margin-left: 8px;
  border-radius: 50%;
  border: 1px solid #000a3d1f;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  z-index: 5;

  @media ${devicesHeaderMedia.tablet} {
    margin-left: 10px;
    display: flex;
  }
`;

export const BurgerLine = styled.div`
  width: 18px;
  height: 2px;
  background-color: var(--lido-color-text);
  transition:
    transform ease ${({ theme }) => theme.duration.norm},
    opacity ease ${({ theme }) => theme.duration.norm};

  &:not(:last-child) {
    margin-bottom: 6px;
  }

  &:nth-child(1) {
    transform-origin: right -1px;
  }

  &:nth-child(3) {
    transform-origin: right 3px;
  }
`;

export const NavBurgerWrap = styled.div<BurgerProps>`
  ${({ $isOpened }) =>
    $isOpened &&
    css`
      ${BurgerLine}:nth-child(1) {
        transform-origin: center;
        transform: translateY(8px) rotate(45deg);
      }
      ${BurgerLine}:nth-child(2) {
        opacity: 0;
      }
      ${BurgerLine}:nth-child(3) {
        transform-origin: center;
        transform: translateY(-8px) rotate(-45deg);
      }
    `}
`;
