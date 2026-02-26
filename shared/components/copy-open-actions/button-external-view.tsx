import { useCallback, MouseEvent } from 'react';
import { ButtonIcon, External, ButtonVariants } from '@lidofinance/lido-ui';
import { openWindow } from 'utils/open-window';

type Props = {
  link?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonVariants;
  children: React.ReactNode;
};

export const ButtonExternalView = ({
  children,
  link,
  onClick,
  ...rest
}: Props) => {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (link) openWindow(link);
      onClick?.(event);
    },
    [onClick, link],
  );
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
