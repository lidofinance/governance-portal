import React, { PropsWithChildren } from 'react';
import { StyledButton } from './style';
import { ButtonProps } from './types';

export const ActionButton = ({
  children,
  type = 'primary',
  size = 'md',
  onClick,
}: PropsWithChildren<ButtonProps>) => {
  return (
    <StyledButton onClick={onClick} $type={type} $size={size}>
      {children}
    </StyledButton>
  );
};
