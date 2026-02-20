import { GearIcon } from 'shared/components/icons';
import { SETTINGS_PATH } from 'constants/urls';
import { HeaderControlButton } from './style';
import { useRouter } from 'next/router';

export const HeaderSettingsButton = () => {
  const router = useRouter();

  // TODO: should be a link, not a button
  return (
    <HeaderControlButton
      disabled={router.asPath === SETTINGS_PATH}
      onClick={() => router.push(SETTINGS_PATH)}
    >
      <GearIcon />
    </HeaderControlButton>
  );
};
