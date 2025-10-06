import { useLidoSDK } from '../providers/lido-sdk';
import { Layout } from '../shared/components';
import { ClientOnlySettingsForm } from '../features/settings/components/settings-form/client-only-settings-form';

export default function SettingsPage() {
  const { chainId } = useLidoSDK();

  return (
    <Layout containerSize="full">
      <ClientOnlySettingsForm key={chainId} />
    </Layout>
  );
}

export const getStaticProps = async () => {
  return {
    props: {},
  };
};
