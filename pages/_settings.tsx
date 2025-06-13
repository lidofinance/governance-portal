import { FC } from 'react';
import { Layout } from 'shared/components';
import { getDefaultStaticProps } from 'utils-api/get-default-static-props';

const _settings: FC = () => {
  return (
    <Layout>
      <h1>_settings</h1>
    </Layout>
  );
};

export const getStaticProps = getDefaultStaticProps(async () => {
  // if (!config.ipfsMode) return { notFound: true };

  return { props: {} };
});

export default _settings;
