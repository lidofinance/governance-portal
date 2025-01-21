import { LogoLido } from 'shared/components/logos/logos';
import { HeaderContainer, LogoTextStyle, LogoTextStyleMobile } from './style';
import { HeaderActions } from './header-actions';

export const Header = () => (
  <HeaderContainer size="full" forwardedAs="header">
    <LogoLido />
    <LogoTextStyle>Dual Governance</LogoTextStyle>
    <LogoTextStyleMobile>DG</LogoTextStyleMobile>
    <HeaderActions />
  </HeaderContainer>
);
