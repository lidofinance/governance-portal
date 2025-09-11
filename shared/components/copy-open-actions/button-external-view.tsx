import { useCallback } from 'react';
import { ButtonIcon, External, ButtonVariants } from '@lidofinance/lido-ui';
import { openWindow } from 'utils/open-window';

type Props = {
  link?: string;
  onClick?: () => void;
  variant?: ButtonVariants;
  children: React.ReactNode;
};

export const ButtonExternalView = ({
  children,
  link,
  onClick,
  ...rest
}: Props) => {
  const handleClick = useCallback(() => {
    if (link) openWindow(link);
    onClick?.();
  }, [onClick, link]);
  return (
    <ButtonIcon
      onClick={handleClick}
      icon={<External />}
      size="xs"
      variant="ghost"
      {...rest}
    >
      {children}
    </ButtonIcon>
  );
};
