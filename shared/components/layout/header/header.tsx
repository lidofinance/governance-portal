import { FC } from 'react';
import { LogoLido } from 'shared/components/logos/logos';

import {
  HeaderBorderWrapper,
  HeaderStyle,
  HeaderActionsStyle,
  LogoTextStyle,
} from './style';
import HeaderActions from './components/header-actions';

export const Header: FC = () => (
  <HeaderBorderWrapper>
    <HeaderStyle size="full" forwardedAs="header">
      <LogoLido />
      <LogoTextStyle>Dual governance</LogoTextStyle>
      <HeaderActionsStyle>
        <HeaderActions />
      </HeaderActionsStyle>
    </HeaderStyle>
  </HeaderBorderWrapper>
);
