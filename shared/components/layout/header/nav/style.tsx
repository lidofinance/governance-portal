import styled, { css } from 'styled-components';

export const NavStyled = styled.nav`
  display: flex;
  align-items: center;
  margin-left: 16px;
`;

export const NavItem = styled.div<{ $isActive?: boolean }>`
  font-size: 16px;
  padding: 33px 16px;
  cursor: pointer;
  a {
    text-decoration: none;
    color: inherit;
  }
  ${({ $isActive }) =>
    $isActive &&
    css`
      border-bottom: 2px solid var(--accent-color-ocean-light);
      a {
        color: var(--accent-color-ocean-light);
        font-weight: 600;
      }
    `}
`;
