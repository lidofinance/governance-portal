import { FC } from 'react';
import { LightThemeProvider } from '@lidofinance/lido-ui';

import { InfoBoxStyled } from './styled';

export const InfoBox: FC = (props) => {
  return (
    <LightThemeProvider>
      <InfoBoxStyled {...props} />
    </LightThemeProvider>
  );
};
