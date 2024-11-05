import { GearIcon } from 'shared/components/icons';
import { SETTINGS_PATH } from 'constants/urls';
import { useRouterPath } from 'shared/hooks';
import { usePrefixedPush } from 'shared/hooks';

import { HeaderControlButton } from './style';

export const HeaderSettingsButton = () => {
  const push = usePrefixedPush();
  const route = useRouterPath();

  return (
    <HeaderControlButton
      disabled
      isActive={route === SETTINGS_PATH}
      onClick={() => push(SETTINGS_PATH)}
    >
      <GearIcon />
    </HeaderControlButton>
  );
};
