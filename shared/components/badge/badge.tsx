import { BadgeVariant, Wrap } from './style';

type Props = {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Badge = ({
  children,
  leftIcon,
  rightIcon,
  variant = 'blue',
}: Props) => {
  return (
    <Wrap
      $variant={variant}
      $withLeftIcon={!!leftIcon}
      $withRightIcon={!!rightIcon}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </Wrap>
  );
};
