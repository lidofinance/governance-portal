import { LogoLido } from 'shared/components/logos/logos';
import { HeaderContainer, LogoTextStyle, LogoTextStyleMobile } from './style';
import { HeaderActions } from './header-actions';
import { Link } from '@lidofinance/lido-ui';

export const Header = () => (
  <HeaderContainer size="full" forwardedAs="header">
    <LogoLido />
    <Link href="/" target="_self">
      <LogoTextStyle>Dual Governance</LogoTextStyle>
    </Link>
    <LogoTextStyleMobile>DG</LogoTextStyleMobile>
    <HeaderActions />
  </HeaderContainer>
);
