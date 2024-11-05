import { FC } from 'react';
import { Button as ButtonLib } from '@lidofinance/lido-ui';
import { ButtonStyled } from './style';

type ButtonLibProps = React.ComponentProps<typeof ButtonLib>;

// Restyled version of the Button component from the lido-ui library
export const Button: FC<ButtonLibProps> = (props) => {
  const variant = props.variant || 'primary';
  return <ButtonStyled {...props} variant={`dg-${variant}`} />;
};
