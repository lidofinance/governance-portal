import { FC } from 'react';
import { LogoLido } from 'shared/components/logos/logos';
import { Text } from '@lidofinance/lido-ui'

import { HeaderStyle, HeaderActionsStyle } from './styles';
import HeaderWallet from './components/header-wallet';

export const Header: FC = () => (
  <HeaderStyle size="full" forwardedAs="header">
    <LogoLido />
    <Text style={{ marginLeft: '20px'}} strong>{ 'DUAL GOVERNANCE'}</Text>
    <HeaderActionsStyle>
      <HeaderWallet />
    </HeaderActionsStyle>
  </HeaderStyle>
);
