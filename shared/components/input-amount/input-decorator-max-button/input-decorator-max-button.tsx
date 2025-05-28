import { MouseEventHandler } from 'react';
import { MaxButton } from './styled';

type InputDecoratorMaxButtonProps = {
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
};

export const InputDecoratorMaxButton = ({
  disabled,
  onClick,
  children,
}: InputDecoratorMaxButtonProps) => {
  return (
    <MaxButton
      size="xxs"
      variant="translucent"
      onClick={onClick}
      disabled={disabled}
      data-testid="maxBtn"
    >
      {children || 'Max'}
    </MaxButton>
  );
};
