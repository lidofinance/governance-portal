import { LogoLido } from 'shared/components/logos/logos';
import { HeaderContainer, LogoTextStyleMobile } from './style';
import { HeaderActions } from './header-actions';
import { NavStyledNav } from './nav/nav';

export const Header = () => (
  <HeaderContainer>
    <LogoLido />
    <NavStyledNav />
    <LogoTextStyleMobile>DAO</LogoTextStyleMobile>
    <HeaderActions />
  </HeaderContainer>
);
