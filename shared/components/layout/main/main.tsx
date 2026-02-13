import { FC } from 'react';
import { ContainerProps } from '@lidofinance/lido-ui';

import { MainStyle } from './style';

export const Main: FC<ContainerProps> = (props) => {
  const { size = 'tight', ...rest } = props;

  return <MainStyle size={size} forwardedAs="main" {...rest} />;
};
