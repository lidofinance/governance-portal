import { BadgeVariant, Wrap, BadgeType } from './style';

type Props = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: BadgeType;
};

export const Badge = ({
  children,
  leftIcon,
  rightIcon,
  variant = 'blue',
  type = 'primary',
}: Props) => {
  return (
    <Wrap
      $variant={variant}
      $withLeftIcon={!!leftIcon}
      $withRightIcon={!!rightIcon}
      $type={type}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </Wrap>
  );
};
