import { GearIcon } from 'shared/components/icons';
import { SETTINGS_PATH } from 'constants/urls';

import { HeaderControlButton } from './style';

export const HeaderSettingsButton = () => {
  return (
    <HeaderControlButton href={SETTINGS_PATH} passHref>
      <GearIcon />
    </HeaderControlButton>
  );
};
