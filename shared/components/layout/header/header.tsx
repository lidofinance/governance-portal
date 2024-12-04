import { LogoLido } from 'shared/components/logos/logos';
import { HeaderContainer, LogoTextStyle } from './style';
import { HeaderActions } from './header-actions';

export const Header = () => (
  <HeaderContainer size="full" forwardedAs="header">
    <LogoLido />
    <LogoTextStyle>Dual Governance</LogoTextStyle>
    <HeaderActions />
  </HeaderContainer>
);
