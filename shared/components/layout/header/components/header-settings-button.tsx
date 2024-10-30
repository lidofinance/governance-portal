import { useCallback } from 'react';

import { GearIcon } from 'shared/components/icons';
import { SETTINGS_PATH } from 'constants/urls';
import { useRouterPath } from 'shared/hooks';
import { usePrefixedPush } from 'shared/hooks';

import { HeaderControlButton } from './header-control-button';

export const HeaderSettingsButton = () => {
  const push = usePrefixedPush();
  const route = useRouterPath();
  const handleClick = useCallback(() => push(SETTINGS_PATH), [push]);

  return (
    <HeaderControlButton
      isActive={route === SETTINGS_PATH}
      onClick={handleClick}
    >
      <GearIcon />
    </HeaderControlButton>
  );
};
