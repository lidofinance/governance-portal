import { FC, forwardRef } from 'react';
import { Button as ButtonLib } from '@lidofinance/lido-ui';
import styled from 'styled-components';

type ButtonLibProps = React.ComponentProps<typeof ButtonLib>;

type ButtonStyledProps = Omit<ButtonLibProps, 'variant'> & {
  variant: 'dg-primary' | 'dg-secondary';
};

// Restyled version of the Button component from th lido-ui library
export const ButtonStyled = styled(ButtonLib)<ButtonStyledProps>`
  border-radius: 32px;
  font-size: 17px;
  background-color: var(--primary-color-black);
  font-weight: 600;
  color: var(--primary-color-white);

  &:hover {
    background-color: var(--primary-color-black-72);
  }

  &:not(:disabled):hover,
  &:focus-visible {
    background-color: var(--primary-color-black-72);
  }
`;

export const Button: FC<ButtonLibProps> = forwardRef<
  HTMLButtonElement,
  ButtonLibProps
>((props, ref) => {
  const { variant = 'primary', ...rest } = props;
  return <ButtonStyled {...rest} ref={ref} variant={`dg-${variant}`} />;
});
