import { FC } from 'react';
import { LogoLido } from 'shared/components/logos/logos';

import {
  HeaderBorderWrapper,
  HeaderStyle,
  HeaderActionsStyle,
  LogoTextStyle,
} from './styles';
import HeaderWallet from './components/header-wallet';

export const Header: FC = () => (
  <HeaderBorderWrapper>
    <HeaderStyle size="full" forwardedAs="header">
      <LogoLido />
      <LogoTextStyle>Dual governance</LogoTextStyle>
      <HeaderActionsStyle>
        <HeaderWallet />
      </HeaderActionsStyle>
    </HeaderStyle>
  </HeaderBorderWrapper>
);
