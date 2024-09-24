import { FC } from 'react';

import { config } from 'config';
import { Layout } from 'shared/components';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

const Settings: FC = () => {
  return (
    <Layout title="Settings">
      <h1>Settings</h1>
    </Layout>
  );
};

export const getStaticProps = getDefaultStaticProps(async () => {
  if (!config.ipfsMode) return { notFound: true };

  return { props: {} };
});

export default Settings;
