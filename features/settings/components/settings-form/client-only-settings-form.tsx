import dynamic from 'next/dynamic';
import { Loader } from '@lidofinance/lido-ui';

const SettingsFormComponent = dynamic(
  async () => {
    const mod = await import('./settings-form');
    return mod.SettingsForm;
  },
  {
    ssr: false,
    loading: () => <Loader />,
  },
);

export const ClientOnlySettingsForm = () => {
  return <SettingsFormComponent />;
};
