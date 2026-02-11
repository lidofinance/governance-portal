import { FC, forwardRef } from 'react';
import { ButtonIcon as ButtonLib } from '@lidofinance/lido-ui';
import styled from 'styled-components';

type ButtonLibProps = Omit<React.ComponentProps<typeof ButtonLib>, 'icon'> & {
  icon?: React.ReactNode;
};

type ButtonStyledProps = Omit<ButtonLibProps, 'variant'> & {
  variant: 'dg-primary' | 'dg-secondary';
};

// Restyled version of the Button component from th lido-ui library
export const ButtonStyled = styled(ButtonLib)<ButtonStyledProps>`
  border-radius: 32px;
  font-size: 17px;
  background-color: var(--primary-color-black);
  font-weight: 500;
  color: var(--primary-color-white);

  &:hover {
    background-color: #0085ffb8;
  }

  &:not(:disabled):hover,
  &:focus-visible {
    background-color: #0085ffb8;
  }

  ${({ variant }) =>
    variant === 'dg-outlined' &&
    `
    background-color: transparent;
    color: var(--primary-color-black);
    border: 1px solid rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: rgba(0, 0, 0, 0.1) !important;
    }
  `}
`;

export const Button: FC<ButtonLibProps> = forwardRef<
  HTMLButtonElement,
  ButtonLibProps
>((props, ref) => {
  const { variant = 'primary', icon, ...rest } = props;
  return (
    <ButtonStyled
      {...rest}
      ref={ref}
      variant={`dg-${variant}`}
      icon={icon ?? <></>}
    />
  );
});
