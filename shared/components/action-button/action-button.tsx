import React, { PropsWithChildren } from 'react';
import { StyledButton } from './style';

type Props = {
  type: 'primary' | 'secondary';
};

export const ActionButton: React.FC = ({
  children,
  type,
}: PropsWithChildren<Props>) => {
  return <StyledButton $type={type}>{children}</StyledButton>;
};
