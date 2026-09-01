import { BadgeVariant, Wrap, BadgeType } from './style';

type Props = React.ComponentPropsWithoutRef<'span'> & {
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
  ...rest
}: Props) => {
  return (
    <Wrap
      {...rest}
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
